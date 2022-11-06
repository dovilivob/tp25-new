const contractADDR = 'KT1AFq5XorPduoYyWxs5gEyrFK6fVjJVbtCj';
const uniqueTAG = 'TBC25001';
const artistADDR = 'tz1Z8Xwm2qWnWWtL3MJ7T3A9uLmaQJiy8Uct';
// const uniqueTAG = 'dvu006';
// const artistADDR = 'tz1feSswgqJc1YiCdvqaBRZyqcuW8E3Kz6Re';

let OBJKT_ID = 0;
let ownerList = 0;
let votedList = 0;
let ownerNum = 0

const current_URL = window.location.href;
console.log(current_URL);

const search = new URLSearchParams(window.location.search);

const URL_viewer = search.get('viewer');
const URL_objktId = search.get('objkt');
if (URL_viewer != null) console.log(`Got viewer ADDR by url ${URL_viewer}`);
else console.log("Can't get viewer ID by url")

GetDataSequence();

async function GetDataSequence() {
    if (URL_objktId != null) {
        OBJKT_ID = URL_objktId;
        console.log(`Got Token ID by url: ${URL_objktId}`)
    } else {
        await GetTokenDataByTag();
        await GetVotedList();
        console.log("Got Token ID by Tag: " + OBJKT_ID);
    }
    console.log("All Data is Ready");
}

async function GetVotedList() {
    let response = await fetch('https://tp25.2enter.art/assets/data.json')
    let dataJson = await response.json();
    votedList = dataJson.auths;
    console.log(`Voted Owner List: ${votedList}`);
}


async function GetTokenDataByTag() {
    let apiUrl = `https://api.akaswap.com/v2/accounts/${artistADDR}/creations?tag=${uniqueTAG}`;
    let response = await fetch(apiUrl);
    let dataJson = await response.json();
    let objktJson = dataJson.tokens[0];
    // console.log(objktJson)
    OBJKT_ID = await objktJson.tokenId;
    ownerList = await objktJson.owners;
    Object.keys(ownerList).forEach(key => {
        if (![artistADDR, 'KT1Dn3sambs7KZGW88hH2obZeSzfmCmGvpFo'].includes(key)) {
            ownerNum += ownerList[key];
        }
    })
    console.log(`Owner List: ${ownerList}`);
    console.log(`Owner Number: ${ownerNum}`);
}
