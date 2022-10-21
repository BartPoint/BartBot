/* Import  Function */

import { allDebridStatusTorrent } from './statusTorrent.js';
import { clear, error, log, warning } from '../consoleLog/global.js';

/* Import Variable */

import {apiKey, agentName} from './account.js';

/* Export  Function */
export function allDebridUploadMagnet(allLinks) {
        if (apiKey == undefined) {
            return badAuth();
        }

        if (typeof allLinks == 'string') {
            let valeur = allLinks;
            allLinks = [];
            allLinks.push(valeur)
        }
        let interval = 2000; // Link redirect must do 50ms but up to 4s with tirexo:(
        var loop = function () {
            return new Promise(function (outerResolve) {
                var promise = Promise.resolve();
                var i = 0;
                var next = function () {
                    let link = allLinks[i];
                    fetch('https://api.alldebrid.com/v4/magnet/upload?agent=' + agentName + '&apikey=' + apiKey + '&magnets[]=' + link).then(function (response) {
                        if (response.status !== 200) {
                            console.log('Error status Code : ' + response.status);
                            return;
                        }
                        response.text().then(function (data) {
                            data = JSON.parse(data)
                            if (data.status == "success") {
                                // console.log(data.data.magnets[0])
                                return allDebridStatusTorrent(data.data.magnets[0].id, data.data.magnets[0].magnet)
                            } else {
                                let dataResponse = data.error.code;
                                log("Info Debug :  Lien : " + link + " Reponse API : " + data.data + data.error)
                                console.log("Info Debug :  Lien : " + link + " Reponse API : " + data.data + data.error)
                            }
                        })
                    }).catch(function (error) {
                        error(JSON.stringify(error));
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
            log("BartBot -> Link(s) has been upload to unmagneted :)")
            console.log("BartBot -> Link(s) has been upload to unmagneted :)")
        });
}

function badAuth() {
    let statusON = document.getElementById('status');
    statusON.textContent = "Désoler mais vous n'êtes pas connecter !";
    setTimeout(function () {
        statusON.textContent = '';
    }, 5000);
}

function badLink() {
    let statusON = document.getElementById('status');
    statusON.textContent = "Désoler mais il semblerait que le liens est manquant ou invalide !";
    setTimeout(function () {
        statusON.textContent = '';
    }, 5000);
}