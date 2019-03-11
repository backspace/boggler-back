var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

class Board {
    constructor(array) {
      this.array = array;
      this.width = Math.sqrt(array.length);
      this.height = this.width;
    }
  
    valueAt({row, column}) {
      return this.array[row * this.width + column];
    }
  
    setValueAt({row, column}, value) {
      return this.array[row * this.width + column] = value;
    }
  
    clone() {
      return new Board(this.array.slice());
    }
  
    get positions() {
      return Array(this.height).fill(null).reduce((positions, _, row) => {
        return positions.concat(Array(this.height).fill(null).map((_, column) => {
          return {row, column}
        }));
      }, []);
    }
  
    getAdjacentPositions({row, column}) {
      let positions = [];
  
      if (row > 0) {
        if (column > 0) {
          positions.push({row: row - 1, column: column - 1});
        }
  
        positions.push({row: row - 1, column});
  
        if (column + 1 < this.width) {
          positions.push({row: row - 1, column: column + 1});
        }
      }
  
      if (column > 0) {
        positions.push({row, column: column - 1});
      }
  
      if (column + 1 < this.width) {
        positions.push({row, column: column + 1});
      }
  
      if (row + 1 < this.height) {
        if (column > 0) {
          positions.push({row: row + 1, column: column - 1});
        }
  
        positions.push({row: row + 1, column});
  
        if (column + 1 < this.width) {
          positions.push({row: row + 1, column: column + 1});
        }
      }
  
      return positions;
    }
  }
  
function wordFinder(boardString, words) {
    let board = new Board(Array.from(boardString));
  
    let foundWords = board.positions.reduce((foundWords, position) => {
      let visitationBoard = new Board(Array(boardString.length).fill(false));
  
      return foundWords.concat(findWordsFrom(board, '', words, position, visitationBoard))
    }, []);
    return foundWords;
  }
  
  function findWordsFrom(board, stem, words, position, visitationBoard) {
    let characterAtPosition = board.valueAt(position);
    let newStem = `${stem}${characterAtPosition}`;
  
    if (words.some(word => word.startsWith(newStem))) {
      let newVisitationBoard = visitationBoard.clone();
      newVisitationBoard.setValueAt(position, true);
  
      let unvisitedAdjacentPositions = board.getAdjacentPositions(position).filter(adjacentPosition => {
        return !newVisitationBoard.valueAt(adjacentPosition);
      });
  
      let wordsFromAdjacentPositions = unvisitedAdjacentPositions.reduce((wordsFromAdjacentPositions, adjacentPosition) => {
        return wordsFromAdjacentPositions.concat(
          findWordsFrom(board, newStem, words, adjacentPosition, newVisitationBoard)
        );
      }, []);
  
      if (words.includes(newStem)) {
        return wordsFromAdjacentPositions.concat([newStem]);
      } else {
        return wordsFromAdjacentPositions;
      }
    } else {
      return [];
    }
  }
  
var words = ['ab', 'ad', 'bad'];

app.get('/', function (req, res) {
    res.send(wordFinder('abcd', words));
});

app.listen(port, () => console.log(`running at ${port}`));