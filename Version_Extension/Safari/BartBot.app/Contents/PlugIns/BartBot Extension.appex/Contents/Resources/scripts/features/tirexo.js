/* Import  Function */

import { allDebridDownload } from '../allDebrid/download.js';
import { allDebridRedirect } from '../allDebrid/redirect.js';
import { allCopy } from '../utils/copyData.js';

/* Function */

document.getElementById("launch").addEventListener('click', Tirexo);

function Tirexo() {
    chrome.tabs.query({ active: true }).then((tab) => {
        tab = tab[0]
        let statusON = document.getElementById('status');
        statusON.textContent = "BartBot execute votre demande !";
        setTimeout(function () {
            statusON.textContent = '';
        }, 2500);
        let linkActual = tab.url;
        if (linkActual.match(/^(.*).tirexo(.*)\/[0-9][0-9][0-9]/g)) {
            chrome.scripting.executeScript({
                target: { tabId:  tab.id },
                files: ['./scripts/utils/getPagesSource.js'],
            },  function () {
                if (chrome.runtime.lastError) {
                    console.log('Error : ' + chrome.runtime.lastError.message);
                    return;
                }
            })
            chrome.runtime.onMessage.addListener(function (request) {
                if (request.action == "getSource") {
                    let data = request.source;
                    console.log(data)
                    if (data.match(/streaming-/gm)) {
                        const myRegex = /href="\/streaming-(.*)"><span/g;
                        const matches = data.matchAll(myRegex);
                        let allLinks = [];
                        for (const match of matches) {
                            console.log(match)
                            let linkDL = match[1];
                            allLinks.push(linkDL)
                        }
                        return allLinksGetUptostream(allLinks);
                    } else {
                        let url = "https://www2.tirexo.art/link-";
                        const myRegex = /href="\/link-(.*)"><sp/g;
                        const matches = data.matchAll(myRegex);
                        let allLinks = [];
                        for (const match of matches) {
                            console.log(match[1])
                            let linkDL = url + match[1] + '.html';
                            allLinks.push(linkDL)
                        }
                        return allDebridRedirect(allLinks);
                    }
                }
            })
        } else {
            let statusON = document.getElementById('status');
            statusON.textContent = "Vous n'??tes pas sur une page compatible Tirexo";
            setTimeout(function () {
                statusON.textContent = '';
            }, 5000);
            console.log("Vous n'??tes pas sur une page compatible Tirexo");
        }
    })
}

function allLinksGetUptostream(allLinks) {
    let url = "https://www2.tirexo.art/streaming-";
    console.log(allLinks.length);
    let allLinksFixeDone = [];
    let interval = 1000; // Link redirect must do 400ms but up to 900ms with tirexo:(
    var loop = function () {
        return new Promise(function (outerResolve) {
            var promise = Promise.resolve();
            var i = 0;
            var next = function () {
                let link = url + allLinks[i];
                fetch(link).then(function (reponse) {
                    reponse.text().then(function (dataResponse) {
                        const regexMatch = /<iframe class='zw_frame' width=".*" height=".*" src="(.*)" scrolling/g
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
        addDone.insertAdjacentHTML("afterend", "<br> Tous les liens seront r??cup??r??s dans quelques instants.")
        return allDebridDownload(allLinksFixeDone)
    });
}

allCopy();