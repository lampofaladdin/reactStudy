function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],//0
        [3, 4, 5],//0
        [6, 7, 8],//0
        [0, 4, 8],//45
        [0, 3, 6],//90
        [1, 4, 7],//90
        [2, 5, 8],//90
        [2, 4, 6],//135
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            let direction = "deg0";
            switch (true) {
                case i < 3: direction = "deg0"; break;
                case i < 4: direction = "deg45"; break;
                case i < 7: direction = "deg90"; break;
                default: direction = "deg135"; break;
            }
            return {
                name: squares[a],
                key: [a, b, c],
                direction
            };
        }
    }
    return null;
}

export default calculateWinner;