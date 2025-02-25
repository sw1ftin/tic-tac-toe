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

function startGame (dimensionN, fieldN, isEndedN, zeroTurnN, newFlag = false) {
    if (!newFlag){
        dimension = parseInt(prompt('Введите размер поля', '3')) || 3;
        field = Array(dimension * dimension).fill(EMPTY);
        renderGrid(dimension);
        isEnded = false;
        zeroTurn = true;
    } else{
        dimension = dimensionN;
        field = fieldN;
        isEnded = isEndedN;
        zeroTurnN = zeroTurnN;
        renderGrid(dimension);
    }
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = field[i * dimension + j];
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

function makeAiMove() {
    const emptyCells = field.reduce((acc, cell, idx) => {
        if (cell === EMPTY) acc.push(idx);
        return acc;
    }, []);
    
    for (let idx of emptyCells) {
        field[idx] = CROSS;
        if (checkWin()) {
            const row = Math.floor(idx / dimension);
            const col = idx % dimension;
            renderSymbolInCell(CROSS, row, col);
            return true;
        }
        field[idx] = EMPTY;
    }
    
    if (emptyCells.length > 0) {
        const randomIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const row = Math.floor(randomIdx / dimension);
        const col = randomIdx % dimension;
        field[randomIdx] = CROSS;
        renderSymbolInCell(CROSS, row, col);
        return true;
    }
    return false;
}

function localCount(arr, elem){
    let numb = 0;
    for (let i = 0; i < arr.length; i++){
        if (arr[i] === elem){
            numb++;
        }
    }
    return numb;
}

function checkIfHalfFilled(){
    if (localCount(field, EMPTY) >= dimension*dimension / 2) return;
    let newField = Array((dimension + 2)*(dimension + 2)).fill(EMPTY);
    for (let i = 0; i < dimension; i++){
        for (let j = 0; j < dimension; j++){
            newField[(i + 1)* (dimension + 2) + j + 1] = field[i * dimension + j];
        }
    }
    dimension += 2;
    field = newField;
    startGame(dimension, field, isEnded, zeroTurn, true);
}

function cellClickHandler (row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (isEnded === true || !zeroTurn || field[row * dimension + col] !== EMPTY)
        return;

    field[row * dimension + col] = ZERO;
    renderSymbolInCell(ZERO, row, col);

    if (checkWin()) {
        for (let i in winIndicies)
            renderSymbolInCell(ZERO, Math.floor(winIndicies[i] / dimension), winIndicies[i] % dimension, 'red');
        alert('Вы победили!');
        isEnded = true;
        return;
    }
    
    if (field.indexOf(EMPTY) === -1) {
        alert('Победила дружба');
        isEnded = true;
        return;
    }

    checkIfHalfFilled();
    zeroTurn = false;
    makeAiMove();
    if (checkWin()) {
        for (let i in winIndicies)
            renderSymbolInCell(CROSS, Math.floor(winIndicies[i] / dimension), winIndicies[i] % dimension, 'red');
        alert('Компьютер победил!');
        isEnded = true;
        return;
    }
    zeroTurn = true;
    checkIfHalfFilled();
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
