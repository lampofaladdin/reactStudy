
import React from 'react';
//返回 button按钮，button上的onclic事件会触发 父组件的ontouch事件
function Square(props) {
    return (
        <button
            className={`square ${props.btnClassName}`}
            onClick={props.onTouch}
        >
            {props.value}
        </button>
    )
}

export default Square;