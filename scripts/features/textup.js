/* Import  Function */

import { ownTheFile } from '../uptoboxSupport/ownTheFile.js';
import { allCopy } from '../utils/copyData.js';
import { allDebridDownload } from '../allDebrid/download.js';

/* Function */

document.getElementById("launch").addEventListener('click', textUP);

function textUP() {
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
        if (linkActual.match(/^(.*).textup(.*)/g)) {
            chrome.scripting.executeScript({
                target: { tabId:  tab.id },
                files: ['./scripts/utils/getPagesSource.js'],
            }, function () {
                if (chrome.runtime.lastError) {
                    console.log('Error : ' + chrome.runtime.lastError.message);
                    return;
                }
            })
            chrome.runtime.onMessage.addListener(function (request) {
                if (request.action == "getSource") {
                    let data = request.source;
                    const myRegex = /:\/\/([u].....[x].com\/[^\)\/{,}]+)">/g;
                    const matches = data.matchAll(myRegex);
                    let allLinks = [];
                    for (const match of matches) {
                        let linkDL = match[1] 
                        if(linkDL == undefined) {
                            linkDL = match[2]
                            if(linkDL == undefined) {
                                linkDL = match[3]
                            }
                        }
                        allLinks.push(linkDL)
                    }
                    return allDebridDownload(allLinks);
                }
        });
        } else {
            let statusON = document.getElementById('status');
            statusON.textContent = "Vous n'êtes pas sur une page compatible TextUP";
            setTimeout(function () {
                statusON.textContent = '';
            }, 5000);
            console.log("Vous n'êtes pas sur une page compatible TextUP");
        }
    })
}

allCopy();