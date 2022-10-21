/* Import  Function */

import { allDebridDownload  } from '../allDebrid/download.js';
import { allCopy } from '../utils/copyData.js';
import { clear, error, log, warning } from '../consoleLog/global.js';

/* Function */

document.getElementById("launch").addEventListener('click', monstream_co);

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

function monstream_co() {
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
        if(linkActual.match(/.*monstream\.co\/.*saison/g)) {
            chrome.scripting.executeScript({
                target: { tabId:  tab.id },
                files: ['./scripts/utils/getPagesSource.js'],
            }, function () {
                if (chrome.runtime.lastError) {
                    error("Error : " + chrome.runtime.lastError.message);
                    console.log('Error : ' + chrome.runtime.lastError.message);
                    return;
                }
            })
            chrome.runtime.onMessage.addListener(function (request) {
                if (request.action == "getSource") {
                    let data = request.source;
                    const myRegex = /<a href="(https:\/\/www\.monstream\.co\/series\/voir.*)">/g;
                    const matches = data.matchAll(myRegex);
                    let allLinks = [];
                    for (const match of matches) {
                        let episode = match[1];
                        allLinks.push(episode)
                    }
                    return allLinksGetEpisode(allLinks);
                }
            });
        } else {
            let statusON = document.getElementById('status');
            statusON.textContent = "Vous n'êtes pas sur une page compatible MonStream.co";
            setTimeout(function () {
                statusON.textContent = '';
            }, 5000);
            log("Vous n'êtes pas sur une page compatible MonStream.co");
            console.log("Vous n'êtes pas sur une page compatible MonStream.co");
        }
    })
}

function allLinksGetEpisode(allLinks) {
    let allLinkstoRedirect = [];
    if (typeof allLinks == 'string') {
        let valeur = allLinks;
        allLinks = [];
        allLinks.push(valeur)
    }
    let interval = 1000; // Link resolve 200ms moyenne
    var loop = function () {
        return new Promise(function (outerResolve) {
            var promise = Promise.resolve();
            var i = 0;
            var next = function () {
                let link = allLinks[i];
                fetch('https://api.codetabs.com/v1/proxy?quest=' + link).then(function (response) {
                    if (response.status !== 200) {
                        error('Error status Code : ' + response.status);
                        console.log('Error status Code : ' + response.status);
                        return;
                    }
                    response.text().then(function (data) {
                        const myRegex = /<div class="lien fx-row down" data-url="(https:\/\/uptobox.*)"/gm;
                        const matches = data.matchAll(myRegex);
                        for (const match of matches) {
                            let linkDL = match[1];
                            allLinkstoRedirect.push(linkDL)
                            log(JSON.stringify(linkDL));
                            console.log(linkDL)
                            /// let episodeSize = match[2]; taille des épisode capturé 
                            /// let dateUpload = match[3]; date d'upload du fichier capturé 
                        }
                    })
                }).catch(function (error) {
                    error(JSON.stringify(error))
                    console.log(error);
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
        return allDebridDownload(allLinkstoRedirect);
    });
}

allCopy();