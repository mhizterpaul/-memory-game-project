


/*
 * GAME PAUL CHINONSO
 *   
 */


//cache all needed let variables in the global scope

let refresh,
    points = 0, initPoint = 1,
	point = document.createElement('span'),
	streak = 0,
	time= 0,
	interval,
	counterInterval,
	countDownEl = document.querySelector('div.count-down'),
	counterSec= 0,
	counterMin = 0,
	timerEl = document.getElementById('time-count'),
	mssgContainer = document.querySelector('div.container'),
	fragment = document.createDocumentFragment(),
	section = document.createElement('section'),
	header = document.createElement('h1'),
	starContainer = document.createElement('ul'),
	mssg = document.createElement('p'),
	button = document.createElement('button'),  
	openCard = 0, matchCount = 0, el1, el2, toggle1, toggle2, move = 0,
	infoPanel, firstCard, movesEl = document.getElementById('moves'), congratulationsMsg, toggleInterval;

//cache all needed const variables
const deck = document.querySelector('ul.deck'), 
      pointEl = document.getElementById('points'),
      notice1 = document.getElementById('notice1'),
      notice2 = document.getElementById('notice2'),
      notice3 = document.getElementById('notice3'),
      notice4 = document.getElementById('notice4'),
      cards = document.querySelectorAll('li.card'),
      cardPosteriors = document.querySelectorAll('div.card-posterior');

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


//function to assign symbols to each shuffled cards
const shuffleCards = function(){
	const cardItems = document.querySelectorAll('li.card>i');
	const cardSymbols = [
	"fa-diamond",
	"fa-paper-plane-o",
	"fa-anchor",
	"fa-bolt",
	"fa-cube",
	"fa-leaf",
	"fa-bicycle",
	"fa-bomb"
	], myCards = shuffle([...cardItems]); // <-- shuffles the cards
	//assigns symbols to the shuffled cardItems
	let index = 0;
	for(const myCard of myCards){
		if(index === cardSymbols.length){
			index = 0;
			myCard.className= `fa ${cardSymbols[index]}`;
		    index++;
		}else{
			myCard.className= `fa ${cardSymbols[index]}`;
		    index++;
		}
	}
};


//opens or closes all the cards available on deck and deactives click function if any;
const toggleCards= function(){
	deck.removeEventListener('click', gameLogic);
	const cards = document.getElementsByClassName('card');
	const cardPosteriors = document.getElementsByClassName('card-posterior');
	const els = [...cards, ...cardPosteriors]
	for(const el of els) {
		el.classList.toggle('open');
	}
};


//function to count from 1 through 3 in 3 secs and update a dom node;
const startCountDown = function(){
	interval = setInterval(function(){
    		if (time === 3){
    			notice4.classList.add('hide');
    			countDownEl.textContent = '3';
    			toggleCards();
                 toggleInterval = window.setTimeout(function(){
                	toggleCards()
                	deck.addEventListener('click', gameLogic);
                }, 2500);
    			clearInterval(interval);
                return;
    		}else{
    			time += 1;
    			countDownEl.textContent = `${3 - time}`;
    		}
    	}, 1000);       
}


//when dom content is loaded then show this pop up that prompt users to use play game;
document.addEventListener('DOMContentLoaded', function(){
	window.setTimeout(
		function(){ notice1.classList.toggle('appear')}
		, 10);
	shuffleCards();
});

//add event listerners so users can iteract with the game prompt
document.querySelector('div#notice1 button').addEventListener('click', function(){
	notice1.classList.toggle('hide');
	notice2.classList.toggle('hide');
	window.setTimeout(
		function(){ notice2.classList.toggle('appear')}
		, 10);
});

document.querySelector('section.game-mode ul li:first-child').addEventListener('click', function(){
	notice2.classList.toggle('hide');
	notice3.classList.toggle('hide');
    window.setTimeout(
		function(){ notice3.classList.toggle('appear')}
		, 100);
});



document.forms[0].addEventListener('submit', function(e){
	e.preventDefault();
    let name= document.querySelector('input').value;
    document.querySelector('ul.right> li:first-child').textContent= `player: ${name}`;
    notice3.classList.toggle('hide');
	mssgContainer.classList.toggle('hide');
    startCountDown()
});

                                      

