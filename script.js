let cards = createDeck();

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
const startButton = document.getElementById("Start");
const stayButton = document.getElementById("Stay");
const hitButton = document.getElementById("Hit");

if (startButton) {
  startButton.addEventListener("click", function (event) {
    if (!playerActive && roundOver) {
      startGame();
    }
  });
}

if (stayButton) {
  stayButton.addEventListener("click", function (event) {
    if (playerActive && !roundOver) {
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
      addCard(playerDiv, newCard);

      if (totalValue > 21) {
        myButtons.style.display = "none";
        WinLossMessage.innerHTML = "You Busted :|";
        playerActive = false;
        roundOver = true;
        startButton.style.display = "block";
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

function createDeck() {
  const cards = [];
  const suits = ["&#9824", "&#9829", "&#9830", "&#9827"];
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

  for (let i = 0; i < suits.length; i++) {
    for (const numericCard of numericCards) {
      const color = (suits[i] === "&#9829" || suits[i] === "&#9830") ? "red" : "black";
      cards.push({
        name: numericCard.name + suits[i],
        value: numericCard.value,
        color: color,
      });
    }
  }

  return cards;
}

function startGame() {
  cards = createDeck();
  myButtons.style.display = "block";
  startButton.innerHTML = "Play again ('P' key)";
  startButton.style.display = "none";

  totalValue = 0;
  dealersCardValue = 0;
  playersCards = [];
  dealersCards = [];
  playersTitleCards.innerHTML = "Your Cards";
  dealersTitleCards.innerHTML = "Dealer's Cards";
  dealerDiv.innerHTML = "";
  playerDiv.innerHTML = "";
  Result1.innerHTML = "";
  WinLossMessage.innerHTML = "";
  DealersMessage1.innerHTML = "";
  DealersMessage2.innerHTML = "";

  getCards();

  dealersFirstCard = getRandomCard();
  dealersSecondCard = getRandomCard();
  addCard(dealerDiv, dealersFirstCard);
  secondCardDiv = addCard(dealerDiv, { name: "?", color: "black" });
  dealersCardTitle.innerHTML = "Dealer's Card";
  playersCardTitle.innerHTML = "Player's Cards";

  displayMessage.innerHTML = "";
  dealersCardValue += dealersFirstCard.value;
  DealersTotalValue.innerHTML = "The <strong>dealer's total</strong> is now " + dealersCardValue;

  playerActive = true;
  roundOver = false;

  let randomNumber = Math.round(Math.random() * 1);
  const title = document.getElementById("Title")
  if (randomNumber === 0) {
  title.style.color = "red"
  } else {
      title.style.color = "black"
   }

  if (totalValue === 21) {
    Result1.innerHTML = "You got a <strong>Blackjack</strong>!";
  } else if (dealersFirstCard.value + dealersSecondCard.value === 21) {
    WinLossMessage.innerHTML = "You Lost :|";
    DealersTotalValue.innerHTML = "The dealer got <strong>Blackjack</strong>.";
    secondCardDiv.innerHTML = dealersSecondCard.name;
    myButtons.style.display = "none";
    playerActive = false;
    roundOver = true;
    startButton.style.display = "block";
  }
}

function addCard(parentDiv, cardValue) {
  const newCardDiv = document.createElement("div");
  newCardDiv.classList.add("card");
  newCardDiv.innerHTML = cardValue.name;
  newCardDiv.style.display = "inline-block";
  parentDiv.appendChild(newCardDiv);
  newCardDiv.style.color = cardValue.color === "red" ? "red" : "black";
  return newCardDiv;
}

function getRandomCard() {
  if (cards.length === 0) {
    return { name: "?", value: 0 };
  }
  const generatedIndex = Math.floor(Math.random() * cards.length);
  const [originalCard] = cards.splice(generatedIndex, 1);
  return {
    name: originalCard?.name ?? "?",
    value: originalCard?.value ?? 0,
    color: originalCard?.color ?? "black",
  };
}

function aceChecker(hand) {
  let adjustedTotal = 0;
  let aceCount = 0;

  for (const card of hand) {
    adjustedTotal += card.value;
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
  addCard(dealerDiv, newCard);
  DealersTotalValue.innerHTML = "The <strong>dealer's total</strong> is now " + dealersCardValue;
}

function getDealerResults() {
  startButton.style.display = "block";
  if (!playerActive && !roundOver) {
    myButtons.style.display = "none";
    dealersCards.push(dealersFirstCard, dealersSecondCard);
    dealersCardValue = aceChecker(dealersCards);

    if (dealersSecondCard) {
      secondCardDiv.innerHTML = dealersSecondCard.name;
    }
    DealersTotalValue.innerHTML = "The <strong>dealer's total</strong> is now " + dealersCardValue;

    while (dealersCardValue <= 16) {
      dealerDrawCard();
    }

    if (dealersCardValue > 21) {
      DealersMessage2.innerHTML = "<strong>The dealer busted!</strong>";
      WinLossMessage.innerHTML = "You Won!";
    } else {
      outcomeChecker();
    }

    roundOver = true;
  }
}

function getCards() {
  const card1 = getRandomCard();
  const card2 = getRandomCard();
  playersCards.push(card1, card2);
  totalValue = aceChecker(playersCards);
  addCard(playerDiv, card1);
  addCard(playerDiv, card2);
  Total.innerHTML = "<strong>Your total</strong> is " + totalValue;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "h" && playerActive && !roundOver) {
    const newCard = getRandomCard();
    playersCards.push(newCard);
    totalValue = aceChecker(playersCards);
    addCard(playerDiv, newCard);
    Total.innerHTML = "<strong>Your total</strong> is now " + totalValue;

    if (totalValue > 21) {
      WinLossMessage.innerHTML = "<strong>You busted</strong> :|";
      playerActive = false;
      roundOver = true;
      myButtons.style.display = "none";
      startButton.style.display = "block";
    } else if (totalValue === 21) {
      Result1.innerHTML = "<strong>You got 21!</strong>";
    }
  }

  if (event.key === "s" && playerActive && !roundOver) {
    displayMessage.innerHTML = "";
    Result1.innerHTML = "";
    DealersHand.innerHTML = "";
    dealersCardTitle.innerHTML = "Dealer's Cards";
    secondCardDiv.innerHTML = dealersSecondCard.name;
    playerActive = false;
    getDealerResults();
  }

  if (event.key === "p" && (!playerActive || roundOver)) {
    startGame();
  }
});

function outcomeChecker() {
  startButton.style.display = "block";
  if (dealersCardValue > 21) {
    DealersMessage2.innerHTML = "The <strong>dealer busted</strong>!";
    WinLossMessage.innerHTML = "You Won!";
  } else if (totalValue > 21) {
    WinLossMessage.innerHTML = "You Lost :|";
  } else if (totalValue === dealersCardValue) {
    if (totalValue === 21 && playersCards.length !== 2 && dealersCards.length !== 2) {
      WinLossMessage.innerHTML = "You Tied.";
    } else if (playersCards.length < dealersCards.length) {
      WinLossMessage.innerHTML = "You Won!";
    } else if (playersCards.length > dealersCards.length) {
      WinLossMessage.innerHTML = "You lost :|";
    } else {
      WinLossMessage.innerHTML = "You Tied.";
    }
  } else if (totalValue > dealersCardValue) {
    WinLossMessage.innerHTML = "You Won!";
  } else {
    WinLossMessage.innerHTML = "You lost :|";
  }
}
