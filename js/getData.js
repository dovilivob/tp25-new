const contractADDR = 'KT1AFq5XorPduoYyWxs5gEyrFK6fVjJVbtCj';
const uniqueTAG = 'TBC25001';
const artistADDR = 'tz1Z8Xwm2qWnWWtL3MJ7T3A9uLmaQJiy8Uct';
// const uniqueTAG = 'dvu006';
// const artistADDR = 'tz1feSswgqJc1YiCdvqaBRZyqcuW8E3Kz6Re';

let OBJKT_ID = 0;
let ownerList = 0;
let votedList = 0;
let ownerNum = 0;

let recentSoldDate = 0;
let currentDate = 0;
let expireDate = 0;

const current_URL = window.location.href;
console.log(current_URL);

const search = new URLSearchParams(window.location.search);

const URL_viewer = search.get('viewer');
const URL_objktId = search.get('objkt');

if (URL_viewer != null) console.log(`Got viewer ADDR by url ${URL_viewer}`);
if (URL_objktId != null) console.log(`Got objkt ID by url ${URL_objktId}`);
else console.log("Can't get viewer ID by url");

GetDataSequence();

async function GetDataSequence() {
    // if (URL_objktId != null) {
    //     OBJKT_ID = URL_objktId;
    //     console.log(`Got Token ID by url: ${URL_objktId}`);
    // } else {
    //     console.log("Got Token ID by Tag: " + OBJKT_ID);
    // }
    await GetTokenDataByTag();
    // await GetVotedList();
    console.log("All Data is Ready");
    await sleep(3000);
}

// async function GetVotedList() {
//     let response = await fetch('https://tp25.2enter.art/assets/data.json');
//     let dataJson = await response.json();
//     votedList = dataJson.auths;
//     console.log(`Voted Owner List: ${votedList}`);
// }


async function GetTokenDataByTag() {
    let apiUrl = `https://api.akaswap.com/v2/accounts/${artistADDR}/creations?tag=${uniqueTAG}`;
    let response = await fetch(apiUrl);
    let dataJson = await response.json();
    let objktJson = dataJson.tokens[0];
    // console.log(objktJson);
    OBJKT_ID = await objktJson.tokenId;
    ownerList = await objktJson.owners;
    recentSoldDate = await objktJson.recentlySoldTime.split('T')[0];

    recentSoldDate = new Date(recentSoldDate);
    currentDate = new Date();
    expireDate = new Date(recentSoldDate);
    expireDate.setDate(expireDate.getDate() + 7);

    console.log(`Current Date:\n${currentDate.getMonth()}-${currentDate.getDate()}`);
    console.log(`Last Sold Date:\n${recentSoldDate.getMonth()}-${recentSoldDate.getDate()}`);
    console.log(`Vote Expire Date:\n${expireDate.getMonth()}-${expireDate.getDate()}`);

    Object.keys(ownerList).forEach(key => {
        if (![artistADDR, 'KT1Dn3sambs7KZGW88hH2obZeSzfmCmGvpFo'].includes(key)) {
            ownerNum += ownerList[key];
        }
    })
    console.log(`Owner List: ${ownerList}`);
    console.log(`Owner Number: ${ownerNum}`);
    console.log(`Recently Sold Time: ${recentSoldDate}`);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
