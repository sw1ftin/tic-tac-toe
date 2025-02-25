const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let field;
let isEnded;
let zeroTurn;
let winIndicies;

startGame();
addResetListener();

function startGame () {
    renderGrid(3);
    field = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
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

function check(field, a, b, c) {
    if (field[a] === field[b] && field[b] === field[c] && field[c] !== EMPTY) {
        winIndicies = [a, b, c];
        return true;
    }
    return false;
}

function checkWin () {
    return (check(field, 0, 1, 2) || check(field, 3, 4, 5) || check(field, 6, 7, 8) ||
        check(field, 0, 3, 6) || check(field, 1, 4, 7) || check(field, 2, 5, 8) ||
        check(field, 0, 4, 8) || check(field, 2, 4, 6));
}

function cellClickHandler (row, col) {
    // Пиши код тут
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (isEnded === true || field[row * 3 + col] !== EMPTY)
        return;

    if (zeroTurn === true) {
        field[row * 3 + col] = ZERO;
        renderSymbolInCell(ZERO, row, col);
    } else {
        field[row * 3 + col] = CROSS;
        renderSymbolInCell(CROSS, row, col);
    }

    isEnded = checkWin();

    if (isEnded === true) {
        for (let i in winIndicies)
            renderSymbolInCell(zeroTurn ? ZERO : CROSS, Math.floor(winIndicies[i] / 3) , winIndicies[i] % 3, 'red');
        alert(`${zeroTurn? 1 : 2}-ый игрок победил!`);
        isEnded = true;
    }
    else if (field.indexOf(EMPTY) === -1) {
        alert('Победила дружба');
        isEnded = true;
    }

    zeroTurn = !zeroTurn;

    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
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


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
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
