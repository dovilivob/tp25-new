'use strict';

const TEST_OWNER_NUM = -1;
const TEST_TOKEN_NUM = -1;
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

let have_burned = () => {
    return TARGET_NUM - tokenAmount;
}

let go_chaos = () => {
    return currentDate > expireDate && ownerAmount >= TARGET_NUM - have_burned();
}

let can_vote = () => {
    return currentDate <= expireDate && ownerAmount >= TARGET_NUM - have_burned();
}

let rand_int = range => Math.floor(Math.random() * range);

function preload() {
    let img;
    for (let i = 0; i < TOTAL_IMG_NUM; i++) {
        img = loadImage(`./static/imgs/${(i < 10) ? '0' + i.toString() : i}.jpg`);
        imgs.push(img);
    }
    console.log('Preload Done !!!');
}

function ask_vote() {
    let ask_vote_HTML = document.querySelector('.ask-vote');
    let count_down_HTML = document.querySelector('#count-down');
    if (!refused) {
        if (!show_vote) {
            ask_vote_HTML.style.display = 'none';
        } else {
            frameRate(20);
            ask_vote_HTML.style.display = 'block';
            count_down_HTML.innerHTML = `倒數 ${Math.floor((expireDate - currentDate) / (1000 * 3600 * 24))} 天`;
        }
    } else {
        ask_vote_HTML.style.display = 'none';
    }
}

function go_url() {
    window.open(`https://tp25.2enter.art/entry?viewer=${URL_viewer ?? 'guest'}`, '_blank');
    refused = true;
}

function go_back() {
    console.log('Refused!!!')
    show_vote = false;
    refused = true;
}

function normal_mode() {
    frameRate(1.95)
    if (currentImage > ownerAmount * 2 || currentImage == 24) {
        console.log('Image Resetting...')
        blendMode(BLEND);
        background(BG_COLOR);
        show_vote = true;
        currentImage = 0;
    }
    blendMode(DARKEST);
    image(imgs[currentImage], 0, 0, main_size, main_size);
    // image(imgs[currentImage + 1], 0, 0, main_size, main_size);
    currentImage += 1;
}

function chaos_mode() {
    frameRate(5);
    filter(BLUR, 1.5);
    let randNum = (ownerAmount != 0) ? rand_int(ownerAmount * 2 - 1) : 0;

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
    console.log(`Viewer:\t${URL_viewer}`);
    console.log('|-------------------------------|');
    if (go_chaos()) console.log('| STATUS:\t\t\tCHAOS\t\t|');
    else if (can_vote()) console.log('| STATUS:\t\t\tVOTING\t\t|');
    else console.log("| STATUS:\t\t\tNOT YET\t\t|");
    console.log(`| Owner Amount:\t\t${ownerAmount}\t\t\t|`);
    console.log(`| Token Amount:\t\t${tokenAmount}\t\t\t|`);
    console.log(`| Current Date:\t\t${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}\t|`);
    console.log(`| Last Sold Date:\t${recentSoldDate.getFullYear()}-${recentSoldDate.getMonth() + 1}-${recentSoldDate.getDate()}\t|`);
    console.log(`| Vote Expire Date:\t${expireDate.getFullYear()}-${expireDate.getMonth() + 1}-${expireDate.getDate()}\t|`);
    console.log('|-----------------------------------------------|');
    console.log("| Owner List:\t\t\t\t\t\t\t\t\t|");
    Object.keys(ownerList).forEach(key => {
        if (![artistADDR, 'KT1Dn3sambs7KZGW88hH2obZeSzfmCmGvpFo'].includes(key)) {
            console.log(`| ${key}\t-->\t${ownerList[key]}\t|`);
        }
    })
    console.log('|-----------------------------------------------|');
}

function initialize_field() {
    main_size = (windowWidth > windowHeight) ? windowHeight : windowWidth;
    blendMode(BLEND);
    background(BG_COLOR);

    main_canvas = createCanvas(main_size, main_size);
    main_canvas.parent('main');

    show_status();
    initialized = true;
}

function setup() {
    frameRate(0.5);
    console.log('P5 Sketch Start Running');
}

function draw() {
    if (TEST_OWNER_NUM != -1) ownerAmount = TEST_OWNER_NUM;
    if (TEST_TOKEN_NUM != -1) tokenAmount = TEST_TOKEN_NUM;
    if (TEST_CURRENT_DAY != -1) currentDate = TEST_CURRENT_DAY;
    if (TEST_EXPIRE_DAY != -1) expireDate = TEST_EXPIRE_DAY;

    if (![ownerList, recentSoldDate, currentDate, expireDate, ownerAmount].includes(-1)) {
        if (!initialized) initialize_field();
        if (can_vote()) ask_vote();
        go_chaos() ? chaos_mode() : normal_mode();
    } else {
        console.log('Not Yet!!');
    }
}