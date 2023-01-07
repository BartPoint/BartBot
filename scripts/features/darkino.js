/* Import  Function */

import { allDebridDownload } from '../allDebrid/download.js';
import { allDebridRedirect } from '../allDebrid/redirect.js';
import { allCopy } from '../utils/copyData.js';
import { clear, error, log, warning } from '../consoleLog/global.js';

/* Function */

document.getElementById("launch").addEventListener('click', Darkino);

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

const channel = new BroadcastChannel('VARIABLE_CHANNEL2');

function Darkino() {
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
        if (linkActual.match(/^(.*).darkino(.*)\/[0-9][0-9][0-9]/g)) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['./scripts/utils/changeDarkino.js'],
            });

            chrome.scripting.executeScript({
                target: { tabId:  tab.id },
                files: ['./scripts/utils/getPagesSource.js'],
            },  function () {
                if (chrome.runtime.lastError) {
                    error('Error : ' + chrome.runtime.lastError.message);
                    console.log('Error : ' + chrome.runtime.lastError.message);
                    return;
                }
            });

            chrome.runtime.onMessage.addListener(function (request) {
                if (request.action == "getSource") {
                    let data = request.source;

                    if (data.match(/streaming/g)) {
                        const myRegex = /href="\/streaming-([^\)\/{,}]+)" target/gm;
                        const matches = data.matchAll(myRegex);
                        let allLinks = [];

                        let linkDL;

                        for (const match of matches) {
                            linkDL = match[1];
                            allLinks.push(linkDL)
                        }

                        return allLinksGetUptostream(allLinks);
                    } else {
                        const myRegex = /href="\/link-([^\)\/{,}]+)" target/gm;
                        const matches = data.matchAll(myRegex);
                        let allLinks = [];

                        let linkDL;

                        log('Darkino: ' + linkActual);
                        for (const match of matches) {
                            linkDL = match[1];
                            allLinks.push(linkDL)
                        }

                        return allLinksGetDownloadLink(allLinks);
                    }
                } 
            })
        } else {
            let statusON = document.getElementById('status');
            statusON.textContent = "Vous n'êtes pas sur une page compatible Darkino";
            setTimeout(function () {
                statusON.textContent = '';
            }, 5000);
            log('Vous n\'êtes pas sur une page compatible Darkino');
            console.log("Vous n'êtes pas sur une page compatible Darkino");
        }
    })
}

function allLinksGetUptostream(allLinks) {
    let url = "https://www3.darkino.com/streaming-";
    let allLinksFixeDone = [];
    let interval = 1000; // Link redirect must do 400ms but up to 900ms with Darkino:(
    var loop = function () {
        return new Promise(function (outerResolve) {
            var promise = Promise.resolve();
            var i = 0;
            var next = function () {
                let link = url + allLinks[i];
                console.log(link)
                fetch(link).then(function (reponse) {
                    reponse.text().then(function (dataResponse) {

                        const regexMatch = /(https:\/\/uptostream.com\/iframe\/.*") scr/gm;

                        const matches2 = dataResponse.matchAll(regexMatch);

                        for (const match of matches2) {
                            let linkDL = match[1];
                            allLinksFixeDone.push(linkDL)
                        }

                    })
                })
                if (++i < allLinks.length) {
                    promise = promise.then(function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve();
                                next();
                            }, interval);
                        });
                    });
                } else {
                    setTimeout(outerResolve, interval);
                }
            };
            next();
        });
    };
    loop().then(function () {
        let addDone = document.getElementById('resultatArea');
        addDone.insertAdjacentHTML("afterend", "<br> Tous les liens seront récupérés dans quelques instants.")
        return allDebridRedirect(allLinksFixeDone)
    });
}


function allLinksGetDownloadLink(allLinks) {
    let url = "https://www3.darkino.com/link-";
    let allLinksFixeDone = [];
    let interval = 1000; // Link redirect must do 400ms but up to 900ms with Darkino:(
    var loop = function () {
        return new Promise(function (outerResolve) {
            var promise = Promise.resolve();
            var i = 0;
            var next = function () {
                let link = url + allLinks[i];
                fetch(link).then(function (reponse) {
                    reponse.text().then(function (dataResponse) {

                        console.log(dataResponse)
                        const regexMatch = /alldebrid.unlock\("(.*)"\);/gm;

                        const matches2 = dataResponse.matchAll(regexMatch);

                        for (const match of matches2) {
                            let linkDL = match[1];
                            allLinksFixeDone.push(linkDL)
                        }

                    })
                })
                if (++i < allLinks.length) {
                    promise = promise.then(function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve();
                                next();
                            }, interval);
                        });
                    });
                } else {
                    setTimeout(outerResolve, interval);
                }
            };
            next();
        });
    };
    loop().then(function () {
        let addDone = document.getElementById('resultatArea');
        addDone.insertAdjacentHTML("afterend", "<br> Tous les liens seront récupérés dans quelques instants.")
        return allDebridRedirect(allLinksFixeDone)
    });
}

allCopy();