//function that uses window setInterval method to create a timer
const startTimer = function(evt){
	if(evt.target.classList.contains('card-posterior')) {
		counterInterval = setInterval(function(){
	    		if (counterMin === 2){
	    			endGame();
	    			clearInterval(counterInterval);
	    			return;
	    		}else{
	    			counterSec += 1;
	    			if (counterSec === 60) {
	    				counterSec = 0;
	    				counterMin += 1;
	    			}
	    		}
	    		timerEl.textContent = `${counterMin}min : ${counterSec}sec`;
	    	}, 1000);
		deck.removeEventListener('click', startTimer);
    	}     
};


//calculate the user point based on boolean received from game logic
const calcPoint = function(val){
	if (val === true) {
		streak += 1;
		points += initPoint === 1 ? 20 : 0;
		points += streak === 3 ? 20 : 0;
		streak = streak === 3 ? 0 : streak++;
		points += 20;
        initPoint = 0;
    }
	else{
		initPoint = 0;
		streak = 0;
	}
    point.textContent= `${points}`;
    pointEl.appendChild(point);
};

   

//shuffle cards and print congratulations message to users
const endGame = function() {
	section.className = "notice-board congratulations-msg";
	header.className= "header-with-sub";
	button.textContent = "replay";
	initPoint = 1;
	deck.classList.add('hide');
    cards.forEach(function(el){
				        el.classList.remove('open','match','mis-match');
		                });
    cardPosteriors.forEach(function(el){
				        el.classList.remove('open','match','mis-match');
		                });
    clearInterval(counterInterval);
    shuffleCards();
    if ((move === 40) || (counterMin === 2)){
    	header.textContent = "you lose!!!";
    	mssg.textContent = "You guessed for too long. This means that you can't hold information for long in your working memory...Luckily you can improve this, all you need is more practise";
        starContainer.innerHTML = '<li>rating:</li><li class="star">&#x272f;</li>';
    }
    else if (points > 110 && points < 200 && counterMin < 2){
    	header.textContent = "you win!!!";
    	mssg.textContent = " Where to go. You got above 50%.. Nice one there.. But there's still room for improvement";
        starContainer.innerHTML= '<li>rating:</li><li class="star">&#x272f;</li><li class="star">&#x272f;</li>';
    }
    else if (points >= 200 && counterMin < 2){
    	header.textContent = "you win!!!";
        mssg.textContent = "Now talking about champions. You were born with a great asset. Go conquer bud. You got above 80%, this shows you have a very strong memory";
        starContainer.innerHTML= '<li>rating:</li><li class="star">&#x272f;</li><li class="star">&#x272f;</li><li class="star">&#x272f;</li>';
    }

    section.appendChild(header);
    section.appendChild(starContainer);  
    section.appendChild(mssg);
    section.appendChild(button);
    fragment.appendChild(section);
    mssgContainer.appendChild(fragment);
    congratulationsMsg = document.querySelector('section.congratulations-msg');
    window.setTimeout(
		function(){ congratulationsMsg.classList.add('appear');}
		, 100);
    document.querySelector('section.congratulations-msg > button').addEventListener('click', refresh)
}


