import React from 'react';
import Board from './board';
import calculateWinner from '../untils/calculateWinner'

//最终渲染
class Game extends React.Component {

    //hisotry为历史记录，XisNext是下一步是X还是O，stepNmumber用来存放历史记录,sort表示正序还是倒序，winner表示哪个赢了，赢
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
            winner: {
                name: null,
                key: null,
                direction: null
            }
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

        //获取到内容
        let winner = calculateWinner(squares);
        //判断游戏是否结束 如果结束，无法点击棋盘，判断是否当前点击的格子有内容，如果有，无法点击该格子
        if (squares[i]) {
            return;
        }
        if (winner && winner.name) {
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
            winner: calculateWinner(squares)
        });
    }

    //跳转历史继续方法，更新stepNumber与xIsnext
    //需要先更新stepNumber，然后再根据stepNumber找到正确的历史记录，并更新winner
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        }, () => {
            const squares = this.state.history[this.state.stepNumber];
            this.setState({
                winner: calculateWinner(squares.squares)
            })
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
        const winner = calculateWinner(current.squares);

        if (winner && winner.name) {
            status = 'Winner: ' + winner.name;
        } else if (history.length === 10) {
            status = "Draw game";
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winner={this.state.winner}
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

export default Game;