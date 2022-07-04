/* Import Functions */

import { userHisory } from './userHistory.js';
import {getFileStrm} from '../strmSupport/fileStrm.js';

/* Import Variables  */

import { apiKey, agentName } from './account.js';
import { ownFiles, replacesUptobox } from '../uptoboxSupport/info.js';
import { serveurStrm } from '../strmSupport/info.js';
import { ownTheFile } from '../uptoboxSupport/ownTheFile.js';

/* Export Function */

export function allDebridDownload(linkDecodes, nbLinksParMagnet, magnetLink) {

        let nbLinksAllMagnet;
        let nbLinksDebrider;
        nbLinksAllMagnet = nbLinksAllMagnet + nbLinksParMagnet;

        if (apiKey == undefined) {
            return badAuth();
        }

        if (typeof linkDecodes == 'string') {
            let valeur = linkDecodes;
            linkDecodes = [];
            linkDecodes.push(valeur)
        }
        let interval = 800; // Link resolve 200ms moyenne
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
                            if (data.status == "success") {
                                nbLinksDebrider = nbLinksDebrider + 1;
                                let linkDownload;
                                let nomFichier = data.data.filename;
                                let sizeFichier = data.data.filesize / (1024 * 1024 * 1024);
                                let hostDownload = data.data.host;
                                if (replacesUptobox) {
                                    linkDownload = linkDecode
                                } else {
                                    linkDownload = data.data.link;
                                }

                                if (linkDownload.match(/.*.rar.*/g) == null && linkDownload.match(/.*part[0-9].*/g) == null && linkDownload.match(/.*nfo.*/g) == null && linkDownload.match(/.*zip.*/g) == null && linkDownload.match(/.*dmg.*/g && linkDownload.match(/.*exe.*/g) == null) == null) {
                                    let allLinks = document.getElementById('resultatArea');

                                    allLinks.insertAdjacentHTML("beforeend",
                                        `Hebergeur : ` + hostDownload + `
        
----------------------------------------------------
        
Nom du Fichier : ` + nomFichier + `
        
----------------------------------------------------
        
Taille du Fichier : ` + sizeFichier.toFixed(1) + `Gb
        
----------------------------------------------------
        
Lien pour Télécharger : ` + linkDownload + ` 
        
----------------------------------------------------    
 `)
                                    if(magnetLink) {
                                        allLinks.insertAdjacentHTML("beforeend",
                                        `
Lien Magnet : ` + magnetLink + `
----------------------------------------------------

 `)
                                    }

                                    if (serveurStrm !== undefined && serveurStrm !== null && serveurStrm !== '' && serveurStrm.match(/^https:\/\//g) || ownFiles) {
                                        if (replacesUptobox && linkDownload.match(/^uptobox/g)) {
                                            let dataPush = [];
                                            dataPush.push({
                                                linkDownload: linkDownload,
                                                nameFile: nomFichier,
                                                sizeFile: sizeFichier,
                                                linkUptobox: linkDownload,
                                                host: hostDownload
                                            });
                                            return getFileStrm(dataPush);
                                        } else {
                                            let dataDecode = []
                                            dataDecode.push({
                                                linkDownload: linkDownload,
                                                nameFile: nomFichier,
                                                sizeFile: sizeFichier,
                                                host: hostDownload
                                            });
                                            return userHisory(dataDecode);
                                        }
                                    }
                                }  else {
                                    console.log("BartBot LOG -> Fichier pas envoyé : " + linkDownload);
                                    console.log(" ")
                                }
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
            if(nbLinksAllMagnet == nbLinksDebrider) {
                let addDone = document.getElementById('twobutton');
                addDone.insertAdjacentHTML("afterend", "<br> feafeaTous les liens possibles ont été récupérer.")
                console.log('Tous les liens possibles ont été récupérer.');
            }
            console.log("BartBot -> Link(s) has been unbridled :)")
        });
}

function badAuth() {
    let statusON = document.getElementById('status');
    statusON.textContent = "Sorry but your AuthKey is not valid !";
    setTimeout(function () {
        statusON.textContent = '';
    }, 5000);
}