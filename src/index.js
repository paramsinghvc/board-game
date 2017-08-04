import {
    Board
} from './board.js';

const el = document.getElementById('board-holder');
const board = new Board(el);
board.init();
