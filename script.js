'use strict';

const SVG_NS = 'http://www.w3.org/2000/svg';

const exposition = document.getElementById('exposition');
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
let targetCards = 9;


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
    'The goal is to find <b>sets</b> of <b>three cards</b> that satisfy a special requirement.'
  ],
  [
    null,
    'Each card has four properties...'
  ],
  [
    [
      {number: 3, shape: 'oval', color: 'red', fill: 'solid'},
      {number: 2, shape: 'oval', color: 'red', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'red', fill: 'solid'},
    ],
    '<b>number</b> (1, 2, or 3)...',
  ],
  [
    [
      {number: 1, shape: 'squiggle', color: 'red', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'red', fill: 'solid'},
      {number: 1, shape: 'diamond', color: 'red', fill: 'solid'},
    ],
    '<b>shape</b> (diamond, oval, or squiggle)...',
  ],
  [
    [
      {number: 1, shape: 'oval', color: 'purple', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'green', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'red', fill: 'solid'},
    ],
    '<b>color</b> (<span style="color: red">red</span>, <span style="color: green">green</span>, or <span style="color: purple">purple</span>)...',
  ],
  [
    [
      {number: 1, shape: 'oval', color: 'red', fill: 'striped'},
      {number: 1, shape: 'oval', color: 'red', fill: 'blank'},
      {number: 1, shape: 'oval', color: 'red', fill: 'solid'},
    ],
    'and <b>fill</b> (solid, blank, or striped).',
  ],
  [
    [
      {number: 2, shape: 'squiggle', color: 'green', fill: 'striped'},
      {number: 2, shape: 'diamond', color: 'purple', fill: 'striped'},
      {number: 2, shape: 'oval', color: 'red', fill: 'striped'},
    ],
    'A <b>set</b> consists of <b>three cards</b> where <b>every property</b> is either <b>all same</b> or <b>all different</b>. For example, this is a set:<p><b>Number</b>: all same<br><b>Shape</b>: all different<br><b>Color</b>: all different<br><b>Fill</b>: all same',
  ],
  [
    [
      {number: 2, shape: 'squiggle', color: 'green', fill: 'blank'},
      {number: 1, shape: 'diamond', color: 'purple', fill: 'blank'},
      {number: 3, shape: 'oval', color: 'red', fill: 'blank'},
    ],
    'Here\'s another example of a set:<p><b>Number</b>: all different<br><b>Shape</b>: all different<br><b>Color</b>: all different<br><b>Fill</b>: all same',
  ],
  [
    [
      {number: 2, shape: 'diamond', color: 'green', fill: 'blank'},
      {number: 1, shape: 'diamond', color: 'green', fill: 'blank'},
      {number: 3, shape: 'oval', color: 'green', fill: 'blank'},
    ],
    'Here\'s an example that\'s <b>not a set</b>:<p><b>Number</b>: all different<br><b>Shape</b>: INVALID (oval, diamond, diamond)!<br><b>Color</b>: all different<br><b>Fill</b>: all same',
  ],
  [
    [
      {number: 2, shape: 'diamond', color: 'green', fill: 'striped'},
      {number: 2, shape: 'diamond', color: 'red', fill: 'striped'},
      {number: 3, shape: 'diamond', color: 'purple', fill: 'striped'},
    ],
    'Here\'s another example that\'s <b>not a set</b>:<p><b>Number</b>: INVALID (3, 2, 2)!<br><b>Shape</b>: all same<br><b>Color</b>: all different<br><b>Fill</b>: all same',
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
      {number: 2, shape: 'diamond', color: 'red', fill: 'blank'},
      {number: 2, shape: 'diamond', color: 'purple', fill: 'solid'},
      {number: 1, shape: 'oval', color: 'red', fill: 'striped'},
      {number: 2, shape: 'squiggle', color: 'red', fill: 'blank'},
      {number: 1, shape: 'diamond', color: 'green', fill: 'blank'},
      {number: 2, shape: 'diamond', color: 'purple', fill: 'blank'},
      {number: 3, shape: 'squiggle', color: 'purple', fill: 'striped'},
      {number: 2, shape: 'diamond', color: 'green', fill: 'blank'},
    ],
    'Can you find a set?',
  ],
  [
    null,
    '<a href="https://robot-dreams.github.io/set-game">Ready to play for real?</a>'
  ],
];

// Includes both endpoints.
function randint(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

function randchoice(items) {
  return items[randint(0, items.length - 1)];
}

function handleMode(mode, allItems, single) {
  if (mode === single) {
    return [randchoice(allItems)];
  } else {
    return allItems;
  }
}

function getShuffledDeck(mode) {
  let result = []
  let numbers = handleMode(mode, allNumbers, 'singlenumber');
  let shapes = handleMode(mode, allShapes, 'singleshape');
  let colors = handleMode(mode, allColors, 'singlecolor');
  let fills = handleMode(mode, allFills, 'singlefill');
  for (let number of numbers) {
    for (let shape of shapes) {
      for (let color of colors) {
        for (let fill of fills) {
          result.push({number, shape, color, fill});
        }
      }
    }
  }
  // Knuth shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

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
        /*
        replaceSelected();
        ensureSet();
        */
      } else {
        card.classList.remove('selected');
        selected.pop();
      }
    }
  }
}

function replaceSelected() {
  let children = Array.from(board.children);
  let replacements = [];
  if (deck.length > 0 && children.length <= targetCards) {
    for (let i = 0; i < 3; i++) {
      replacements.push(getNewCard());
    }
  } else {
    let numToMove = 0;
    for (let i = 0; i < children.length - selected.length; i++) {
      let card = children[i];
      if (card.classList.contains('selected')) {
        numToMove++;
      }
    }
    for (let i = children.length - 1; i >= 0; i--) {
      let card = children[i];
      if (!card.classList.contains('selected')) {
        if (replacements.length < numToMove) {
          replacements.push(card);
        }
      }
    }
  }
  for (let i = 0; i < children.length; i++) {
    let card = children[i];
    if (card.classList.contains('selected')) {
      if (replacements.length > 0) {
        board.replaceChild(replacements.pop(), card);
      } else {
        card.remove();
      }
    }
  }
  selected = [];
}

function ensureSet() {
  while (deck.length > 0 && !boardHasSet()) {
    dealThree();
  }
}

function dealThree() {
  for (let i = 0; i < 3; i++) {
    board.appendChild(getNewCard());
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

let stepIndex = -1;

function rewind() {
  stepIndex--;
  renderStep();
}

function nextStep() {
  stepIndex++;
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
    while (board.children.length < targetCards && deck.length > 0) {
      dealThree();
    }
  }

  exposition.style.display = 'none';
  if (expositionData !== null) {
    exposition.style.display = 'flow';
    exposition.innerHTML = expositionData;
  }
}

backButton.addEventListener('click', rewind);
nextButton.addEventListener('click', nextStep);
nextStep();