const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let dimension;
let field;
let isEnded;
let zeroTurn;
let winIndicies;

startGame();
addResetListener();

function startGame () {
    dimension = parseInt(prompt('Введите размер поля', '3')) || 3;
    field = Array(dimension * dimension).fill(EMPTY);
    renderGrid(dimension);
    isEnded = false;
    zeroTurn = true;
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function checkLine(start, step, length) {
    const value = field[start];
    if (value === EMPTY) return false;
    
    winIndicies = [start];
    for (let i = 1; i < length; i++) {
        const idx = start + step * i;
        if (field[idx] !== value) return false;
        winIndicies.push(idx);
    }
    return true;
}

function checkWin() {
    for (let i = 0; i < dimension; i++) {
        if (checkLine(i * dimension, 1, dimension) || 
            checkLine(i, dimension, dimension)) return true;
    }
    if (checkLine(0, dimension + 1, dimension) || 
        checkLine(dimension - 1, dimension - 1, dimension)) return true;
    return false;
}

function cellClickHandler (row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (isEnded === true || field[row * dimension + col] !== EMPTY)
        return;

    if (zeroTurn === true) {
        field[row * dimension + col] = ZERO;
        renderSymbolInCell(ZERO, row, col);
    } else {
        field[row * dimension + col] = CROSS;
        renderSymbolInCell(CROSS, row, col);
    }

    isEnded = checkWin();

    if (isEnded === true) {
        for (let i in winIndicies)
            renderSymbolInCell(zeroTurn ? ZERO : CROSS, Math.floor(winIndicies[i] / dimension), winIndicies[i] % dimension, 'red');
        alert(`${zeroTurn? 1 : 2}-ый игрок победил!`);
        isEnded = true;
    }
    else if (field.indexOf(EMPTY) === -1) {
        alert('Победила дружба');
        isEnded = true;
    }

    zeroTurn = !zeroTurn;
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    console.log('reset!');
    startGame();
}

function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
