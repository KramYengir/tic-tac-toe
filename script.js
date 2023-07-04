


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
    let moveCount = 0;

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

    let getCurrentPlayer = ()=>{
        return currentPlayer;
    }

    let changePlayer = ()=>{
        currentPlayer === 'X' ? currentPlayer = 'O' : currentPlayer = 'X';
    } 

    let makeMove = (index) =>{
        if(newGameboard.markBoard(currentPlayer, index)){
            moveCount++;
            checkResult();
            changePlayer();
        }

    }

    let checkResult = ()=>{
        // first we get all the spaces marked by the current player
        let playerSpaces = newGameboard.getPlayerSpaces(currentPlayer);

        // then go thru all the winning patterns and using
        // a helper function we compare with the player's patterns
        winConditions.forEach((winPattern)=>{
            if(helpers.compareArrays(winPattern, playerSpaces)){
                console.log('gameover')
                manageEndgame(currentPlayer + ' Wins!');
            }
            else if(moveCount>=9)
                manageEndgame("It's a tie!")
        })
    }

    let manageEndgame = (msg)=>{
        uiManager.displayResult(msg);
    }

    let restart = ()=>{
        moveCount = 0;
        newGameboard.resetBoard();
        currentPlayer = 'X';
    }

    return {
        makeMove,
        restart,
        getCurrentPlayer,
        manageEndgame
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

const uiManager = (()=>{
    const board = document.getElementsByClassName('board');
    const cells = [...document.getElementsByClassName('cell')];
    const resultDisplay = document.querySelector('.result-display');
    const resultMessage = document.querySelector('.message');
    const restartButton = document.querySelector('#restart-button');

    restartButton.addEventListener('click', ()=>{
        game.restart();
        resultDisplay.classList.remove('active');
        resetBoardDisplay();
    })


    cells.forEach((cell, index) =>{
        cell.addEventListener('click', ()=>{
            handleClick(cell, index);
        })
    })

    let handleClick = (cell, index)=>{
        if(cell.classList.contains('X') || cell.classList.contains('O'))
            return;

        cell.classList.add(game.getCurrentPlayer());
        game.makeMove(index);
    }

    let displayResult = (msg)=>{
        resultDisplay.classList.add('active');
        resultMessage.textContent = msg;
    }

    let resetBoardDisplay = ()=>{
        cells.forEach(cell =>{
            cell.classList.remove('O');
            cell.classList.remove('X');

        })
    }

    return {
        displayResult,
    }
})();