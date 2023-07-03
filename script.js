


const gameBoard = (()=>{
    let board = ['','','','','','','','','',];

    // marks a space on the board with the player's sign (X or O)
    let markBoard = (player, index)=>{

        // check if the space if free first
        if(checkMoveValid(index)){
            board[index] = player;
            return true;
        }
        else{
            console.log('INVALID MOVE!');
            return false;
        }
    }

    let printBoard = ()=>{
        console.table(board)
    }

    let resetBoard = ()=>{
        board = ['','','','','','','','','',];
    }

    // get an array of all the current spaces marked by the player 
    let getPlayerSpaces = (player)=>{
        let playerCells = [];

        board.forEach((el, index)=>{
            if(el === player){
                playerCells.push(index);
            }
        })

        // sort the array numerically, just to make comparison easier
        return playerCells.sort();
    }

    let checkMoveValid = (index)=>{
        return board[index] == '';
    }

    return {
        printBoard,
        markBoard,
        getPlayerSpaces,
        resetBoard
    }
})();



const game = (()=>{

    let newGameboard = gameBoard;

    // all the different winning patterns for comparison
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // always start with X
    let currentPlayer = 'X';

    let changePlayer = ()=>{
        currentPlayer === 'X' ? currentPlayer = 'O' : currentPlayer = 'X';
    } 

    let makeMove = (index) =>{
        if(newGameboard.markBoard(currentPlayer, index)){
            checkWin();
            changePlayer();
        }

    }

    let checkWin = ()=>{
        // first we get all the spaces marked by the current player
        let playerSpaces = newGameboard.getPlayerSpaces(currentPlayer);

        // then go thru all the winning patterns and using
        // a helper function we compare with the player's patterns
        winConditions.forEach((winPattern)=>{
            if(helpers.compareArrays(winPattern, playerSpaces)){
                console.log(currentPlayer + ' WINSSSSS')
                restart();
            }
        })
    }

    let restart = ()=>{
        newGameboard.resetBoard();
        currentPlayer = 'X';
    }

    return {
        makeMove,
        restart
    }
})();

const helpers = (()=>{
    
    let compareArrays = (a, b)=> {
        // check the length
        if (a.length != b.length) {
            return false;
        } else {
            let result = false;
    
            // comparing each element of array 
            for (let i = 0; i < a.length; i++) {
    
                if (a[i] !== b[i]) {
                    return false;
                } else {
                    result = true;
                }
            }
            return result;
        }
    }

    return{
        compareArrays,
    }
})();