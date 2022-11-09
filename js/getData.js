// const contractADDR = 'KT1AFq5XorPduoYyWxs5gEyrFK6fVjJVbtCj';
const uniqueTAG = 'TBC001';
const artistADDR = 'tz1Z8Xwm2qWnWWtL3MJ7T3A9uLmaQJiy8Uct';
// const uniqueTAG = 'dvu006';
// const artistADDR = 'tz1feSswgqJc1YiCdvqaBRZyqcuW8E3Kz6Re';
// const artistADDR = 'tz1WrGHRsuicLignpT5JfjPpRJtputim78am';

let ownerList = -1;
let ownerAmount = -1;
let tokenAmount = -1;

let recentSoldDate = -1;
let currentDate = -1;
let expireDate = -1;

const current_URL = window.location.href;
console.log(`Current URL: ${current_URL}`);

const search = new URLSearchParams(window.location.search);

const URL_viewer = search.get('viewer') ?? 'guest';


$(window).on('load', () => {
    console.log('|-------------------------------|');
    console.log("Start Fetching Data");
    GetDataSequence();
    console.log("Fetching Data End");
    console.log('|-------------------------------|');
})

async function GetDataSequence() {
    await GetTokenDataByTag();
    console.log("All Data is Ready");
    await sleep(3000);
}

async function GetTokenDataByTag() {
    let apiUrl = `https://api.akaswap.com/v2/accounts/${artistADDR}/creations?tag=${uniqueTAG}`;
    let response = await fetch(apiUrl);
    let dataJson = await response.json();
    let objktJson = await dataJson.tokens[0];

    ownerList = await objktJson.owners;
    recentSoldDate = await objktJson.recentlySoldTime ?? '9999-08-18';
    recentSoldDate = await recentSoldDate.split('T')[0];
    tokenAmount = await objktJson.amount;

    Object.keys(ownerList).forEach(key => {
        if (![artistADDR, 'KT1Dn3sambs7KZGW88hH2obZeSzfmCmGvpFo'].includes(key)) {
            ownerAmount += ownerList[key];
        }
    })
    ownerAmount++;

    recentSoldDate = new Date(recentSoldDate);
    currentDate = new Date();
    expireDate = new Date(recentSoldDate);
    expireDate.setDate(expireDate.getDate() + 7);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
