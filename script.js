const PLAYER1 = 'X';
const PLAYER2 = 'O';

const gameBoard = (()=>{
    let board = ['','','','','','','','','',];

    let markBoard = (player, index)=>{
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
        /* console.table(board); */
        console.table(board)
    }

    let resetBoard = ()=>{
        board = ['','','','','','','','','',];
    }

    let getPlayerSpaces = (player)=>{
        let playerCells = [];

        board.forEach((el, index)=>{
            if(el === player){
                playerCells.push(index);
            }
        })

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

    let currentPlayer = 'X';

    let changePlayer = ()=>{
        currentPlayer === 'X' ? currentPlayer = 'O' : currentPlayer = 'X';
        console.log('workes'); 

    } 

    let makeMove = (index) =>{
        if(gameBoard.markBoard(currentPlayer, index)){
            checkWin();
            changePlayer();
        }

    }

    let checkWin = ()=>{
        let playerSpaces = gameBoard.getPlayerSpaces(currentPlayer);
        console.log(playerSpaces);

        winConditions.forEach((el)=>{
            if(helpers.compareArrays(el, playerSpaces)){
                console.log(currentPlayer + ' WINSSSSS')
                restart();
            }
        })
    }

    let restart = ()=>{
        gameBoard.resetBoard();
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