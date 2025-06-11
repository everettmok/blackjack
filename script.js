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
const restartButton = document.getElementById("Restart");
const stayButton = document.getElementById("Stay");
const hitButton = document.getElementById("Hit");

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

if (startButton) {
  startButton.addEventListener("click", () => {
    if (!playerActive && roundOver) startGame();
  });
}

if (restartButton) {
  restartButton.addEventListener("click", () => {
    if (roundOver) startGame();
  });
}

if (stayButton) {
  stayButton.addEventListener("click", () => {
    if (playerActive && !roundOver) {
      endPlayerTurn();
    }
  });
}

if (hitButton) {
  hitButton.addEventListener("click", () => {
    if (playerActive && !roundOver) playerHit();
  });
}

function createDeck() {
  const suits = ["\u2660", "\u2665", "\u2666", "\u2663"];
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck = [];

  for (let suit of suits) {
    for (let value of values) {
      let cardValue = value === "A" ? 11 : ["J", "Q", "K"].includes(value) ? 10 : parseInt(value);
      deck.push({
        name: `${value}${suit}`,
        value: cardValue,
        color: ["\u2665", "\u2666"].includes(suit) ? "red" : "black"
      });
    }
  }

  return deck.sort(() => Math.random() - 0.5); // shuffle
}

function startGame() {
  cards = createDeck();
  myButtons.style.display = "block";
  startButton.style.display = "none";
  restartButton.style.display = "none";

  totalValue = 0;
  dealersCardValue = 0;
  playersCards = [];
  dealersCards = [];

  playerDiv.innerHTML = "";
  dealerDiv.innerHTML = "";
  playersTitleCards.innerHTML = "Your Cards";
  dealersTitleCards.innerHTML = "Dealer's Cards";
  Result1.innerHTML = "";
  WinLossMessage.innerHTML = "";
  DealersMessage1.innerHTML = "";
  DealersMessage2.innerHTML = "";

  // Deal to player
  const card1 = getRandomCard();
  const card2 = getRandomCard();
  playersCards.push(card1, card2);
  addCard(playerDiv, card1);
  addCard(playerDiv, card2);
  totalValue = aceChecker(playersCards);
  Total.innerHTML = `<strong>Your total</strong> is ${totalValue}`;

  // Deal to dealer
  dealersFirstCard = getRandomCard();
  dealersSecondCard = getRandomCard();
  dealersCards.push(dealersFirstCard, dealersSecondCard);
  addCard(dealerDiv, dealersFirstCard);
  secondCardDiv = addCard(dealerDiv, { name: "?", value: 0, color: "black" });
  dealersCardValue = aceChecker([dealersFirstCard]);
  DealersTotalValue.innerHTML = `The <strong>dealer's total</strong> is now ${dealersCardValue}`;

  playerActive = true;
  roundOver = false;
}

function getRandomCard() {
  return cards.length ? cards.pop() : { name: "?", value: 0, color: "black" };
}

function addCard(parent, card) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = card.name;
  div.style.color = card.color;
  div.style.display = "inline-block";
  parent.appendChild(div);
  return div;
}

function aceChecker(hand) {
  let total = hand.reduce((sum, card) => sum + card.value, 0);
  let aceCount = hand.filter(card => card.name.startsWith("A")).length;
  while (total > 21 && aceCount--) total -= 10;
  return total;
}

function playerHit() {
  const card = getRandomCard();
  playersCards.push(card);
  totalValue = aceChecker(playersCards);
  addCard(playerDiv, card);
  Total.innerHTML = `<strong>Your total</strong> is now ${totalValue}`;

  if (totalValue > 21) {
    WinLossMessage.innerHTML = "You Busted :|";
    myButtons.style.display = "none";
    playerActive = false;
    roundOver = true;
    restartButton.style.display = "block";
  } else if (totalValue === 21) {
    Result1.innerHTML = "<strong>You got 21!</strong>";
  }
}

function endPlayerTurn() {
  displayMessage.innerHTML = "";
  Result1.innerHTML = "";
  DealersHand.innerHTML = "";
  dealersCardTitle.innerHTML = "Dealer's Cards";
  secondCardDiv.innerHTML = dealersSecondCard.name;
  playerActive = false;
  getDealerResults();
}

function dealerDrawCard() {
  const card = getRandomCard();
  dealersCards.push(card);
  dealersCardValue = aceChecker(dealersCards);
  addCard(dealerDiv, card);
  DealersTotalValue.innerHTML = `The <strong>dealer's total</strong> is now ${dealersCardValue}`;
}

function getDealerResults() {
  restartButton.style.display = "block";
  myButtons.style.display = "none";
  while (dealersCardValue <= 16) {
    dealerDrawCard();
  }
  outcomeChecker();
  roundOver = true;
}

function outcomeChecker() {
  if (dealersCardValue > 21) {
    WinLossMessage.innerHTML = "You Won! Dealer busted.";
  } else if (totalValue > 21) {
    WinLossMessage.innerHTML = "You Lost :|";
  } else if (totalValue > dealersCardValue) {
    WinLossMessage.innerHTML = "You Won!";
  } else if (totalValue < dealersCardValue) {
    WinLossMessage.innerHTML = "You Lost :|";
  } else {
    WinLossMessage.innerHTML = "You Tied.";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "h" && playerActive && !roundOver) playerHit();
  if (e.key === "s" && playerActive && !roundOver) endPlayerTurn();
  if (e.key === "r" && roundOver) startGame();
  if (e.key === "p" && (!playerActive || roundOver)) startGame();
});
