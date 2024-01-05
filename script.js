'use strict';

const SVG_NS = 'http://www.w3.org/2000/svg';

const progressIndicator = document.getElementById('progressIndicator');
const exposition = document.getElementById('exposition');
const expositionText = document.getElementById('expositionText');
const board = document.getElementById('gameBoard');
const backButton = document.getElementById('backButton');
const nextButton = document.getElementById('nextButton');

const allProperties = ['number', 'shape', 'color', 'fill'];
const allNumbers = [1, 2, 3];
const allShapes = ['diamond', 'squiggle', 'oval'];
const allColors = ['red', 'green', 'purple'];
const allFills = ['solid', 'blank', 'striped'];

let deck = [];
let selected = [];
let stepIndex = -1;

const steps = [
  [
    [
      {number: 1, shape: 'diamond', color: 'red', fill: 'solid'},
      {number: 2, shape: 'squiggle', color: 'purple', fill: 'blank'},
      {number: 3, shape: 'oval', color: 'green', fill: 'striped'},
    ],
    '<b><i>Set</i></b> is a game about <b>visual perception</b> and <b>pattern recognition</b>.'
  ],
  [
    [
      {number: 3, shape: 'squiggle', color: 'green', fill: 'solid'},
      {number: 3, shape: 'diamond', color: 'green', fill: 'striped'},
      {number: 3, shape: 'oval', color: 'green', fill: 'blank'},
    ],
    'The goal is to find <b>sets</b> of <b>three cards</b> that satisfy a special rule.'
  ],
  [
    [
      {number: 1, shape: 'squiggle', color: 'green', fill: 'striped'},
      {number: 3, shape: 'diamond', color: 'purple', fill: 'solid'},
      {number: 2, shape: 'oval', color: 'red', fill: 'blank'},
    ],
    'Each card has four properties: <b>number</b>, <b>shape</b>, <b>color</b>, and <b>fill</b>.'
  ],
  [
    [
      {number: 3, shape: 'oval', color: 'red', fill: 'solid'},
      {number: 2, shape: 'oval', color: 'red', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'red', fill: 'solid'},
    ],
    '<b>Number</b> can be 1, 2, or 3.',
  ],
  [
    [
      {number: 1, shape: 'squiggle', color: 'red', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'red', fill: 'solid'},
      {number: 1, shape: 'diamond', color: 'red', fill: 'solid'},
    ],
    '<b>Shape</b> can be diamond, oval, or squiggle.',
  ],
  [
    [
      {number: 1, shape: 'oval', color: 'purple', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'green', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'red', fill: 'solid'},
    ],
    '<b>Color</b> can be <span style="color: red">red</span>, <span style="color: green">green</span>, or <span style="color: purple">purple</span>.',
  ],
  [
    [
      {number: 1, shape: 'oval', color: 'red', fill: 'striped'},
      {number: 1, shape: 'oval', color: 'red', fill: 'blank'},
      {number: 1, shape: 'oval', color: 'red', fill: 'solid'},
    ],
    '<b>Fill</b> can be solid, blank, or striped.',
  ],
  [
    [
      {number: 2, shape: 'squiggle', color: 'green', fill: 'striped'},
      {number: 3, shape: 'diamond', color: 'green', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'green', fill: 'blank'},
    ],
    'A set consists of three cards where <u>every property is either <b>all same</b> or <b>all different</b></u>.',
  ],
  [
    [
      {number: 2, shape: 'squiggle', color: 'green', fill: 'striped'},
      {number: 2, shape: 'diamond', color: 'purple', fill: 'striped'},
      {number: 2, shape: 'oval', color: 'red', fill: 'striped'},
    ],
    'For example, these three cards form a set:<p><i>Number</i>: all same<br><i>Shape</i>: all different<br><i>Color</i>: all different<br><i>Fill</i>: all same',
  ],
  [
    [
      {number: 2, shape: 'squiggle', color: 'green', fill: 'striped'},
      {number: 3, shape: 'squiggle', color: 'purple', fill: 'solid'},
      {number: 1, shape: 'squiggle', color: 'red', fill: 'blank'},
    ],
    'In fact, every example so far has been a set :)',
  ],
  [
    [
      {number: 2, shape: 'squiggle', color: 'green', fill: 'blank'},
      {number: 1, shape: 'diamond', color: 'purple', fill: 'blank'},
      {number: 3, shape: 'oval', color: 'red', fill: 'blank'},
    ],
    'Here\'s another example of a set:<p><i>Number</i>: all different<br><i>Shape</i>: all different<br><i>Color</i>: all different<br><i>Fill</i>: all same',
  ],
  [
    [
      {number: 2, shape: 'diamond', color: 'green', fill: 'solid'},
      {number: 1, shape: 'diamond', color: 'green', fill: 'solid'},
      {number: 3, shape: 'oval', color: 'green', fill: 'solid'},
    ],
    'Here\'s an example that\'s <b>not a set</b>:<p><i>Number</i>: all different<br><i>Shape</i>: oval, diamond, diamond (<b>INVALID</b>)<br><i>Color</i>: all same<br><i>Fill</i>: all same',
  ],
  [
    [
      {number: 3, shape: 'diamond', color: 'green', fill: 'solid'},
      {number: 2, shape: 'diamond', color: 'red', fill: 'striped'},
      {number: 3, shape: 'diamond', color: 'purple', fill: 'striped'},
    ],
    'Here\'s another example that\'s <b>not a set</b>:<p><i>Number</i>: 3, 2, 3 (<b>INVALID</b>)<br><i>Shape</i>: all same<br><i>Color</i>: all different<br><i>Fill</i>: striped, striped, solid (<b>INVALID</b>)',
  ],
  [
    [
      {number: 3, shape: 'diamond', color: 'purple', fill: 'striped'},
      {number: 2, shape: 'diamond', color: 'red', fill: 'solid'},
      {number: 2, shape: 'oval', color: 'red', fill: 'solid'},
      {number: 2, shape: 'squiggle', color: 'green', fill: 'blank'},
      {number: 2, shape: 'squiggle', color: 'red', fill: 'solid'},
      {number: 3, shape: 'oval', color: 'red', fill: 'striped'},
    ],
    'Can you find a set?'
  ],
  [
    [
      {number: 1, shape: 'oval', color: 'purple', fill: 'solid'},
      {number: 1, shape: 'diamond', color: 'red', fill: 'blank'},
      {number: 2, shape: 'diamond', color: 'purple', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'red', fill: 'striped'},
      {number: 2, shape: 'squiggle', color: 'red', fill: 'blank'},
      {number: 1, shape: 'squiggle', color: 'green', fill: 'blank'},
      {number: 2, shape: 'diamond', color: 'purple', fill: 'blank'},
      {number: 3, shape: 'squiggle', color: 'purple', fill: 'striped'},
      {number: 3, shape: 'diamond', color: 'green', fill: 'blank'},
    ],
    'Can you find a set?<p>Doing so will complete the tutorial and move onto a real game!',
  ],
];

