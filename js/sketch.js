const TEST_OWNER_NUM = -1;
const TEST_CURRENT_DAY = -1;
const TEST_EXPIRE_DAY = -1;
// const TEST_CURRENT_DAY = new Date('8028-11-12');
// const TEST_EXPIRE_DAY = new Date('2022-12-01');

const TOTAL_IMG_NUM = 24;
const TARGET_NUM = TOTAL_IMG_NUM / 2;
const BG_COLOR = 255;

let main_size, main_canvas;
let currentImage = 0;
let imgs = [];
let show_vote = false;
let refused = false;
let initialized = false;

let go_chaos = () => {
    return currentDate > expireDate && ownerNum >= TARGET_NUM;
}

let can_vote = () => {
    return currentDate <= expireDate && ownerNum >= TARGET_NUM;
}

let rand_int = range => Math.floor(Math.random() * range);

function preload() {
    let img;
    for (let i = 0; i < TOTAL_IMG_NUM; i++) {
        img = loadImage(`./static/imgs/${(i < 10) ? '0' + i.toString() : i}.jpg`);
        imgs.push(img);
    }
    console.log('Preload Done!!!')
}

function ask_vote() {
    let ask_voteHTML = document.querySelector('.ask-vote');
    let countDown = document.querySelector('#count-down');
    if (!refused) {
        if (!show_vote) {
            ask_voteHTML.style.display = 'none';
        } else {
            frameRate(20);
            ask_voteHTML.style.display = 'block';
            countDown.innerHTML = `倒數 ${Math.floor((expireDate - currentDate) / (1000 * 3600 * 24))} 天`;
        }
    } else {
        ask_voteHTML.style.display = 'none';
    }
}

function go_url() {
    window.open(`https://tp25.2enter.art/entry?addr=${URL_viewer ?? 'guest'}`, '_blank');
    refused = true;
}

function go_back() {
    console.log('Refused!!!')
    show_vote = false;
    refused = true;
}

function normal_mode() {
    frameRate(1);
    blendMode(DARKEST);
    if (currentImage + 2 > ownerNum * 2 || currentImage == 24) {
        blendMode(BLEND);
        background(BG_COLOR);
        show_vote = true;
        currentImage = 0;
    }

    image(imgs[currentImage], 0, 0, main_size, main_size);
    image(imgs[currentImage + 1], 0, 0, main_size, main_size);
    currentImage += 2;
}

function chaos_mode() {
    frameRate(20);
    filter(BLUR, 1.5);
    let randNum = (ownerNum != 0) ? rand_int(ownerNum * 2 - 1) : 0;

    let bSeed = rand_int(4);
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

    image(imgs[randNum], 0, 0, main_size, main_size);
    blendMode(SOFT_LIGHT);
}

function show_status() {
    if (go_chaos()) console.log('Vote End');
    else if (can_vote()) console.log('Voting');
    else console.log("Vote haven't Start Yet");
    console.log(`Owner Number:\n${ownerNum}`);
    console.log(`Current Date:\n${currentDate.getMonth()}-${currentDate.getDate()}`);
    console.log(`Last Sold Date:\n${recentSoldDate.getMonth()}-${recentSoldDate.getDate()}`);
    console.log(`Vote Expire Date:\n${expireDate.getMonth()}-${expireDate.getDate()}`);
    console.log(`Viewer:\n${URL_viewer}`);
    Object.keys(ownerList).forEach(key => {
        if (![artistADDR, 'KT1Dn3sambs7KZGW88hH2obZeSzfmCmGvpFo'].includes(key)) {
            console.log(key + ' --> ' + ownerList[key])
        }
    })
}

function initialize_field() {
    main_size = (windowWidth > windowHeight) ? windowHeight * .98 : windowWidth * .98;
    blendMode(BLEND);
    background(BG_COLOR);

    main_canvas = createCanvas(main_size, main_size);
    main_canvas.parent('main');

    show_status();
    initialized = true;
}

function setup() {
    frameRate(0.5);
    console.log('Start Running');
}

function draw() {
    if (TEST_OWNER_NUM != -1) ownerNum = TEST_OWNER_NUM;
    if (TEST_CURRENT_DAY != -1) currentDate = TEST_CURRENT_DAY;
    if (TEST_EXPIRE_DAY != -1) expireDate = TEST_EXPIRE_DAY;

    if (![ownerList, recentSoldDate, currentDate, expireDate, ownerNum].includes(-1)) {
        if (!initialized) initialize_field();
        if (can_vote()) ask_vote();
        go_chaos() ? chaos_mode() : normal_mode();
    } else {
        console.log('Not Yet!!');
    }
}