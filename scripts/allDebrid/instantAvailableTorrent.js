/* Import  Function */

import { allDebridUploadMagnet } from './uploadMagnet.js';

/* Import Variable */

import {apiKey, agentName} from './account.js';

/* Export  Function */
export function allDebridInstantAvailableTorrent(allLinks) {
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
                    fetch('https://api.alldebrid.com/v4/magnet/instant?agent=' + agentName + '&apikey=' + apiKey + '&magnets[]=' + link).then(function (response) {
                        if (response.status !== 200) {
                            console.log('Error status Code : ' + response.status);
                            return;
                        }
                        response.text().then(function (data) {
                            data = JSON.parse(data)
                            if (data.status == "success") {
                                let status = data.data.magnets[0].instant
                                if(status) {
                                    return allDebridUploadMagnet(data.data.magnets[0].magnet)
                                } else {
                                    return allDebridUploadMagnet(data.data.magnets[0].magnet)
                                }
                            } else { 
                                let dataResponse = data.error.code;
                                console.log("Info Debug :  Lien : " + link + " Reponse API : " + data.data + data.error)
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
            console.log("BartBot -> Link(s) has been check if is possible to unmagneted :)")
        });
}

function badAuth() {
    let statusON = document.getElementById('status');
    statusON.textContent = "Désoler mais vous n'êtes pas connecter !";
    setTimeout(function () {
        statusON.textContent = '';
    }, 5000);
}