console.log("script.js running")

const slider = document.getElementById('slider');

const containerWidth = 800;
const containerHeight = 400;

const blockLevels = [5, 10, 15, 25, 50, 80, 120];
const sleepTimes = [400, 300, 200, 100, 50, 25]

document.onload = generateBlocks();

slider.addEventListener("change", generateBlocks);

function generateBlocks() {
  container = document.getElementById("container");

  //Empty container so it's random each time
  container.innerHTML = "";

  const numBlocks = blockLevels[slider.value - 1];
  const blockWidth = (containerWidth / numBlocks) - 2;

  for (let i = 0; i < numBlocks; i++) {
    container.innerHTML += '<div class="block"></div>';
  }

  //Set the css of the blocks
  const blocks = document.querySelectorAll('.block');
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].style.width = blockWidth + 'px';
    blocks[i].style.height = Math.ceil(Math.random() * containerHeight) + 'px';
  }
}

//To aid with the visualization
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBubbleSort() {
  //Get the blocks
  const blocks = document.querySelectorAll('.block');

  let sortedBlocks = [];
  for (let i = 0; i < blocks.length; i++) {
    sortedBlocks.push(parseInt(blocks[i].style.height.replace('px', '')));
  }
  sortedBlocks.sort((a, b) => a - b);

  let finished = false;
  while (!finished) {
    let outOfOrder = false;
    for (let i = 0; i < blocks.length; i++) {
      if (i == blocks.length - 1) break;

      block1 = parseInt(blocks[i].style.height.replace('px', ''));
      block2 = parseInt(blocks[i+1].style.height.replace('px', ''));

      if (block1 > block2) {
        outOfOrder = true;
        const hold = blocks[i].style.height;
        blocks[i].classList.remove("correct");
        blocks[i+1].classList.remove("correct");
        blocks[i].style.height = blocks[i+1].style.height;
        blocks[i+1].style.height = hold;
      }
      await sleep(sleepTimes[slider.value - 1]);
    }
    for (let i = 0; i < blocks.length; i++) {
      block = parseInt(blocks[i].style.height.replace('px', ''));
      if (block == sortedBlocks[i]) {
        blocks[i].classList.add("correct");
      } else {
        blocks[i].classList.remove("correct");
      }
    }
    if (!outOfOrder) {
      finished = true;
    }
  }

}

async function runQuickSort() {
  const blocks = document.querySelectorAll('.block');
  runIteration(blocks, 0, blocks.length);
}

async function runIteration(blocks, start, end) {

  //If length is less than 2 there is less than 3 in array
  const length = end - start;

  if (length < 3) {
    if (length == 2) {
      const a = parseInt(blocks[start].style.height.replace('px', ''));
      const b = parseInt(blocks[start + 1].style.height.replace('px', ''));
      if (a > b) {
        //Need to swap them
        const ph = blocks[start].style.height;
        blocks[start].style.height = blocks[start + 1].style.height;
        blocks[start + 1].style.height = ph;
      }
      blocks[start + 1].classList.add("correct");
    }
    blocks[start].classList.add("correct");
    return;
  }


  a = parseInt(blocks[start].style.height.replace('px', ''));
  b = parseInt(blocks[end-1].style.height.replace('px', ''));
  c = parseInt(blocks[Math.floor( length / 2)].style.height.replace('px', ''));
  
  const pivot = Math.max(Math.min(a,b), Math.min(Math.max(a,b),c));
  let pivotIndex = null;

  //First, swap pivot to the right
  if (pivot == a) {
    pivotIndex = start;
    const ph = blocks[pivotIndex].style.height;
    blocks[pivotIndex].style.height = blocks[end-1].style.height;
    blocks[end-1].style.height = ph;
  } else if (pivot == b) {
    pivotIndex = end - 1;
  } else {
    pivotIndex = Math.floor(length / 2);
    const ph = blocks[pivotIndex].style.height;
    blocks[pivotIndex].style.height = blocks[end-1].style.height;
    blocks[end-1].style.height = ph;
  }

  await sleep(100);

  while (true) {
    let fromLeft = null;
    let fromRight = null;
    let leftIndex = null;
    let rightIndex = null;

    //Find item from left and item from right
    for (let i = start; i < end; i++) {
      const blockHeight = parseInt(blocks[i].style.height.replace('px', ''));
      if (blockHeight >= pivot && fromLeft == null) {
        fromLeft = blocks[i];
        leftIndex = i;
      }
      if (blockHeight < pivot) {
        fromRight = blocks[i];
        rightIndex = i;
      }
    }

    if (leftIndex > rightIndex) {
      const ph = blocks[leftIndex].style.height;
      blocks[leftIndex].style.height = blocks[end-1].style.height;
      blocks[end-1].style.height = ph;
      blocks[leftIndex].classList.add("correct");
      runIteration(blocks, start, leftIndex);
      runIteration(blocks, leftIndex + 1, end);
      return;
    } else {
      const ph = blocks[leftIndex].style.height;
      blocks[leftIndex].style.height = blocks[rightIndex].style.height;
      blocks[rightIndex].style.height = ph;
    }
    await sleep(100);
  }
}

