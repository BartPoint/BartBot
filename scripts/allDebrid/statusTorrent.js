/* Import  Function */

import { allDebridDownload } from './download.js';
import { clear, error, log, warning } from '../consoleLog/global.js';

/* Import Variable */

import {apiKey, agentName} from './account.js';

/* Export  Function */
export function allDebridStatusTorrent(allLinks, magnetLink) {
        if (apiKey == undefined) {
            return badAuth();
        }

        if (typeof allLinks == 'string') {
            let valeur = allLinks;
            allLinks = [];
            allLinks.push(valeur)
        }
        let interval = 2000; // Link redirect must do 50ms but up to 4s with Darkino:(
        var loop = function () {
            return new Promise(function (outerResolve) {
                var promise = Promise.resolve();
                var i = 0;
                var next = function () {
                    let link = allLinks[i];
                    fetch('https://api.alldebrid.com/v4/magnet/status?agent=' + agentName + '&apikey=' + apiKey + '&id=' + link).then(function (response) {
                        if (response.status !== 200) {
                            log('Error status Code : ' + response.status);
                            console.log('Error status Code : ' + response.status);
                            return;
                        }
                        response.text().then(function (data) {
                            data = JSON.parse(data)
                            if (data.status == "success") {
                                if(data.data.magnets[0].status == "Ready") {
                                    let links = data.data.magnets[0].links;
                                    let nbLinksParMagnet = links.length;
                                    let allLinks = [];
                                    for (const linkk of links) {
                                        allLinks.push(linkk.link);
                                    }
                                    return allDebridDownload(allLinks, nbLinksParMagnet, magnetLink);
                                } else {
                                    if (data.data.magnets[0].status == "Downloading" || data.data.magnets[0].status == "In Queue") {
                                        let downloadSpeed = data.data.magnets[0].downloadSpeed;
                                        let idTorrent = data.data.magnets[0].id;
                                        let seeders = data.data.magnets[0].seeders;
                                        let statusON = document.getElementById('status');
                                        statusON.style.color = '#313131';
                                        statusON.textContent = "Le magnet ne sera pas disponible pour l'instant ! Vitesse de téléchargement : " + downloadSpeed + " " + "Seeders : " + seeders;
                                        setTimeout(function () {
                                            statusON.textContent = '';
                                        }, 10000);
                                    } else {
                                        log(JSON.stringify(data.data.magnets[0]));
                                        console.log(data.data.magnets[0])
                                    }
                                }
                            } else {
                                // let dataResponse = data.error.code;
                                log("Info Debug :  Lien : " + link + " Reponse API : " + data.data + data.error)
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
            log("BartBot -> Link(s) has been unmagneted:)")
            console.log("BartBot -> Link(s) has been unmagneted:)")
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