/* Import  Function */

import { allDebridRedirect } from '../allDebrid/redirect.js';
import { allCopy } from '../utils/copyData.js';
import { clear, error, log, warning } from '../consoleLog/global.js';

/* Function */

document.getElementById("launch").addEventListener('click', extremeDown);

document.getElementById('addLog').addEventListener('click', function () {
    let identify = document.getElementById('codeDiv');
    let identity2 = document.getElementById('allLinks');
    if(identify.style.display == 'block') {
        identify.style.display = 'none';
        identity2.style.display = 'flex';
    } else {
        identity2.style.display = 'none';
        identify.style.display = 'block';
    }
});


function extremeDown() {

    chrome.tabs.query({  
        active: true,
        currentWindow: true  
    }).then((tab) => {
        tab = tab[0]
        let statusON = document.getElementById('status');
        statusON.textContent = "BartBot execute votre demande !";
        setTimeout(function () {
            statusON.textContent = '';
        }, 2500);
        let linkActual = tab.url;
        if (linkActual.match(/^(.*).extreme-down(.*)\/[0-9]/g)) {
            chrome.scripting.executeScript({
                target: { tabId:  tab.id },
                files: ['./scripts/utils/getPagesSource.js'],
            }, function () {
                if (chrome.runtime.lastError) {
                    console.log('Error : ' + chrome.runtime.lastError.message);
                    error('Error : ' + chrome.runtime.lastError.message);
                    return;
                }
            })
            chrome.runtime.onMessage.addListener(function (request) {
                if (request.action == "getSource") {
                    let data = request.source;
                    const myRegex = /<a title="(.*)" href="(.*)" target="_blank".*class="hebergeur">Uptobox Premiium|<a title="(.*)" href="(.*)" target="_blank".*class="hebergeur">Uptobox/g
                    const matches = data.matchAll(myRegex);
                    let allLinks = [];
                    // console.log(data)
                    for (const match of matches) {
                        /// let titleEpisode = match[1] titre de l'épisode (nom de la release)
                        let linkDL = match[2] || match[4];
                        allLinks.push(linkDL)
                    }
                    return allDebridRedirect(allLinks);
                }
        });
        } else {
            let statusON = document.getElementById('status');
            statusON.textContent = "Vous n'êtes pas sur une page compatible Extreme-Down";
            setTimeout(function () {
                statusON.textContent = '';
            }, 5000);
            log("Vous n'êtes pas sur une page compatible Extreme-Down");
            console.log("Vous n'êtes pas sur une page compatible Extreme-Down");
        }
    })
}

allCopy();