async function shuffleBack(blocks, curIndex, toInsert, sortedBlocks) {
  const ph = blocks[curIndex].style.height;
  for (let i = curIndex; i > toInsert; i--) {
    blocks[i].style.height = blocks[i-1].style.height; 
    if (parseInt(blocks[i].style.height.replace('px', '')) == sortedBlocks[i]) {
      blocks[i].classList.add("correct");
    }
  }
  blocks[toInsert].style.height = ph;
  if (parseInt(blocks[toInsert].style.height.replace('px', '')) == sortedBlocks[toInsert]) {
    blocks[toInsert].classList.add("correct");
  }
}

async function runInsertionSort() {
  const blocks = document.querySelectorAll('.block');

  let sortedBlocks = [];
  for (let i = 0; i < blocks.length; i++) {
    sortedBlocks.push(parseInt(blocks[i].style.height.replace('px', '')));
  }
  sortedBlocks.sort((a, b) => a - b);

  const index = 0;
  for (let i = index; i < blocks.length; i++) {
    if (i == 0) continue;

    const a = parseInt(blocks[i].style.height.replace('px', ''));
    const b = parseInt(blocks[i-1].style.height.replace('px', ''));
    if (a < b) {
      let y = i - 1;
      while (y >= 0) {
        if (y == 0) {
          shuffleBack(blocks, i, 0, sortedBlocks);
          y = -1;
          continue;
        }
        const c = parseInt(blocks[y-1].style.height.replace('px', ''));
        if (a > c) {
          shuffleBack(blocks, i, y, sortedBlocks);
          y = -1;
          continue;
        }
        y--;
        
      }
    }
    await sleep(50);
  }

}

function mergeSort(blockList, start, end) {
  newList = blockList.slice(start, end);
  newList.sort((a, b) => a - b);
  return newList;
}

async function runMergeSort() {

  const blocks = document.querySelectorAll('.block');

  let sortedBlocks = [];
  for (let i = 0; i < blocks.length; i++) {
    sortedBlocks.push(parseInt(blocks[i].style.height.replace('px', '')));
  }
  sortedBlocks.sort((a, b) => a - b);

  blockList = [];

  for (let i = 0; i < blocks.length; i++) {
    blockList.push(parseInt(blocks[i].style.height.replace('px', '')));;
  }

  factor = 2;
  while (factor < blocks.length) {
    //Split list
    for (let i = 0; i < (blockList.length-1); i+=factor) {
      //Sort list
      sortedList = mergeSort(blockList, i, i + factor);
      for (let y = 0; y < sortedList.length; y++) {
        blocks[i+y].style.height = sortedList[y] + 'px';
        if (sortedList[y] == sortedBlocks[i+y]) {
          blocks[i+y].classList.add('correct');
        }
        await sleep(10);
      }
    }
    factor *= 2;
  }
  sortedList = mergeSort(blockList, 0, blockList.length);
  for (let y = 0; y < sortedList.length; y++) {
    blocks[y].style.height = sortedList[y] + 'px';
    if (sortedList[y] == sortedBlocks[y]) {
      blocks[y].classList.add('correct');
    }
    await sleep(10);
  }
}

async function runSelectionSort() {

  const blocks = document.querySelectorAll('.block');

  let currentMinIndex = 0;
  let currentMin = 0;
  let currentIndex = 0;

  while (currentIndex != (blocks.length - 1)) {
    for (let i = currentIndex; i < blocks.length; i++) {
      value = parseInt(blocks[i].style.height.replace('px', ''));
      if (i == 0) currentMin = value;

      if (value < currentMin) {
        currentMin = value;
        currentMinIndex = i;
      }
    }
    if (currentMinIndex != currentIndex) {
      //Swap the two
      const ph = blocks[currentMinIndex].style.height;
      blocks[currentMinIndex].style.height = blocks[currentIndex].style.height;
      blocks[currentIndex].style.height = ph;
    }
    blocks[currentIndex].classList.add('correct');
    currentIndex++;
    currentMin = parseInt(blocks[currentIndex].style.height.replace('px', ''));
    await sleep(70);
    currentMinIndex = currentIndex;
  }
  blocks[blocks.length - 1].classList.add('correct');
}