function getNewCard() {
  let {number, shape, color, fill} = deck.pop();

  let card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('number', number);
  card.setAttribute('shape', shape);
  card.setAttribute('color', color);
  card.setAttribute('fill', fill);

  for (let n = 0; n < number; n++) {
    let shapeElement = document.createElementNS(SVG_NS, 'svg');
    shapeElement.classList.add('shape');
    shapeElement.setAttribute('viewBox', '0 0 200 400');

    let fillElement = document.createElementNS(SVG_NS, 'use');
    fillElement.setAttribute('href', '#' + shape);
    switch (fill) {
      case 'solid':
        fillElement.setAttribute('fill', color);
        break
      case 'blank':
        fillElement.setAttribute('fill', 'transparent');
        break;
      case 'striped':
        fillElement.setAttribute('fill', color);
        fillElement.setAttribute('mask', 'url(#mask-stripe)');
        break;
    }
    shapeElement.appendChild(fillElement);

    let strokeElement = document.createElementNS(SVG_NS, 'use');
    strokeElement.setAttribute('href', '#' + shape);
    strokeElement.setAttribute('stroke', color);
    strokeElement.setAttribute('fill', 'none');
    strokeElement.setAttribute('stroke-width', '15');
    shapeElement.appendChild(strokeElement);

    card.appendChild(shapeElement);
  }

  card.addEventListener('click', () => toggleSelected(card));
  return card;
}

function toggleSelected(card) {
  if (card.classList.contains('selected')) {
    card.classList.remove('selected');
    selected = selected.filter(item => item !== card);
  } else if (selected.length < 3) {
    card.classList.add('selected');
    selected.push(card);
    if (selected.length === 3) {
      if (isSet(selected)) {
        nextStep();
      } else {
        card.classList.remove('selected');
        selected.pop();
      }
    }
  }
}

function isSet(cards) {
  for (let property of allProperties) {
    let values = cards.map(card => card.getAttribute(property));
    let uniqueValues = new Set(values);
    if (uniqueValues.size !== 1 && uniqueValues.size !== 3) {
      return false;
    }
  }
  return true;
}

function boardHasSet() {
  let n = board.children.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (isSet([board.children[i], board.children[j], board.children[k]])) {
          return true;
        }
      }
    }
  }
  return false;
}

function rewind() {
  if (stepIndex > 0) {
    progressIndicator.children[stepIndex - 1].classList.add('progressOff');
    progressIndicator.children[stepIndex - 1].classList.remove('progressOn');
  }
  stepIndex--;
  renderStep();
}

function nextStep() {
  if (stepIndex === steps.length - 1) {
    window.location.href = 'https://robot-dreams.github.io/set-game';
  }
  stepIndex++;
  if (stepIndex > 0) {
    progressIndicator.children[stepIndex - 1].classList.add('progressOn');
    progressIndicator.children[stepIndex - 1].classList.remove('progressOff');
  }
  renderStep();
}

function renderStep() {
  if (stepIndex == 0) {
    backButton.disabled = true;
  } else {
    backButton.removeAttribute('disabled');
  }

  if (stepIndex == steps.length - 1) {
    nextButton.disabled = true;
  } else {
    nextButton.removeAttribute('disabled');
  }

  let [cards, expositionData] = steps[stepIndex];

  board.innerHTML = '';
  board.style.display = 'none';
  if (cards !== null) {
    board.style.display = 'grid';
    deck = cards.slice();
    selected = [];
    while (deck.length > 0) {
      board.appendChild(getNewCard());
    }
  }

  exposition.style.display = 'none';
  if (expositionData !== null) {
    exposition.style.display = 'flex';
    expositionText.innerHTML = expositionData;
  }
}

function handleKeyDown(e) {
  switch (e.keyCode) {
    case 37:
      if (stepIndex > 0) {
        rewind();
      }
      break;
    case 39:
      if (stepIndex < steps.length - 1) {
        nextStep();
      }
      break;
  }
}

backButton.addEventListener('click', rewind);
nextButton.addEventListener('click', nextStep);
document.addEventListener('keydown', handleKeyDown);
for (let i = 0; i < steps.length - 1; i++) {
  let segment = document.createElement('div');
  segment.classList.add('progressOff');
  progressIndicator.appendChild(segment);
}
nextStep();
