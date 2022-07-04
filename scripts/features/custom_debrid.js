/* Import  Function */

import { allDebridRedirect } from '../allDebrid/redirect.js';
import { allCopy } from '../utils/copyData.js';

/* Function */

document.getElementById("launch").addEventListener('click', customDebrid);

const channel = new BroadcastChannel('VARIABLE_CHANNEL');
channel.postMessage({ msg: 'ON SE REVEILLE !'});

channel.onmessage = (msg) => {
    let linkToDebrid = msg.data.msg;

    chrome.storage.sync.get(['oldLinkToDebrid'], function (result) {
        if(linkToDebrid == result.oldLinkToDebrid) {
            console.log("Lien déjà débrider donc ignore !!")
        } else {
            if(linkToDebrid !== null && linkToDebrid !== undefined && linkToDebrid !== '') {
                customDebridNotif(linkToDebrid);
            }
        }
    });

    chrome.storage.sync.set({
        oldLinkToDebrid: linkToDebrid
    })
}
function customDebridNotif(linkToDebrid) {
    let linkActual;
    let statusON = document.getElementById('status');
    statusON.textContent = "BartBot execute votre demande !";
    setTimeout(function () {
        statusON.textContent = '';
    }, 7000);
    if (linkToDebrid !== null && linkToDebrid !== undefined && linkToDebrid !== '') {
        linkActual = linkToDebrid;
        allDebridRedirect(linkActual);
    }
}

function customDebrid() {
    let linkActual;
    let statusON = document.getElementById('status');
    statusON.textContent = "BartBot execute votre demande !";
    setTimeout(function () {
        statusON.textContent = '';
    }, 7000);
    linkActual = document.getElementById('customDebrid').value;

    if (linkActual.match(/^(((https?)|(ftp)):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\//g)) {
        allDebridRedirect(linkActual);
    } else {
        let statusON = document.getElementById('status');
        statusON.textContent = "Vous n'avez pas entré un lien valide";
        setTimeout(function () {
            statusON.textContent = '';
        }, 5000);
    }
}


allCopy();