

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const numBars = document.getElementById('numBars');
const speed = document.getElementById('speed');
const speedValues = [3000, 2000, 1000, 700, 500, 300, 100, 50, 25, 10];

const buttons = document.querySelectorAll(".algorithm")

let valueList = null;
let correct = null;

window.onload = () => {
  canvas.width = window.innerWidth - 100;
}

function refresh() {
  location.reload();
}

window.onresize = () => {
  canvas.width = window.innerWidth - 100;
  renderValueList();
}

function listComplete() {
  for (let i = 0; i < valueList.length; i++) {
    if (valueList[i] != correct[i]) return false;
  }
  return true;
}

function disableButtons() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
  numBars.disabled = true;
  speed.disabled = true;
}

function enableButtons() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
  numBars.disabled = false;
  speed.disabled = false;
}

//To aid with the visualization
function sleep() {
  return new Promise(resolve => setTimeout(resolve, speedValues[speed.value]));
}

//Wait for other algorithm to stop
function wait() {
  return new Promise(resolve => setTimeout(resolve, speedValues[speed.value]));
}

numBars.onchange = async (e) => {
  refreshBars();
}

async function refreshBars() {
  await wait();
  valueList = generateList(numBars.value * 10);
  const copy = [...valueList];
  correct = copy.sort((a, b) => a - b);
  renderValueList();
}

function generateList(amount) {
  let numbers = [];

  for (let i = 0; i < amount; i++) {
    const number = Math.floor(Math.random() * canvas.height)
    numbers.push(number);
  }

  return numbers;
}

function listFinished() {
  for (let i = 0; i < valueList.length; i++) {
    if (valueList[i] != correct[i]) return false;
  }
  return true;
}

function swapArrayValues(a, b) {
  const ph = valueList[a];
  valueList[a] = valueList[b];
  valueList[b] = ph;
}

function renderValueList() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width - 2) / valueList.length - 2;


  for (let i = 0; i < valueList.length; i++) {
    if (valueList[i] === correct[i]) {
      renderBar('rgb(0, 100, 0)', i, barWidth, valueList[i]);
    } else {
      renderBar('#CD0000', i, barWidth, valueList[i]);
    }
  }

}

function renderBar(colour, row, width, height) {
  ctx.fillStyle = colour;
  ctx.fillRect(row * (width + 2) + 2, canvas.height - height, width, canvas.height);
}

function shuffleList(list) {
  
  let shuffledList = [...list];

  for (let i = 0; i < 10; i++) {
    const index1 = Math.floor(Math.random() * shuffledList.length);
    const index2 = Math.floor(Math.random() * shuffledList.length);
    const ph = shuffledList[index1];
    shuffledList[index1] = shuffledList[index2];
    shuffledList[index2] = ph;
  }
  return shuffledList;

}

function getPivotIndex(start, end) {

  const length = end - start;

  let numbers = [valueList[start], valueList[Math.floor(length/2)], valueList[end]];
  let copy = [...numbers];
  let pivot = copy.sort((a,b) => a-b)[1];
  let pivotIndex = null;
  if (pivot == numbers[0]) {
    pivotIndex = start;
  } else if (pivot == numbers[1]) {
    pivotIndex = Math.floor(length/2);
  } else {
    pivotIndex = end;
  }

  return pivotIndex;
}

async function runQuicksort() {
  if (listComplete()) {
    console.log("Algorithm finished, please refresh")
    return;
  }
  disableButtons();
  await runQuicksortIteration(0, valueList.length - 1);
  enableButtons();
}

async function runQuicksortIteration(start, end) {

  await sleep();

  //Base case, swap then done
  if ((end - start) <= 1) {
    if (valueList[end] < valueList[start]) {
      swapArrayValues(end, start);
      renderValueList();
    }
    return;
  }

  //Otherwise need to get a valueList[pivotIndex] and partition
  let pivotIndex = getPivotIndex(start, end);
  //Move valueList[pivotIndex] to the back
  swapArrayValues(pivotIndex, end);
  renderValueList();
  pivotIndex = end;

  //Swap items so that lower than valueList[pivotIndex] is on left, higher on right
  while (true) {

    await sleep();
    let fromLeft = null;
    let fromRight = null;
    let leftIndex = null;
    let rightIndex = null;

    //Find item from left and item from right
    for (let i = start; i < end; i++) {
      if (valueList[i] >= valueList[pivotIndex] && fromLeft == null) {
        fromLeft = valueList[i];
        leftIndex = i;
      }
      if (valueList[i] < valueList[pivotIndex]) {
        fromRight = valueList[i];
        rightIndex = i;
      }
    }

    if (leftIndex > rightIndex) {
      swapArrayValues(leftIndex, end);
      renderValueList();
      if (start < (leftIndex - 1)) {
        await runQuicksortIteration(start, leftIndex - 1);
      }
      if ((leftIndex + 1) < end) {
        await runQuicksortIteration(leftIndex + 1, end);
      }
      return;
    } else {
      swapArrayValues(leftIndex, rightIndex);
      renderValueList();
    }
    renderValueList();
  }
}


function mergeSort(start, end) {
  newList = valueList.slice(start, end);
  newList.sort((a, b) => a - b);
  return newList;
}

async function runMergeSort() {
  if (listComplete()) {
    console.log("Algorithm finished, please refresh")
    return;
  }
  disableButtons();
  let factor = 2;
  while (factor < valueList.length) {

    //Split list
    for (let i = 0; i < (valueList.length-1); i+=factor) {
      //Sort list
      sortedList = mergeSort(i, i + factor);
      for (let y = 0; y < sortedList.length; y++) {
        valueList[i+y] = sortedList[y];
        renderValueList();
        await sleep();
      }
    }
    factor *= 2;
  }

  sortedList = mergeSort(0, valueList[valueList.length - 1]);
  for (let y = 0; y < sortedList.length; y++) {

    valueList[y] = sortedList[y];
    renderValueList();
    await sleep();
  }
  enableButtons();
}


async function runSelectionSort() {
  if (listComplete()) {
    console.log("Algorithm finished, please refresh")
    return;
  }
  disableButtons()
  let sortedIndex = 0;
  while(!listFinished()) {


    let currentMin = null;
    let currentMinIndex = null;

    for (let i = sortedIndex; i < valueList.length; i++) {

      if (currentMin == null || valueList[i] < currentMin) {
        currentMin = valueList[i];
        currentMinIndex = i;
      }
    }
    swapArrayValues(sortedIndex, currentMinIndex);
    await sleep();
    renderValueList();
    sortedIndex += 1;
    currentMin = null;
    currentMinIndex = null;
  }
  enableButtons();
}

async function runInsertionSort() {
  if (listComplete()) {
    console.log("Algorithm finished, please refresh")
    return;
  }
  disableButtons();
  while(!listFinished()) {


    for (let i = 1; i < valueList.length; i++) {

      let index = i + 0;
      while(valueList[index] < valueList[index-1] && index > 0) {
        swapArrayValues(index, index-1);
        index--;
        renderValueList();
        await sleep();
      }
      renderValueList();
      await sleep();
    }
  }
  enableButtons();
}

async function runBubbleSort() {
  if (listComplete()) {
    console.log("Algorithm finished, please refresh")
    return;
  }
  disableButtons();
  let sortedIndex = valueList.length;
  while (!listFinished()) {
    for (let i = 1; i < sortedIndex; i++) {
      if (valueList[i] < valueList[i - 1]) {
        swapArrayValues(i, i-1);
      }
      renderValueList();
      await sleep();
    }
    sortedIndex--;
  }
  enableButtons();
}

refreshBars();

