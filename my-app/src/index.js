import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//返回 button按钮，button上的onclic事件会触发 父组件的ontouch事件
function Square(props) {
    return (
        <button
            className={`square ${props.isStrong ? 'strong' : ''}`}
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
            isStrong={this.props.winnerKey && this.props.winnerKey.includes(i) ? true : false}
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
            sort: true,
            winnerKey: null
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


        let winnerObj = calculateWinner(squares);

        //判断游戏是否结束 如果结束，无法点击棋盘，判断是否当前点击的格子有内容，如果有，无法点击该格子

        if (squares[i]) {
            return;
        }
        if (winnerObj && winnerObj.winner) {
            return
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
            winner: calculateWinner(squares) && calculateWinner(squares).winnerKey
        });
    }

    //跳转历史继续方法，更新stepNumber与xIsnext
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    //排序按钮点击事件
    sortByKey() {
        this.setState({
            sort: !this.state.sort
        });
    }

    //渲染排序按钮
    renderSortButton() {
        const sort = `sort by ${this.state.sort ? 'asc' : 'desc'} `
        return <button onClick={() => { this.sortByKey() }}>{sort}</button>
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

        //根据sort判断是否降序
        const sortMoves = this.state.sort ? moves.sort((a, b) => a.key - b.key) : moves.sort((a, b) => b.key - a.key);

        let status;
        const winner = calculateWinner(current.squares) && calculateWinner(current.squares).winner;
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
                        winnerKey={this.state.winnerKey}
                        onTouch={(i) => { this.handleClick(i) }}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{this.renderSortButton()}</div>
                    <ol>{sortMoves}</ol>
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
        [0, 1, 2],//0
        [3, 4, 5],//0
        [6, 7, 8],//0
        [2, 4, 6],//45
        [0, 3, 6],//90
        [1, 4, 7],//90
        [2, 5, 8],//90
        [0, 4, 8],//135
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            let direction = "deg0";
            switch (i) {
                case i < 3: direction = "deg0"; break;
                case i < 4: direction = "deg45"; break;
                case i < 8: direction = "deg90"; break;
                case i < 9: direction = "deg135"; break;
            }
            return {
                winner: squares[a],
                winnerKey: [a, b, c],
                direction
            };
        }
    }
    return null;
}
