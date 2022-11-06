const TEST_OWNER_NUM = 12;
const TEST_CURRENT_DAY = new Date('2022-10-3');
// const TEST_CURRENT_DAY = -1;
const TOTAL_IMG_NUM = 24;
const TARGET_NUM = TOTAL_IMG_NUM / 2;
const BG_COLOR = 255;

let SIZE;
let currentImage = 0;
let imgs = [];
let mainCanvas;
let showVote = false;
let refused = false;

let goChaos = () => {
    return currentDate > expireDate && ownerNum == TARGET_NUM;
}

let canVote = () => {
    return currentDate <= expireDate && ownerNum == TARGET_NUM;
}

let randInt = range => Math.floor(Math.random() * range);

function preload() {
    for (let i = 0; i < TOTAL_IMG_NUM; i++) {
        let img = loadImage(`./static/imgs/${(i < 10) ? '0' + i : i}.jpg`);
        imgs.push(img);
    }
}

function askVote() {
    if (canVote()) {
        let askVoteHTML = document.querySelector('.ask-vote');
        if (!refused) {
            if (!showVote) {
                askVoteHTML.style.display = 'none';
            } else {
                frameRate(20);
                askVoteHTML.style.display = 'block';
            }
        } else {
            askVoteHTML.style.display = 'none';
        }
    }
}

function goUrl() {
    window.open(`https://tp25.2enter.art/entry?addr=${URL_viewer}`, '_blank');
    refused = true;
}

function goBack() {
    console.log('Refused!!!')
    showVote = false;
    refused = true;
}

function normalMode() {
    frameRate(1);
    blendMode(DARKEST);
    if (currentImage + 2 > ownerNum * 2 || currentImage == 24) {
        blendMode(BLEND);
        background(BG_COLOR);
        showVote = true;
        currentImage = 0;
    }

    // console.log(ownerNum, currentImage)
    image(imgs[currentImage], 0, 0, SIZE, SIZE);
    image(imgs[currentImage + 1], 0, 0, SIZE, SIZE);
    currentImage += 2;
}

function chaosMode() {
    frameRate(20);
    filter(BLUR, 1.5);
    let randNum = (ownerNum != 0) ? randInt(ownerNum * 2 - 1) : 0;

    // let bSeed = randNum % 4;
    let bSeed = randInt(4);
    switch (bSeed) {
        case 0:
            blendMode(DARKEST);
            break;
        case 1:
            blendMode(DIFFERENCE);
            break;
        case 2:
            blendMode(HARD_LIGHT);
            break;
        case 3:
            blendMode(SOFT_LIGHT);
            break;
    }

    image(imgs[randNum], 0, 0, SIZE, SIZE);
    blendMode(SOFT_LIGHT);
}

function setup() {
    if (TEST_OWNER_NUM != -1) ownerNum = TEST_OWNER_NUM;
    if (TEST_CURRENT_DAY != -1) currentDate = TEST_CURRENT_DAY;

    SIZE = (windowWidth > windowHeight) ? windowHeight * .95 : windowWidth * .95;
    blendMode(BLEND);
    background(BG_COLOR);

    mainCanvas = createCanvas(SIZE, SIZE);
    mainCanvas.parent('main');
}

function draw() {
    if (ownerList != 0 && recentSoldDate != 0) {
        askVote();
        goChaos() ? chaosMode() : normalMode();
    } else {
        console.log('Not Yet!!');
    }
}
