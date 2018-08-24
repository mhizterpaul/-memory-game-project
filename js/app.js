


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 */


//cache all needed variables in the global scope
let refresh;
let points = 0, initPoint = 1;
const pointEl = document.getElementById('points');
let point = document.createElement('span');
let streak = 0;
let interval;
let time= 0;
let countDownEl = document.querySelector('div.count-down');
let counterInterval;
let counterSec= 0;
let counterMin = 0;
let timerEl = document.getElementById('time-count');
let mssgContainer = document.querySelector('div.container');
let fragment = document.createDocumentFragment();
let section = document.createElement('section');
section.className = "notice-board congratulations-msg";
let header = document.createElement('h1');
header.className= "header-with-sub";
let starContainer = document.createElement('ul');
let mssg = document.createElement('p');
let button = document.createElement('button');
button.textContent = "replay";
let openCard = 0, matchCount = 0, el1, colAttr1, rowAttr1, colAttr2, rowAttr2, el2, toggle1, toggle2, move = 0;
const deck = document.querySelector('ul.deck');
let infoPanel, firstCard;

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
	], myCards = shuffle([...cardItems]);
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
	els = [...cards, ...cardPosteriors]
	for(const el of els) {
		el.classList.toggle('open');
	}
};


//function to count from 1 through 3 in 3 secs and update a dom node;
const startCountDown = function(){
	interval = setInterval(function(){
    		if (time === 3){
    			document.getElementById('notice4').classList.toggle('hide');
    			countDownEl.textContent = '3';
    			toggleCards();
                window.setTimeout(function(){
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
		function(){ document.getElementById('notice1').classList.toggle('appear')}
		, 10);
	shuffleCards();
});

//add event listerners so users can iteract with the game prompt
document.querySelector('div#notice1 button').addEventListener('click', function(){
	document.getElementById('notice1').classList.toggle('hide');
	document.getElementById('notice2').classList.toggle('hide');
	window.setTimeout(
		function(){ document.getElementById('notice2').classList.toggle('appear')}
		, 10);
});

document.querySelector('section.game-mode ul li:first-child').addEventListener('click', function(){
	document.getElementById('notice2').classList.toggle('hide');
	document.getElementById('notice3').classList.toggle('hide');
    window.setTimeout(
		function(){ document.getElementById('notice3').classList.toggle('appear')}
		, 100);
});



document.forms[0].addEventListener('submit', function(e){
	e.preventDefault();
    let name= document.querySelector('input').value;
    document.querySelector('ul.right> li:first-child').textContent= `player: ${name}`;
    document.getElementById('notice3').classList.toggle('hide');
	document.querySelector('div.container').classList.toggle('hide');
    startCountDown()
});

                                      

//function that uses window setInterval method to creat a timer
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

   

//shuffle cards and print congratulations message to users;

const endGame = function() {
	initPoint = 1;
	document.querySelector('ul.deck').classList.add('hide');
    document.querySelectorAll('li.card').forEach(function(el){
				        el.classList.remove('open','match');
		                });
    document.querySelectorAll('div.card-posterior').forEach(function(el){
				        el.classList.remove('open','match');
		                });
    clearInterval(counterInterval);
    shuffleCards();
    if (points <= 220 && counterMin === 2){
    	openCard = 0;
	    shuffleCards();
    	matchCount = 0;
    	header.textContent = "you lose!!!";
    	mssg.textContent = "You couldn't finish on time. This means that you can't hold information for long in your working memory...Luckily you can improve this, all you need is more practise";
        starContainer.innerHTML = '<li>rating:</li><li class="star">&#x272f;</li>';
    }
    else if (document.querySelector('section.congratulations-msg')){
         document.querySelector('section.congratulations-msg').remove();
    }
    else if (points > 110 && points < 200 && counterMin < 2){
    	header.textContent = "you win!!!";
    	mssg.textContent = " Where to go. You got above 50%.. Nice one there.. But there's still room for improvement";
        starContainer.innerHTML= '<li>rating:</li><li class="star">&#x272f;</li><li class="star">&#x272f;</li>';
    }
    else if (points >= 200 && counterMin < 2){
    	document.querySelectorAll('li.card').forEach(function(el){
				        el.classList.remove('open','match');
		                });
        document.querySelectorAll('div.card-posterior').forEach(function(el){
				        el.classList.remove('open','match');
		                });
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

    window.setTimeout(
		function(){ document.querySelector('section.congratulations-msg').classList.add('appear');}
		, 100);
    document.querySelector('section.congratulations-msg > button').addEventListener('click', refresh)
} 


//uses numbers to create a dynamic way to know when users have clicked the cards
const gameLogic = function(evt){
	if (evt.target.classList.contains('card-posterior')){
		if(openCard === 0 ){
			if (evt.target.classList.contains('open')){
				return;
			}
			firstCard = evt.target;
			colAttr1 = evt.target.getAttribute('data-col');
			rowAttr1 = evt.target.getAttribute('data-row');
			el1 = document.querySelector(`li[data-col="${colAttr1}"][data-row="${rowAttr1}"]`).firstElementChild;
			toggle1 = document.querySelectorAll(`*[data-col="${colAttr1}"][data-row="${rowAttr1}"]`);
			toggle1.forEach(function(el){
							el.classList.add('open');
							});
			openCard = 1;
			}
			else{
                if (firstCard === evt.target){
                	return;
                }
                colAttr2 = evt.target.getAttribute('data-col');
			    rowAttr2 = evt.target.getAttribute('data-row');
			    el2 = document.querySelector(`li[data-col="${colAttr2}"][data-row="${rowAttr2}"]`).firstElementChild;
			    toggle2 = document.querySelectorAll(`*[data-col="${colAttr2}"][data-row="${rowAttr2}"]`);
			    toggle2.forEach(function(el){
							        el.classList.add('open');
							        });
				
				if (el1.className === el2.className && matchCount < 7){
					setTimeout(
						function(){ toggle2.forEach(function(el){
												        el.classList.toggle('match');
												        });
								    toggle1.forEach(function(el){
												        el.classList.toggle('match');
												        }); 
					    }, 250);
			        matchCount++;
			        calcPoint(true);
				}
				else if (el1.className === el2.className && matchCount === 7) {
					setTimeout(
						function(){ toggle2.forEach(function(el){
												        el.classList.add('match');
												        });
								    toggle1.forEach(function(el){
												        el.classList.add('match');
												        });
								    endGame();
					    }, 250);
					matchCount = 0;
			        calcPoint(true);
				}else{
					deck.removeEventListener('click', gameLogic);
		            setTimeout(
						function(){ toggle2.forEach(function(el){
												        el.classList.add('mis-match');
										                }); 
					                toggle1.forEach(function(el){
												        el.classList.add('mis-match');
												        });
						}, 250); 

					setTimeout(
						function(){ toggle2.forEach(function(el){
										                el.classList.remove('mis-match');
										                }); 
							        toggle1.forEach(function(el){
							        	                el.classList.remove('mis-match');
							        	                });
			        }, 600);

                    setTimeout(
						function(){ toggle2.forEach(function(el){
										                el.classList.remove('open');
										                }); 
							        toggle1.forEach(function(el){
							        	                el.classList.remove('open');
							        	                });
							      deck.addEventListener('click',gameLogic);

			        }, 610);
			        calcPoint(false); 
				}
				openCard = 0;
			}
			move += 1;
			document.getElementById('moves').textContent = `${move}`;	
	}
};
 
 //function to reset all dependensies for the next game;
refresh = function(){
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
    document.getElementById('moves').textContent = `${move}`;
    point.textContent= `${points}`;
    pointEl.appendChild(point);
    document.querySelector('section.congratulations-msg').classList.remove('appear');
    window.setTimeout(
		function(){ 
			document.querySelector('div.container').classList.add('hide');
            document.querySelector('section.congratulations-msg').remove();
			}
		, 300)
    window.setTimeout(
		function(){
		    deck.classList.remove('hide')
			document.getElementById('notice4').classList.toggle('hide'); 
			document.querySelector('div.container').classList.remove('hide');    
			startCountDown();
		     }
		, 400)
};


//Event Listeners for interacting with the game
deck.addEventListener('click', gameLogic);

document.querySelector('section.score-panel > i.options').addEventListener('click', function(evt) {
	evt.target.classList.toggle('hide');
	infoPanel = document.querySelector('ul.left').classList;
	infoPanel.toggle('hide');
	infoPanel.toggle('info-panel');
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
	document.querySelector('div.container').classList.toggle('hide');
	document.querySelector('ul.left>li#resume').parentNode.classList.toggle('info-panel');
	document.querySelector('ul.left>li#resume').parentNode.classList.toggle('hide');
	document.querySelector('section.score-panel > i.options').classList.toggle('hide');
	endGame();
	refresh();
	deck.addEventListener('click', gameLogic);
});


deck.addEventListener('click', startTimer);
document.getElementById('exit').addEventListener('click', function(){ window.close()});

