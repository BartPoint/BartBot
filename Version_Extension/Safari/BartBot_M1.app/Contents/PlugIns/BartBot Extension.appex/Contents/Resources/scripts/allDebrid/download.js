/* Import Variables  */

import { apiKey, agentName } from './account.js';

/* Export Function */

export function allDebridDownload(linkDecodes) {
    chrome.storage.sync.get(['apiKey'], function (result) {
        if (result.apiKey == undefined) {
            return badAuth();
        }
        if (typeof linkDecodes == 'string') {
            let valeur = linkDecodes;
            linkDecodes = [];
            linkDecodes.push(valeur)
        }
        let interval = 500; // Link resolve 200ms moyenne
        var loop = function () {
            return new Promise(function (outerResolve) {
                var promise = Promise.resolve();
                var i = 0;
                var next = function () {
                    let linkDecode = linkDecodes[i];
                    fetch('https://api.alldebrid.com/v4/link/unlock?agent=' + agentName + '&apikey=' + apiKey + '&link=' + linkDecode).then(function (response) {
                        if (response.status !== 200) {
                            console.log('Error status Code : ' + response.status);
                            return;
                        }
                        response.text().then(function (data) {
                            data = JSON.parse(data)
                            console.log(data.status)
                            console.log("salut" + data.data)
                            if (data.status == "success") {
                                let linkDownload = data.data.link;
                                let hostDownload = data.data.host;
                                let nomFichier = data.data.filename;
                                let sizeFichier = data.data.filesize / (1024 * 1024 * 1024);
                                let allLinks = document.getElementById('resultatArea');

                                allLinks.insertAdjacentHTML("beforeend",
                                    `Hebergeur : ` + hostDownload + `
        
            ---------------------------------------------------------------------------------
        
            Nom du Fichier : ` + nomFichier + `
        
            ---------------------------------------------------------------------------------
        
            Taille du Fichier : ` + sizeFichier.toFixed(1) + `Gb
        
            ---------------------------------------------------------------------------------
        
            Lien pour Télécharger : ` + linkDownload + `
        
            ---------------------------------------------------------------------------------
        
            `)
                            } else {
                                console.log("Error link maybe die : " + data.data);
                            }
                        })
                    }).catch(function (error) {
                        console.log(error);
                    })

                    if (++i < linkDecodes.length) {
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
            console.log("BartBot -> Link(s) has been unbridled :)")
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