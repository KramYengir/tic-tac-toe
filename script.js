


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

const createPlayer = (name, sign)=>{
    let score = 0;

    let increaseScore = ()=>{
        score++;
    }

    let getScore = ()=>{
        return score;
    }

    return {
        name,
        sign,
        increaseScore,
        getScore
    }
}

const game = (()=>{

    let newGameboard = gameBoard;
    let moveCount = 0;
    let player1, player2;
    let currentPlayer;

    let initPlayers = (p1, p2)=>{
        player1 = createPlayer(p1, 'X');
        player2 = createPlayer(p2, 'O');

        currentPlayer = player1;
    }

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


    let getCurrentPlayer = ()=>{
        return currentPlayer;
    }

    let changePlayer = ()=>{
        currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
    } 

    let makeMove = (index) =>{
        if(newGameboard.markBoard(currentPlayer.sign, index)){
            moveCount++;
            checkResult();
            changePlayer();
        }

    }

    let checkResult = ()=>{
        // first we get all the spaces marked by the current player
        let playerSpaces = newGameboard.getPlayerSpaces(currentPlayer.sign);

        // then go thru all the winning patterns and using
        // a helper function we compare with the player's patterns
        winConditions.forEach((winPattern)=>{
            if(helpers.compareArrays(winPattern, playerSpaces)){
                console.log('gameover')
                currentPlayer.increaseScore();
                manageEndgame(currentPlayer.name + ' Wins!');
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
        currentPlayer = player1;
    }

    return {
        initPlayers,
        makeMove,
        restart,
        getCurrentPlayer,
        manageEndgame
    }
})();

const helpers = (()=>{
    
    const compareArrays = (a, b)=> {
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

    const getNamesFromInput = (input1, input2)=>{
        let player1, player2;
        
        if(input1.value.trim() == ''){
            player1 = 'Player 1'
        }
        else player1 = input1.value;

        if(input2.value.trim() == ''){
            player2 = 'Player 2'
        }
        else player2 = input2.value;

        return{
            player1,
            player2
        }
    }


    return{
        compareArrays,
        getNamesFromInput
    }
})();

const uiManager = (()=>{

    const modal = document.querySelector('.modal');
    const player1Input = document.querySelector('#player1-input');
    const player2Input = document.querySelector('#player2-input');
    const readyButton = document.querySelector('#ready-button')


    const cells = [...document.getElementsByClassName('cell')];
    const resultDisplay = document.querySelector('.result-display');
    const resultMessage = document.querySelector('.message');
    const restartButton = document.querySelector('#restart-button');

    let player1, player2;

    readyButton.addEventListener('click', ()=>{
        setPlayerNames();
        toggleModal();

    })
    
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
    
    let setPlayerNames = ()=>{
        let playerNames = helpers.getNamesFromInput(player1Input, player2Input);
        
        player1 = playerNames.player1;
        player2 = playerNames.player2;

        game.initPlayers(player1, player2);
    }

    let getPlayerNames = ()=>{
        return {
            player1,
            player2
        }
    }

    let toggleModal = ()=>{
        modal.classList.toggle('hide');
    }

    let resetPlayerInputs = ()=>{
        player1Input.value = 'Player 1';
        player2Input.value = 'Player 2';

    }

    let handleClick = (cell, index)=>{
        if(cell.classList.contains('X') || cell.classList.contains('O'))
            return;

        cell.classList.add(game.getCurrentPlayer().sign);
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
        getPlayerNames
    }
})();