//uses numbers to create a dynamic way to know when users have clicked the cards
const gameLogic = function(evt){
	if (evt.target.classList.contains('card-posterior')){
		if(openCard === 0 ){
			//prevent multiclick on a single card
			if (evt.target.classList.contains('open')){
				return;
			}
			firstCard = evt.target;
			const colAttr1 = evt.target.getAttribute('data-col'),
			      rowAttr1 = evt.target.getAttribute('data-row');
			el1 = document.querySelector(`li[data-col="${colAttr1}"][data-row="${rowAttr1}"]`).firstElementChild;
			toggle1 = document.querySelectorAll(`*[data-col="${colAttr1}"][data-row="${rowAttr1}"]`);
			toggle1.forEach(function(el){
							el.classList.add('open');
							});
			openCard = 1;
			}
			else{
				//prevent multiclick on a single card
                if (firstCard === evt.target){
                	return;
                }
                 const colAttr2 = evt.target.getAttribute('data-col'),
			    rowAttr2 = evt.target.getAttribute('data-row');
			    el2 = document.querySelector(`li[data-col="${colAttr2}"][data-row="${rowAttr2}"]`).firstElementChild;
			    toggle2 = document.querySelectorAll(`*[data-col="${colAttr2}"][data-row="${rowAttr2}"]`);
			    toggle2.forEach(function(el){
							        el.classList.add('open');
							        });
				if (el1.className === el2.className && matchCount < 7){
					setTimeout(
						function(x,y){
									x.forEach(function(el){
												        el.classList.add('match');
												        });
								    y.forEach(function(el){
												        el.classList.add('match');
												        }); 
					    }, 200, toggle1, toggle2);
			        matchCount++;
			        calcPoint(true);
				}
				else if (el1.className === el2.className && matchCount === 7) {
					setTimeout(
						function(x,y){
									x.forEach(function(el){
												        el.classList.add('match');
												        });
								    y.forEach(function(el){
												        el.classList.add('match');
												        });
								    endGame();
					    }, 200, toggle1, toggle2);
					matchCount = 0;
			        calcPoint(true);
				}else{
					
		            setTimeout(
						function(x,y){
									x.forEach(function(el){
												        el.classList.add('mis-match');
										                }); 
					                y.forEach(function(el){
												        el.classList.add('mis-match');
												        });
						}, 200, toggle1, toggle2); 

					setTimeout(
						function(x,y){
									x.forEach(function(el){
										                el.classList.remove('mis-match');
										                }); 
							        y.forEach(function(el){
							        	                el.classList.remove('mis-match');
							        	                });
			        }, 550, toggle1, toggle2);

                    setTimeout(
						function(x,y){ 
									x.forEach(function(el){
										                el.classList.remove('open');
										                }); 
							        y.forEach(function(el){
							        	                el.classList.remove('open');
							        	                });

			        }, 570, toggle1, toggle2);
			        calcPoint(false); 
				}
				openCard = 0;
			}
			move === 40 ? endGame() : move++;
			movesEl.textContent = `${move}`;	
	}
};
 
 //function to reset all dependensies for the next game;
refresh = function(){
    congratulationsMsg.classList.remove('appear');
    window.setTimeout(
		function(){ 
			mssgContainer.classList.add('hide');
            congratulationsMsg.remove();
			}
		, 300)
    window.setTimeout(
		function(){
	        matchCount = 0;
			streak=0;
			openCard = 0;
			initPoint = 1;
			points = 0;
			time = 0;
		    counterSec=0; 
		    counterMin=0;
		    move = 0;
		    deck.addEventListener('click', startTimer);
		    timerEl.textContent = `${counterMin}min : ${counterSec}sec`;
		    movesEl.textContent = `${move}`;
		    point.textContent= `${points}`;
		    pointEl.appendChild(point);
		    deck.classList.remove('hide')
			notice4.classList.remove('hide'); 
			mssgContainer.classList.remove('hide');    
			startCountDown();
		     }
		, 400)
};


//Event Listeners for interacting with the game
deck.addEventListener('click', gameLogic);

document.querySelector('section.score-panel > i.options').addEventListener('click', function(evt) {
	evt.target.classList.add('hide');
	infoPanel = document.querySelector('ul.left').classList;
	infoPanel.remove('hide');
	infoPanel.add('info-panel');
	clearInterval(counterInterval);
	deck.removeEventListener('click', gameLogic);
	deck.removeEventListener('click', startTimer);
});

document.querySelector('ul.left>li#resume').addEventListener('click',function(evt){
	evt.target.parentNode.classList.toggle('info-panel');
	evt.target.parentNode.classList.toggle('hide');
	document.querySelector('section.score-panel > i.options').classList.toggle('hide');
	deck.addEventListener('click', gameLogic);
	deck.addEventListener('click', startTimer);

});

document.querySelector('ul.left > li.arrow-down').addEventListener('click', function(evt){
	document.getElementById('info').classList.toggle('hide');
	evt.target.classList.toggle('arrow-down');
	evt.target.classList.toggle('arrow-up');
});

document.getElementById('restart').addEventListener('click', function(){ 
    clearInterval(toggleInterval);
    deck.addEventListener('click', gameLogic);
	mssgContainer.classList.toggle('hide');
	infoPanel.remove('info-panel');
	infoPanel.remove('hide');
	document.querySelector('section.score-panel > i.options').classList.remove('hide');
	endGame();
	refresh();
	deck.addEventListener('click', gameLogic);
});


deck.addEventListener('click', startTimer);

document.getElementById('exit').addEventListener('click', function(){ window.close()});

