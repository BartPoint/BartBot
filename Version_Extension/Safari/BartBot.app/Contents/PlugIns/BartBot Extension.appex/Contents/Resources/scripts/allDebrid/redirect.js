/* Import  Function */

import {allDebridDownload} from './download.js';

/* Import Variable */

import {apiKey, agentName} from './account.js';

/* Export  Function */
export function allDebridRedirect(allLinks) {
    chrome.storage.sync.get(['apiKey'], function (result) {
        if (result.apiKey == undefined) {
            return badAuth();
        }
        if (typeof allLinks == 'string') {
            let valeur = allLinks;
            allLinks = [];
            allLinks.push(valeur)
        }
        console.log("BartBot -> Just to say that we are at the Next Step be patient :)")
        let interval = 2000; // Link redirect must do 50ms but up to 4s with tirexo:(
        var loop = function () {
            return new Promise(function (outerResolve) {
                var promise = Promise.resolve();
                var i = 0;
                var next = function () {
                    let link = allLinks[i];
                    fetch('https://api.alldebrid.com/v4/link/redirector?agent=' + agentName + '&apikey=' + apiKey + '&link=' + link).then(function (response) {
                        if (response.status !== 200) {
                            console.log('Error status Code : ' + response.status);
                            return;
                        }
                        response.text().then(function (data) {
                            data = JSON.parse(data)
                            if (data.status == "success") {
                                let linksDecode = data.data.links;
                                let dataDecode = []
                                for (const linkDecode of linksDecode) {
                                    dataDecode.push(linkDecode)
                                }
                                return allDebridDownload(dataDecode)
                            } else {
                                let dataResponse = data.error.code;
                                console.log("Pas vraiment un fixe mais un bidouillage a été fais ici : ", data.error.code)
                                console.log("Info Debug :  Lien : " + link + " Reponse API : " + data.data + data.error)
                                if(dataResponse == "REDIRECTOR_NOT_SUPPORTED") return allDebridDownload(allLinks) /// Temporaire
                            }
                        })
                    }).catch(function (error) {
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
            addDone.insertAdjacentHTML("afterend", "<br> Tous les liens possibles ont été récupérer.")
            console.log('Tous les liens possibles ont été récupérer.');
        });
    })
}

function badAuth() {
    let statusON = document.getElementById('status');
    statusON.textContent = "Sorry but your AuthKey is not valid !";
    setTimeout(function () {
        statusON.textContent = '';
    }, 5000);
}