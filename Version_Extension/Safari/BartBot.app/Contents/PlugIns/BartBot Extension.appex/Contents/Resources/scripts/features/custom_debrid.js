/* Import  Function */

import { allDebridRedirect } from '../allDebrid/redirect.js';
import { allCopy } from '../utils/copyData.js';

/* Function */

document.getElementById("launch").addEventListener('click', customDebrid);

const channel = new BroadcastChannel('VARIABLE_CHANNEL');
channel.postMessage({ msg: 'ON SE REVEILLE !'});

channel.onmessage = (msg) => {
 let linkToDebrid = msg.data.msg
 if(linkToDebrid !== null && linkToDebrid !== undefined && linkToDebrid !== '') {
    customDebrid(linkToDebrid);
 }
}

function customDebrid(linkToDebrid) {
    let linkActual;
    let statusON = document.getElementById('status');
    statusON.textContent = "BartBot execute votre demande !";
    setTimeout(function () {
        statusON.textContent = '';
    }, 7000);
    if (linkToDebrid !== null && linkToDebrid !== undefined && linkToDebrid !== '') {
        linkActual = linkToDebrid;
    } else {
        linkActual = document.getElementById('customDebrid').value;
    }
    allDebridRedirect(linkActual);
}

allCopy();