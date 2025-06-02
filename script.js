const cards = createDeck();

let totalValue = 0;
let dealersCardValue = 0;
let dealersFirstCard;
let dealersSecondCard;
let playerActive = false;
let roundOver = true;
let playersCards = [];
let dealersCards = [];
let secondCardDiv;
const playersTitleCards = document.getElementById("playersCardTitle");
const dealersTitleCards = document.getElementById("dealersCardTitle");
const myButtons = document.getElementById("myButtons");
const stayButton = document.getElementById("Stay");
const hitButton = document.getElementById("Hit");

if (stayButton) {
  stayButton.addEventListener("click", function (event) {
    if (playerActive === true && !roundOver) {
      displayMessage.innerHTML = "";
      Result1.innerHTML = "";
      DealersHand.innerHTML = "";
      dealersCardTitle.innerHTML = "Dealer's Cards";
      if (dealersSecondCard) {
        secondCardDiv.innerHTML = dealersSecondCard.name;
      }
      playerActive = false;
      getDealerResults();
    }
  });
}

if (hitButton) {
  hitButton.addEventListener("click", function (event) {
    if (playerActive && !roundOver) {
      const newCard = getRandomCard();
      playersCards.push(newCard);
      totalValue += newCard.value;
      totalValue = aceChecker(playersCards);
      Total.innerHTML = "<strong>Your total</strong> is now " + totalValue;

      addCard(playerDiv, newCard.name);

      if (totalValue > 21) {
        displayMessage.innerHTML = "Press R to restart the game";
        WinLossMessage.innerHTML = "You Busted :|";
        playerActive = false;
        roundOver = true;
      } else if (totalValue === 21) {
        Result1.innerHTML = "<strong>You Got 21!</strong>";
      }
    }
  });
}

const dealerDiv = document.getElementById("dealer");
const playerDiv = document.getElementById("player");

const dealersCardTitle = document.getElementById("dealersCards");
const playersCardTitle = document.getElementById("playersCards");
const displayMessage = document.getElementById("displayMessage");
const DealersHand = document.getElementById("DealersHand");
const DealersTotalValue = document.getElementById("DealersTotalValue");
const Result1 = document.getElementById("Result1");
const Total = document.getElementById("Total");
const WinLossMessage = document.getElementById("WinLossMessage");
const DealersMessage1 = document.getElementById("DealersMessage1");
const DealersMessage2 = document.getElementById("DealersMessage2");

displayMessage.innerHTML = "Press the  <strong>Key P</strong> to Start";

