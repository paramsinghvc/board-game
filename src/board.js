import {
    config
} from './config';

export class Board {
    constructor(boardHolder) {
        this.boardHolder = boardHolder;
        this.resultHolder = document.getElementById('level-result');
        this.levelScore = 0;
        this.passingScore = 0;
        this.level = 0;
    }

    createCell() {
        let cell = document.createElement('section');
        cell.addEventListener('click', this.markScore.bind(this));
        cell.classList.add('board-cell');
        return cell;
    }

    appendCell(cell) {
        this.boardHolder.appendChild(cell);
    }

    setLevelInfo() {
        let levelNum = document.getElementById('level-num');
        let levelTime = document.getElementById('level-time');
        let levelScore = document.getElementById('level-score');
        levelNum.innerText = this.level + 1;
        levelTime.innerText = config.LEVEL_TIME;
        levelScore.innerText = this.passingScore;
    }

    init() {
        this.initLevel(this.level);
    }

    initLevel(levelNumber) {
        let level = config.LEVELS[levelNumber];
        this.passingScore = level.SCORE;
        this.setLevelInfo();
        this.boardHolder.style.gridTemplateRows = new Array(level.GRID_ROWS + 1).join('50px ');
        this.boardHolder.style.gridTemplateColumns = new Array(level.GRID_COLS + 1).join('50px ');
        // this.boardHolder.style.gridTemplateRows = ;
        this.generateBoard(level.GRID_ROWS, level.GRID_COLS);

        let levelInterval = setInterval(() => {
            this.lightUpRandomCell(level.GRID_ROWS * level.GRID_COLS);
        }, config.LIT_INTERVAL * 1000);

        setTimeout(() => {
            clearInterval(levelInterval);
            this.showLevelScoreResult();
            console.log('ended');
        }, config.LEVEL_TIME * 1000);
    }

    markScore(e) {
        if (e.target.classList.contains('lit')) {
            this.levelScore += 3;
        } else {
            this.levelScore -= 1;
        }
    }

    showLevelScoreResult() {
        let score = this.evaluateAndSaveScore();
        this.resultHolder.innerText = `Your score for level ${this.level + 1} is: ${score}`;

        setTimeout(() => {
            this.resultHolder.innerText = '';
            if (score < this.passingScore) {
                alert('GAME OVER');
            } else {
                this.incrementLevel();
            }
        }, 3000);
    }

    incrementLevel() {
        if (this.level === config.LEVELS.length) {
            console.log('GAME SUCCEEDED');
            alert('GAME SUCCEEDED');
        }
        this.resetCells();
        this.level++;
        this.levelScore = 0;
        this.setLevelInfo();
        this.initLevel(this.level);
    }

    evaluateAndSaveScore() {
        localStorage.setItem(`level-${this.level + 1}`, this.levelScore);
        return this.levelScore;
    }

    generateBoard(x, y) {
        this.boardHolder.innerHTML = '';
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                let cell = this.createCell();
                this.appendCell(cell);
            }
        }
    }

    getCells() {
        let childrenNodes = this.boardHolder.querySelectorAll('.board-cell');
        return Array.prototype.slice.call(childrenNodes);
    }

    lightUpRandomCell(maxLimit) {
        let randomIndex = this.generateRandomNumber(0, maxLimit);
        let cells = this.getCells();
        this.resetCells(cells);
        let cellToLight = cells[randomIndex];

        cellToLight.classList.add('lit');
    }

    resetCells(cells$) {
        let cells = cells$ || this.getCells();
        cells.forEach(cell => cell.classList.remove('lit'));
    }

    generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
