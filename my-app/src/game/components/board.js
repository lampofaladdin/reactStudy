
import React from 'react';
import Square from './square'

class Board extends React.Component {

    //渲染squar组件 可以直接写在render里面，但是不好看
    renderSquare(i) {
        //获取到父组件传来的winner对象
        const winner = this.props.winner;
        // 得到winner对象对应的方向
        let btnClassName = winner && winner.name && winner.key.includes(i) ? winner.direction : '';
        return <Square
            key={i}
            //父组件传递一个数组过来，value为父组件squares[i]
            value={this.props.squares && this.props.squares[i]}
            //传给子组件class名
            btnClassName={btnClassName}
            //子组件点击后会触发onTouch方法，然后触发父组件的ontouch方法，并穿参数
            onTouch={() => { this.props.onTouch(i) }}
        />;
    }

    //循环渲染棋盘
    renderBorder() {
        //循环键盘对象
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

export default Board;