function createDeck() {
  const cards = [];
  const suites = ["&#9824", "&#9829", ]

  const numericCards = [
    { name: "2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 },
    { name: "6", value: 6 },
    { name: "7", value: 7 },
    { name: "8", value: 8 },
    { name: "9", value: 9 },
    { name: "10", value: 10 },
    { name: "J", value: 10 },
    { name: "Q", value: 10 },
    { name: "K", value: 10 },
    { name: "A", value: 11 },
  ];


  for (let i = 0; i < suites.length; i++) {
    for (const numericCard of numericCards) {
      cards.push({
        name: numericCard.name + suites[i],
        value: numericCard.value
      })
    }
  }
  return cards;
}

function startGame() {
  myButtons.style.display = "block";
  totalValue = 0;
  dealersCardValue = 0;
  playersCards = [];
  dealersCards = [];
  playersTitleCards.innerHTML = "Your Cards"
  dealersTitleCards.innerHTML = "Dealer's Cards"
  dealerDiv.innerHTML = "";
  playerDiv.innerHTML = "";
  Result1.innerHTML = "";
  WinLossMessage.innerHTML = "";
  DealersMessage1.innerHTML = "";
  DealersMessage2.innerHTML = "";

  getCards();

  dealersFirstCard = getRandomCard();
  dealersSecondCard = getRandomCard();
  addCard(dealerDiv, dealersFirstCard.name);
  secondCardDiv = addCard(dealerDiv, "?");
  dealersCardTitle.innerHTML = "Dealer's Card";
  playersCardTitle.innerHTML = "Player's Cards";

  displayMessage.innerHTML = "";
  dealersCardValue += dealersFirstCard.value;
  DealersTotalValue.innerHTML = "The <strong>dealer's total</strong> is now " + dealersCardValue;

  playerActive = true;
  roundOver = false;

  if (totalValue === 21) {
    Result1.innerHTML = "You got a <strong>Blackjack</strong>!";
  }
}

function addCard(parentDiv, cardValue) {
  const newCardDiv = document.createElement("div");
  newCardDiv.classList.add('card');
  newCardDiv.innerHTML = cardValue;
  newCardDiv.style.display = "inline-block";
  parentDiv.appendChild(newCardDiv);
  return newCardDiv;
}

function getRandomCard() {
  let generatedIndex = Math.floor(Math.random() * cards.length);
  const originalCard = cards[generatedIndex];
  return { name: originalCard.name, value: originalCard.value };
}

function aceChecker(hand) {
  let adjustedTotal = 0;
  let aceCount = 0;

  for (const card of hand) {
    adjustedTotal += card.value;
  }

  for (const card of hand) {
    if (card.name.startsWith("A")) {
      aceCount++;
    }
  }

  while (adjustedTotal > 21 && aceCount > 0) {
    adjustedTotal -= 10;
    aceCount--;
  }

  return adjustedTotal;
}

function dealerDrawCard() {
  const newCard = getRandomCard();
  dealersCardValue += newCard.value;
  dealersCards.push(newCard);
  dealersCardValue = aceChecker(dealersCards);
  addCard(dealerDiv, newCard.name);
  DealersTotalValue.innerHTML = "The <strong>dealer's total</strong> is now " + dealersCardValue;
}

function getDealerResults() {
  if (!playerActive && !roundOver) {
    playerActive = false;
    dealersCards.push(dealersFirstCard, dealersSecondCard);

    dealersCardValue = 0;
    for (const card of dealersCards) {
      dealersCardValue += card.value;
    }
    dealersCardValue = aceChecker(dealersCards);

    if (dealersSecondCard) {
      secondCardDiv.innerHTML = dealersSecondCard.name;
    }
    DealersTotalValue.innerHTML = "The <strong>dealer's total</strong> is now " + dealersCardValue;
    while (dealersCardValue <= 16) {
      dealerDrawCard();
    }

    if (dealersCardValue > 21) {
      displayMessage.innerHTML = "<strong>Press R</strong> to restart the game";
      DealersMessage2.innerHTML = "<strong>The dealer busted!</strong>";
      WinLossMessage.innerHTML = "You Won!";
    } else if (dealersCardValue >= 17) {
      outcomeChecker();
    } else if (dealersCardValue === 21) {
      displayMessage.innerHTML = "<strong>Press R</strong> to restart the game";
      WinLossMessage.innerHTML = "You Won!";
    }

    roundOver = true;
  }
}

function getCards() {
  const card1 = getRandomCard();
  const card2 = getRandomCard();
  playersCards.push(card1, card2);
  totalValue = card1.value + card2.value;
  totalValue = aceChecker(playersCards);
  addCard(playerDiv, card1.name);
  addCard(playerDiv, card2.name);
  Total.innerHTML = "<strong>Your total</strong> is " + totalValue;
}

document.addEventListener("keydown", (event) => { if (event.key === "h" && playerActive && !roundOver) {
    const newCard = getRandomCard();
    playersCards.push(newCard);
    totalValue += newCard.value;
    totalValue = aceChecker(playersCards);
    Total.innerHTML = "<strong>Your total</strong> is now " + totalValue;

    addCard(playerDiv, newCard.name);

    if (totalValue > 21) {
      displayMessage.innerHTML = "<strong>Press R</strong> to restart the game";
      WinLossMessage.innerHTML = "<strong>You busted</strong> :|";
      playerActive = false;
      roundOver = true;
    } else if (totalValue === 21) {
      Result1.innerHTML = "<strong>You got 21!</strong>";
    }
  }

  if (event.key === "s" && playerActive === true && !roundOver) {
    displayMessage.innerHTML = "";
    Result1.innerHTML = "";
    DealersHand.innerHTML = ""
    dealersCardTitle.innerHTML = "Dealer's Cards";
    secondCardDiv.innerHTML = dealersSecondCard.name;
    playerActive = false;
    getDealerResults();
  }

  if (event.key === "r" && roundOver === true) {
    startGame();
  }

  if (event.key === "p" && (!playerActive || roundOver)) {
    startGame();
  }
});

function outcomeChecker() {
  displayMessage.innerHTML = "<strong>Press R</strong> to restart the game";
  if (dealersCardValue > 21) {
    DealersTotalValue.innerHTML = "<strong>The dealer</strong> ended with a value of " + dealersCardValue;
    DealersMessage2.innerHTML = "The <strong>dealer busted</strong>!";
    WinLossMessage.innerHTML = "You Won!";
  } else if (totalValue > 21) {
    WinLossMessage.innerHTML = "You Lost :|";
  } else if (totalValue === dealersCardValue) {
      if (totalValue === 21 && dealersCardValue === 21) {
        if (playersCards.length > 2 &&
          dealersCards.length > 2) {
          WinLossMessage.innerHTML = "You Tied.";
        } else if (playersCards.length > dealersCards.length) {
          WinLossMessage.innerHTML = "You lost :|"
        } else if (playersCards.length < dealersCards.length) {
          WinLossMessage.innerHTML = "You Won!";
        }
      } else {
        WinLossMessage.innerHTML = "You Tied.";
      }
  } else if (totalValue > dealersCardValue) {
    DealersTotalValue.innerHTML = "<strong>The dealer</strong> ended with a value of " + dealersCardValue;
    WinLossMessage.innerHTML = "You Won!";
  } else if (totalValue < dealersCardValue) {
    DealersTotalValue.innerHTML = "<strong>The dealer</strong> ended with a value of " + dealersCardValue;
    WinLossMessage.innerHTML = "You lost :|";
  }
}