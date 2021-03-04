import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)} 
      />
    );
  }

  render() {
    const rows = Array.from({length: 3}, (row, rowIndex) => {
      const cols = Array.from({length: 3}, (col, colIndex) => {
        return this.renderSquare(rowIndex * 3 + colIndex)
      })
      return (
        <div className="board-row" key={rowIndex}>
          {cols}
        </div>
      )
    })
    return <div> {rows} </div>;
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [
        { 
          squares: Array(9).fill(null),
          currentIndex: -1
        }
      ],
      stepNumber: 0,
      xIsNext: true
    }
  }
  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if(calculateWinner(squares) || squares[i]) return false;
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{squares, currentIndex: i}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }
  jumpTo (stepNumber) {
    this.setState({
      stepNumber,
      xIsNext: stepNumber % 2 === 0
    })
  }
  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move # ${move}` :
        `Go to start`
      const indexDesc = ~step.currentIndex ? 
        `Current index is ${Math.ceil((step.currentIndex + 1) / 3)}, ${step.currentIndex % 3 + 1}` :
        `No step`
      const spanStyle = {
        fontWeight: move === this.state.stepNumber ? 'bold': 'normal'
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          <span style={spanStyle}> ---- {indexDesc}</span>
        </li>
      )
    })

    let status;
    if (winner) {
      status = `Winner is ${winner}`
    } else if (this.state.stepNumber !== 9) {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    } else {
      status = `Tie game`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for(const line of lines) {
    const [a, b, c] = line
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) return squares[a]
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);