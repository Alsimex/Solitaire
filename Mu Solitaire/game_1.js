$(function() {

var deck = [];
var deckPile = [];
var boardPile1 = [];
var boardPile2 = [];
var boardPile3 = [];
var boardPile4 = [];
var boardPile5 = [];
var boardPile6 = [];
var boardPile7 = [];
var finalPile1 = [];
var finalPile2 = [];
var finalPile3 = [];
var finalPile4 = [];
var boardState1 = []; // this one may be redundant
var boardState2 = [];
var boardState3 = [];
var boardState4 = [];
var boardState5 = [];
var boardState6 = [];
var boardState7 = [];

var boardPiles = [];
var rows = [];
var selectedCard;

var score;

// 0-12 hearts, 13-25 diamonds, 26-38 spades, 39-51 clubs, 52 card back
var arrClasses = ['hA','h2','h3','h4','h5','h6','h7','h8','h9','h10','hJ','hQ','hK','dA','d2','d3','d4','d5','d6','d7','d8','d9','d10','dJ','dQ','dK','sA','s2','s3','s4','s5','s6','s7','s8','s9','s10','sJ','sQ','sK','cA','c2','c3','c4','c5','c6','c7','c8','c9','c10','cJ','cQ','cK','back'];

function init() {
	initializeVariables();
	resetPiles();
	
	// initialize deck
	for (var i = 0; i < 52; i++) {
		deck[i] = i;
	}
	shuffle(deck);
	
	dealCards();
	
	renderPile(boardPile1, boardState1, boardPiles[0]);
	renderPile(boardPile2, boardState2, boardPiles[1]);
	renderPile(boardPile3, boardState3, boardPiles[2]);
	renderPile(boardPile4, boardState4, boardPiles[3]);
	renderPile(boardPile5, boardState5, boardPiles[4]);
	renderPile(boardPile6, boardState6, boardPiles[5]);
	renderPile(boardPile7, boardState7, boardPiles[6]);
	
	$('.deck').addClass(arrClasses[deck[0]]);
	$('.deck').addClass(arrClasses[52]);
	
	$('.card').on("click", function() {
		if ($(this).hasClass('deck')) {
			deckClick();
			if (selectedCard != null) {
				$(selectedCard).removeClass('selected');
				selectedCard = null;
			}
		} else if (selectedCard == null && !($(this).hasClass(arrClasses[52]))) {
			if (hasCard(this)) {
				selectedCard = this;
				$(selectedCard).addClass('selected');
			}
		} else if (selectedCard == this || (clickTopPiles(this))) {
			$(selectedCard).removeClass('selected');
			selectedCard = null;
		} else if ($(this).hasClass('deckPile') && deckPile.length > 0) {
			$(selectedCard).removeClass('selected');
			selectedCard = this;
			$(selectedCard).addClass('selected');
		} else if (!($(this).hasClass(arrClasses[52]))) {
			if ($(this).parents().hasClass('topRow')) { // must be finalPile
				if ($(selectedCard).parents().hasClass('board')) { // tableau to foundation
					boardToFinal(this);
				} else { // stock to foundation
					moveToFinal(deckPile, this);
					$('.deckPile').addClass(arrClasses[deckPile[0]]);
				}
			} else {
				if ($(selectedCard).parents().hasClass('board')) { // tableau to tableau
					boardToBoard(this);
				} else if ($(selectedCard).hasClass('deckPile')) { // stock to tableau
					if (moveToBoard(deckPile, this)) score += 5;
				} else { // foundation to tableau
					let finalPile;
					if ($(selectedCard).hasClass('finalPile1')) {
						finalPile = finalPile1;
					} else if ($(selectedCard).hasClass('finalPile2')) {
						finalPile = finalPile2;
					} else if ($(selectedCard).hasClass('finalPile3')) {
						finalPile = finalPile3;
					} else if ($(selectedCard).hasClass('finalPile4')) {
						finalPile = finalPile4;
					}
					
					if (moveToBoard(finalPile, this)) {
						score -= 15;
						if (score < 0) score = 0;
					}
				}
			}
		} else {
			$(selectedCard).removeClass('selected');
			selectedCard = null;
		}
		
		$('.score').html("Score: " + score);
		$('.submit').val(score);
		
		checkWin();
		
		//console.log("score: " + score);
		
		/*
		console.log("deck: " + deck);
		console.log("deck pile: " + deckPile);
		
		console.log("pile 1: " + boardPile1);
		console.log("pile 2: " + boardPile2);
		console.log("pile 3: " + boardPile3);
		console.log("pile 4: " + boardPile4);
		console.log("pile 5: " + boardPile5);
		console.log("pile 6: " + boardPile6);
		console.log("pile 7: " + boardPile7);
		
		console.log("final pile 1: " + finalPile1);
		console.log("final pile 2: " + finalPile2);
		console.log("final pile 3: " + finalPile3);
		console.log("final pile 4: " + finalPile4);
		*/
	});
}

function initializeVariables() {
	deckPile.length = 0;
	boardPile1.length = 0;
	boardPile2.length = 0;
	boardPile3.length = 0;
	boardPile4.length = 0;
	boardPile5.length = 0;
	boardPile6.length = 0;
	boardPile7.length = 0;
	finalPile1.length = 0;
	finalPile2.length = 0;
	finalPile3.length = 0;
	finalPile4.length = 0;
	boardState1.length = 0;
	boardState2.length = 0;
	boardState3.length = 0;
	boardState4.length = 0;
	boardState5.length = 0;
	boardState6.length = 0;
	boardState7.length = 0;
	boardPiles.length = 0;
	rows.length = 0;
	selectedCard = null;
	score = 0;
	
	for (let i = 1; i <= 7; i++) {
		boardPiles[i-1] = "boardPile" + i;
	}
	for (let i = 1; i <= 19; i++) {
		rows[i-1] = "row" + i;
	}
}

// Fisher-Yates shuffle algorithm
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
}

function dealCards() {
	for (let j = 0; j < 7; j++) {
		switch (j) {
			case 0: {
				boardPile1.unshift(deck.shift());
				boardState2.unshift(1);
			}
			case 1: {
				boardPile2.unshift(deck.shift());
				boardState3.unshift(1);
			}
			case 2: {
				boardPile3.unshift(deck.shift());
				boardState4.unshift(1);
			}
			case 3: {
				boardPile4.unshift(deck.shift());
				boardState5.unshift(1);
			}
			case 4: {
				boardPile5.unshift(deck.shift());
				boardState6.unshift(1);
			}
			case 5: {
				boardPile6.unshift(deck.shift());
				boardState7.unshift(1);
			}
			case 6: {
				boardPile7.unshift(deck.shift());
			}
		}
	}
}

function resetPiles() {
    var cards = $('td');
    for (var i = 0; i < cards.length; i++) {
        $(cards[i]).removeClass(arrClasses);
    }
}

function renderPile(pile, state, row) {
	for (let i = 0; i < 19; i++) {
		$('.'+rows[i]).find('.'+row).removeClass(arrClasses);
	}
	
	var j = pile.length-1;
	for (let i = 0; i < pile.length; i++) {
		$('.'+rows[i]).find('.'+row).addClass(arrClasses[pile[j]]);
		
		if (state[i] == 1) {
			$('.'+rows[i]).find('.'+row).addClass(arrClasses[52]);
		}
		j--;
	}
}

function deckClick() {
	$('.deckPile').removeClass(arrClasses);
	if (deck.length > 0) {
		$('.deck').removeClass(arrClasses[deck[0]]);
		deckPile.unshift(deck.shift());
		$('.deck').addClass(arrClasses[deck[0]]);
		$('.deckPile').addClass(arrClasses[deckPile[0]]);
		if (deck.length == 0) $('.deck').removeClass(arrClasses[52]);
	} else {
		$('.deck').addClass(arrClasses[52]);
		while (deckPile.length > 0) {
			deck.unshift(deckPile.shift());
		}
		
		score -= 100;
		if (score < 0) score = 0;
		
		rerender();
	}
}

function clickTopPiles(card) {
	if (($(card).hasClass('deckPile') && deckPile.length == 0) || 
		(selectedCard == null &&
		(($(card).hasClass('finalPile1') && finalPile1.length == 0) || 
		($(card).hasClass('finalPile2') && finalPile2.length == 0) || 
		($(card).hasClass('finalPile3') && finalPile3.length == 0) || 
		($(card).hasClass('finalPile4') && finalPile4.length == 0)))) return true;
	return false;
}

function hasCard(card) {
	for (let i = 0; i < arrClasses.length; i++) {
		if ($(card).hasClass(arrClasses[i])) {
			return true;
		}
	}
	return false;
}

function whichCard(card) {
	for (let i = 0; i < arrClasses.length; i++) {
		if ($(card).hasClass(arrClasses[i])) {
			return i;
		}
	}
	return 52;
}

function moveToFinal(pile, finalCard) {
	let finalPile;
	if ($(finalCard).hasClass('finalPile1')) {
		finalPile = finalPile1;
	} else if ($(finalCard).hasClass('finalPile2')) {
		finalPile = finalPile2;
	} else if ($(finalCard).hasClass('finalPile3')) {
		finalPile = finalPile3;
	} else if ($(finalCard).hasClass('finalPile4')) {
		finalPile = finalPile4;
	} else return;
	
	if (finalPile == null) return false;
	
	$(selectedCard).removeClass('selected');
	selectedCard = null;
	
	if (((finalPile.length == 0) && ((pile[0] % 13) == 0)) || 
		((pile[0] == (finalPile[0] + 1)) && !((pile[0] % 13) == 0))) {
		finalPile.unshift(pile.shift());
		$(finalCard).removeClass(arrClasses);
		$(finalCard).addClass(arrClasses[finalPile[0]]);
		
		score += 10;
		
		rerender();
		
		return true;
	}
	
	if (finalPile.length > 0) {
		selectedCard = finalCard;
		$(selectedCard).addClass('selected');
	}
	
	return false;
}

function boardToFinal(finalCard) {
	let cardIdx = whichCard(selectedCard);
	
	switch (cardIdx) {
		case boardPile1[0]: {
			if (moveToFinal(boardPile1, finalCard)) {
				flipCard(boardPile1, boardState1);
				renderPile(boardPile1, boardState1, boardPiles[0]);
			}
			break;
		}
		case boardPile2[0]: {
			if (moveToFinal(boardPile2, finalCard)) {
				flipCard(boardPile2, boardState2);
				renderPile(boardPile2, boardState2, boardPiles[1]);
			}
			break;
		}
		case boardPile3[0]: {
			if (moveToFinal(boardPile3, finalCard)) {
				flipCard(boardPile3, boardState3);
				renderPile(boardPile3, boardState3, boardPiles[2]);
			}
			break;
		}
		case boardPile4[0]: {
			if (moveToFinal(boardPile4, finalCard)) {
				flipCard(boardPile4, boardState4);
				renderPile(boardPile4, boardState4, boardPiles[3]);
			}
			break;
		}
		case boardPile5[0]: {
			if (moveToFinal(boardPile5, finalCard)) {
				flipCard(boardPile5, boardState5);
				renderPile(boardPile5, boardState5, boardPiles[4]);
			}
			break;
		}
		case boardPile6[0]: {
			if (moveToFinal(boardPile6, finalCard)) {
				flipCard(boardPile6, boardState6);
				renderPile(boardPile6, boardState6, boardPiles[5]);
			}
			break;
		}
		case boardPile7[0]: {
			if (moveToFinal(boardPile7, finalCard)) {
				flipCard(boardPile7, boardState7);
				renderPile(boardPile7, boardState7, boardPiles[6]);
			}
			break;
		}
	}
}

function flipCard(pile, state) {
	if ((state.length > pile.length-1) && (state.length > 0)) {
		state.shift();
		score += 5;
	}
}

function boardToBoard(boardCard) {
	let cardIdx = whichCard(selectedCard);
	let cardBoardPos = whereCard(cardIdx);
	let moved = false;
	
	switch (cardIdx) {
		case boardPile1[cardBoardPos]: {
			for (let i = cardBoardPos; i >= 0; i--) {
				moved = moveToBoard(boardPile1, boardCard, i);
			}
			if (moved) {
				if ((boardState1.length > 0) && (boardPile1.length > 0)) flipCard(boardPile1, boardState1);
				renderPile(boardPile1, boardState1, boardPiles[0]);
			}
			break;
		}
		case boardPile2[cardBoardPos]: {
			for (let i = cardBoardPos; i >= 0; i--) {
				moved = moveToBoard(boardPile2, boardCard, i);
			}
			if (moved) {
				if ((boardState2.length > 0) && (boardPile2.length > 0)) flipCard(boardPile2, boardState2);
				renderPile(boardPile2, boardState2, boardPiles[1]);
			}
			break;
		}
		case boardPile3[cardBoardPos]: {
			for (let i = cardBoardPos; i >= 0; i--) {
				moved = moveToBoard(boardPile3, boardCard, i);
			}
			if (moved) {
				if ((boardState3.length > 0) && (boardPile3.length > 0)) flipCard(boardPile3, boardState3);
				renderPile(boardPile3, boardState3, boardPiles[2]);
			}
			break;
		}
		case boardPile4[cardBoardPos]: {
			for (let i = cardBoardPos; i >= 0; i--) {
				moved = moveToBoard(boardPile4, boardCard, i);
			}
			if (moved) {
				if ((boardState4.length > 0) && (boardPile4.length > 0)) flipCard(boardPile4, boardState4);
				renderPile(boardPile4, boardState4, boardPiles[3]);
			}
			break;
		}
		case boardPile5[cardBoardPos]: {
			for (let i = cardBoardPos; i >= 0; i--) {
				moved = moveToBoard(boardPile5, boardCard, i);
			}
			if (moved) {
				if ((boardState5.length > 0) && (boardPile5.length > 0)) flipCard(boardPile5, boardState5);
				renderPile(boardPile5, boardState5, boardPiles[4]);
			}
			break;
		}
		case boardPile6[cardBoardPos]: {
			for (let i = cardBoardPos; i >= 0; i--) {
				moved = moveToBoard(boardPile6, boardCard, i);
			}
			if (moved) {
				if ((boardState6.length > 0) && (boardPile6.length > 0)) flipCard(boardPile6, boardState6);
				renderPile(boardPile6, boardState6, boardPiles[5]);
			}
			break;
		}
		case boardPile7[cardBoardPos]: {
			for (let i = cardBoardPos; i >= 0; i--) {
				moved = moveToBoard(boardPile7, boardCard, i);
			}
			if (moved) {
				if ((boardState7.length > 0) && (boardPile7.length > 0)) flipCard(boardPile7, boardState7);
				renderPile(boardPile7, boardState7, boardPiles[6]);
			}
			break;
		}
	}
}

function moveToBoard(pile, boardCard, idx = 0) {
	let boardPile;
	
	if ($(boardCard).hasClass(boardPiles[0])) boardPile = boardPile1;
	else if ($(boardCard).hasClass(boardPiles[1])) boardPile = boardPile2;
	else if ($(boardCard).hasClass(boardPiles[2])) boardPile = boardPile3;
	else if ($(boardCard).hasClass(boardPiles[3])) boardPile = boardPile4;
	else if ($(boardCard).hasClass(boardPiles[4])) boardPile = boardPile5;
	else if ($(boardCard).hasClass(boardPiles[5])) boardPile = boardPile6;
	else if ($(boardCard).hasClass(boardPiles[6])) boardPile = boardPile7;
	
	if (boardPile == null) return false;
		
	$(selectedCard).removeClass('selected');
	selectedCard = null;
	
	if (((boardPile.length == 0) && (pile[idx] % 13 == 12)) || 
		(((pile[idx] % 13) == ((boardPile[0] - 1) % 13)) && !(pile[idx] % 13 == 12) &&
		(((pile[idx] < 26) && (boardPile[0] >= 26)) || ((pile[idx] >= 26) && 
		boardPile[0] < 26)))) {
		
		if (idx > 0) boardPile.unshift(pile.splice(idx, 1)[0]);
		else boardPile.unshift(pile.shift());
		
		rerender();
		
		return true;
	}
	
	selectedCard = boardCard;
	$(selectedCard).addClass('selected');
	
	return false;
}

function whereCard(cardIdx) {
	for (let i = 0; i < boardPile1.length; i++) if (cardIdx == boardPile1[i]) return i;
	for (let i = 0; i < boardPile2.length; i++) if (cardIdx == boardPile2[i]) return i;
	for (let i = 0; i < boardPile3.length; i++) if (cardIdx == boardPile3[i]) return i;
	for (let i = 0; i < boardPile4.length; i++) if (cardIdx == boardPile4[i]) return i;
	for (let i = 0; i < boardPile5.length; i++) if (cardIdx == boardPile5[i]) return i;
	for (let i = 0; i < boardPile6.length; i++) if (cardIdx == boardPile6[i]) return i;
	for (let i = 0; i < boardPile7.length; i++) if (cardIdx == boardPile7[i]) return i;
	return 52;
}

function checkWin() {
	if (finalPile1.length == 13 && finalPile2.length == 13 && finalPile3.length == 13 && finalPile4.length == 13) {
		$('.card').addClass('inactive');
		$('.win').removeClass('inactive');
		
		
		
		return true;
	}
	
	return false;
}

function rerender() {
	resetPiles();
	
	renderPile(boardPile1, boardState1, boardPiles[0]);
	renderPile(boardPile2, boardState2, boardPiles[1]);
	renderPile(boardPile3, boardState3, boardPiles[2]);
	renderPile(boardPile4, boardState4, boardPiles[3]);
	renderPile(boardPile5, boardState5, boardPiles[4]);
	renderPile(boardPile6, boardState6, boardPiles[5]);
	renderPile(boardPile7, boardState7, boardPiles[6]);
	
	if (deck.length > 0) {
		$('.deck').addClass(arrClasses[deck[0]]);
		$('.deck').addClass(arrClasses[52]);
	}
	
	$('.deckPile').addClass(arrClasses[deckPile[0]]);
	
	$('.finalPile1').addClass(arrClasses[finalPile1[0]]);
	$('.finalPile2').addClass(arrClasses[finalPile2[0]]);
	$('.finalPile3').addClass(arrClasses[finalPile3[0]]);
	$('.finalPile4').addClass(arrClasses[finalPile4[0]]);
}

init();
})