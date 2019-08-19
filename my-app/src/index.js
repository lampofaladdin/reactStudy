import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//返回 button按钮，button上的onclic事件会触发 父组件的ontouch事件
function Square(props) {
    return (
        <button
            className='square'
            onClick={props.onTouch}
        >
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    //渲染squar组件 可以直接写在render里面，但是不好看
    renderSquare(i) {
        return <Square
            key={i}
            //父组件传递一个数组过来，value为父组件squares[i]
            value={this.props.squares[i]}
            //子组件点击后会触发onTouch方法，然后触发父组件的ontouch方法，并穿参数
            onTouch={() => { this.props.onTouch(i) }}
        />;
    }

    //循环渲染棋盘
    renderBorder() {
        let result = [];
        for (let i = 0; i < 3; i++) {
            let childDom = []
            for (let j = 0; j < 3; j++) {
                childDom.push(this.renderSquare(i * 3 + j));
            }
            result.push(<div key={i} className="board-row">{childDom}</div>)
        }
        return result;
    }

    //渲染棋盘
    render() {
        return (
            <div>
                {this.renderBorder()}
            </div>
        );
    }
}

//最终渲染
class Game extends React.Component {

    //hisotry为历史记录，XisNext是下一步是X还是O，stepNmumber用来存放历史记录
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    clicked: null,
                }
            ],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    //ontouch事件触发的方法
    handleClick(i) {

        //如果不根据setNumber进行截取，点击回退以后，在点击棋盘会导致未来的步数会错误，并且会一直累加hisotry数组
        const history = this.state.history.slice(0, this.state.stepNumber + 1);

        //得到最后一次点击的数据
        const current = history[history.length - 1];

        //因为数组是地址引用，所以要创建一个新的数组
        const squares = current.squares.slice();

        //判断游戏是否结束 如果结束，无法点击棋盘，判断是否当前点击的格子有内容，如果有，无法点击该格子
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        //判断本次点击的生成的是X还是O
        squares[i] = this.state.xIsNext ? "X" : "O";

        //更新状态，squares为一个新的数组，并且内容跟新过conncat方式存放在hisotry中
        //XisNext取反，保证下次点击button上的value是否为X
        //stepNumber为数组的长度，保证保证步数跟数组长度一致
        this.setState({
            history: history.concat([{
                squares: squares,
                clicked: i
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            sort: true
        })
    }

    //跳转历史继续方法，更新stepNumber与xIsnext
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,

        });
    }

    render() {

        //因为只是做渲染并未修改内容，所以不使用slice方法
        const history = this.state.history;

        //当前展示的内容为stepNumber对应的内容
        const current = history[this.state.stepNumber];

        //map遍历数组，返回一个虚拟DOM列表
        const moves = history.map((setp, move) => {
            const row = Math.floor(setp.clicked / 3) + 1;
            const col = setp.clicked % 3;
            const desc = move ?
                `go to game at # ${move} point is [${row},${col}]` :
                `go to game start`;
            return (
                <li key={move} className={move === this.state.stepNumber ? "strong" : ""} >
                    <button onClick={() => { this.jumpTo(move) }}>{desc}</button>
                </li>
            )
        });

        let status;
        const winner = calculateWinner(current.squares);
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onTouch={(i) => { this.handleClick(i) }}
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

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
