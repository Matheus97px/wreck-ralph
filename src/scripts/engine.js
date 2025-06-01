
const state = {
    view: {
        squares: document.querySelectorAll('.square'),
        enemy: document.querySelector('.enemy'),
        timeLeft: document.querySelector('#time-left'),
        score: document.querySelector('#score'),
        ralph: document.querySelector('.ralph'),
        penelope: document.querySelector('.penelope'),
        lives: document.querySelector('#lives'),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3, 
    },
    actions: {
        timerID: setInterval(randomSquare, 700),
        countDownTimerID: setInterval(countDown, 1000),
    }

};




function countDown() {

    state.view.timeLeft.textContent = state.values.currentTime;
    state.values.currentTime--;
    if (state.values.currentTime <= 0) {

        clearInterval(state.actions.countDownTimerID);
        clearInterval(state.actions.timerID);

        checkGameOver();
        
    }

}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);

    audio.play();
    audio.volume = 0.2;

       switch (audioName) {
        case "hit":
            audio.volume = 0.2; 
            break;
        case "miss":
            audio.volume = 1.0; 
            break;
        case "background":
            audio.loop = true;            
            break;
    }
}



function randomSquare() {
    
    state.view.squares.forEach((square) => {
        square.innerHTML = ''; // Limpa o conteúdo de cada quadrado

    })
    const index = Math.floor(Math.random() * state.view.squares.length);
    const chosenSquare = state.view.squares[index];

    const isPenelope = Math.random() < 0.5; 

    const img = document.createElement('img');

    if (isPenelope) {
        img.src = "../detona-ralph-aula/src/images/penolope-.png";
        img.classList.add('penelope');
    } else {
        img.src = "../detona-ralph-aula/src/images/ralph.png";
        img.classList.add('ralph');
        state.values.hitPosition = chosenSquare.id; // Atualiza a posição do hit
    }
    chosenSquare.appendChild(img); // Adiciona a imagem ao quadrado escolhido

}




function addListenerHitBox() {
    state.view.squares.forEach((square) => {

        square.addEventListener('mousedown', () => {
            const clicked = event.target;
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
                clicked.src = "../detona-ralph-aula/src/images/ralph-damage.png";
                clicked.classList.add("damaged")
                setTimeout(() => clicked.classList.remove("damaged"), 300);

            } else if (square.querySelector('.penelope') && square.querySelector('.penelope').src.includes('penolope-.png')) {
                state.values.lives--;
                state.view.lives.textContent = state.values.lives;
                clicked.src = "../detona-ralph-aula/src/images/penolope-damage.png";
                playSound("miss");
                 clicked.classList.add("damaged")
                setTimeout(() => clicked.classList.remove("damaged"), 300);
                if (state.values.lives <= 0) {
                    clearInterval(state.actions.timerID);
                    clearInterval(state.actions.countDownTimerID);
                    checkGameOver();
                }
            }
        })

    })

}

function checkGameOver() {
    const popup = document.querySelector('#game-over-popup');
    const finalScore = document.querySelector('#final-score');
    const restartBtn = document.querySelector('#popup-restart');
    const highScore = localStorage.getItem('highScore') || 0;

     finalScore.textContent = state.values.result;
     
     if (state.values.result > highScore){
        localStorage.setItem('highScore', state.values.result);
        document.querySelector("#high-score").textContent = state.values.result;
        
        const bonus = document.createElement('p');
        bonus.textContent = "New Record!";
        bonus.style.color = "#33a8db";
        bonus.style.marginTop = "10px";
        popup.querySelector('.popup-content').appendChild(bonus);
    }

   
    popup.classList.add('visible');
    popup.classList.remove('hidden');
    restartBtn.addEventListener('click', () => {
        location.reload();
    })

}





function init() {
    playSound("background");
    const saveHighScore = localStorage.getItem('highScore') || 0;
    document.querySelector("#high-score").textContent = saveHighScore;
    addListenerHitBox();
}

init();



