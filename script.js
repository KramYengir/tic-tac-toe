
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

    let getFreeCells = ()=>{
        let freeCells = [];

        board.forEach((el, index)=>{
            if(el === ''){
                freeCells.push(index);
            }
        })

        return freeCells;
    }

    let getBoard = ()=>{
        return board;
    }

    return {
        printBoard,
        markBoard,
        getPlayerSpaces,
        resetBoard,
        getBoard,
        getFreeCells
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

    let isGameover = false;

    let initPlayers = (p1, p2)=>{
        player1 = createPlayer(p1, 'X');
        player2 = createPlayer(p2, 'O');

        currentPlayer = player1;
    }

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

    let checkForWin = ()=>{
        let result = false;

        for (let i = 0; i <= 7; i++) {
            
            const winPattern = winConditions[i];
            let a = gameBoard.getBoard()[winPattern[0]];
            let b = gameBoard.getBoard()[winPattern[1]];
            let c = gameBoard.getBoard()[winPattern[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }

            if (a === b && b === c) {
                result = true;
                break
            }
        }

        return result;

    }

    // all the different winning patterns for comparison


    let getCurrentPlayer = ()=>{
        return currentPlayer;
    }

    let getP1Score = ()=>{
        return player1.getScore();
    }

    let getP2Score = ()=>{
        return player2.getScore();
    }

    let changePlayer = ()=>{
        currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
        uiManager.setBoardTurn();
    } 

    let makeMove = (index) =>{
        if(newGameboard.markBoard(currentPlayer.sign, index)){
            moveCount++;
            checkForResult();
            changePlayer();
            console.log(moveCount);

            //if playing vs computer, manage computer turn
            if(currentPlayer.name === 'Computer' && !isGameover){
                makeComputerMove();
            }
        }

    }

    let makeComputerMove = ()=>{
        let freeCells = gameBoard.getFreeCells();
        let randomIndex = helpers.getRandomIndex(freeCells.length);

        uiManager.markCell(freeCells[randomIndex], currentPlayer.sign)
        makeMove(freeCells[randomIndex]);
    }

    let checkForResult = ()=>{

        if(checkForWin()){
            console.log('gameover')
            currentPlayer.increaseScore();
            manageEndgame(currentPlayer.name + ' Wins!');
            isGameover =true;
        }
        else if(moveCount>=9){
            manageEndgame("It's a tie!")
            isGameover = true;
        }
    }

    let manageEndgame = (msg)=>{
        uiManager.displayResult(msg);
    }

    let restart = ()=>{
        moveCount = 0;
        newGameboard.resetBoard();
        currentPlayer = player1;
        uiManager.setBoardTurn();
        isGameover = false;
    }

    return {
        initPlayers,
        makeMove,
        restart,
        getCurrentPlayer,
        manageEndgame,
        getP1Score,
        getP2Score
    }
})();

const helpers = (()=>{

    let getRandomIndex = (max)=> {
        return Math.floor(Math.random() * max);
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
        getRandomIndex,
        getNamesFromInput
    }
})();

const uiManager = (()=>{

    const modal = document.querySelector('.modal');
    const player1Input = document.querySelector('#player1-input');
    const player2Input = document.querySelector('#player2-input');
    const computerCheckbox = document.querySelector('#computer');
    const readyButton = document.querySelector('#ready-button')

    const p1ScoreName = document.querySelector('.p1-name');
    const p2ScoreName = document.querySelector('.p2-name');
    const p1Score = document.querySelector('.p1-score');
    const p2Score = document.querySelector('.p2-score');

    const board = document.querySelector('.board');
    const cells = [...document.getElementsByClassName('cell')];
    const resultDisplay = document.querySelector('.result-display');
    const resultMessage = document.querySelector('.message');
    const restartButton = document.querySelector('#restart-button');
    const nextButton = document.querySelector('#next-button');

    let player1, player2;
    let playComputer = false;

    computerCheckbox.addEventListener('click', ()=>{
        setComputerStatus();
    })

    restartButton.addEventListener('click', ()=>{
        location.reload();
    })
    
    readyButton.addEventListener('click', ()=>{
        setPlayerNames();
        toggleModal();
        setBoardTurn();

    })
    
    nextButton.addEventListener('click', ()=>{
        game.restart();
        resultDisplay.classList.remove('active');
        resetBoardDisplay();
        updateScoreDisplay();
    })
    
    
    cells.forEach((cell, index) =>{
        cell.addEventListener('click', ()=>{
            handleClick(cell, index);
        })
    })

    let setComputerStatus = ()=>{
        if(computerCheckbox.checked){
            player2Input.disabled = true;
            playComputer = true;
        }
        else {
            player2Input.disabled = false;
            playComputer = false;
        }
    }

    let getComputerStatus = ()=>{
        return playComputer;
    }
    
    let setPlayerNames = ()=>{
        let playerNames = helpers.getNamesFromInput(player1Input, player2Input);
        
        player1 = playerNames.player1;

        player2 = playComputer ? 'Computer' : playerNames.player2;

        p1ScoreName.textContent = player1;
        p2ScoreName.textContent = player2;


        game.initPlayers(player1, player2);
    }

    let getPlayerNames = ()=>{
        return {
            player1,
            player2
        }
    }

    let updateScoreDisplay = ()=>{
        p1Score.textContent = game.getP1Score();
        p2Score.textContent = game.getP2Score();

    }

    let toggleModal = ()=>{
        modal.classList.toggle('hide');
    }

    let setBoardTurn = ()=>{
        if(game.getCurrentPlayer().sign === 'X'){
            board.classList.add('X');
            board.classList.remove('O');

        }
        else{
            board.classList.add('O');
            board.classList.remove('X');
        }
    }

    let handleClick = (cell, index)=>{
        if(cell.classList.contains('X') || cell.classList.contains('O'))
            return;

        markCell(index, game.getCurrentPlayer().sign);
        game.makeMove(index);
    }

    let markCell = (index, sign)=>{
        cells[index].classList.add(sign);
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
        getPlayerNames,
        setBoardTurn,
        getComputerStatus,
        markCell
    }
})();