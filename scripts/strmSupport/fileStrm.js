/* Import Functions */

import { saveStrmFile } from './saveStrm.js';
import { searchByName  } from '../theMovieDatabase/searchByName.js';
import { ownTheFile } from '../uptoboxSupport/ownTheFile.js';

/* Import Variables  */

import { autoSave, serveurStrm, choixStrm } from './info.js';
import { ftpChecked } from '../ftpSupport/info.js';

/* Export Function */

export function getFileStrm(linkDecodes) {
    if (serveurStrm == undefined) {
        console.log("Vous n'avez pas configuré votre serveur Strm");
    }

    if (typeof linkDecodes == 'string') {
        let valeur = linkDecodes;
        linkDecodes = [];
        linkDecodes.push(valeur)
    }

    let interval = 4000; // Link resolve 200ms moyenne
    var loop = function () {
        return new Promise(function (outerResolve) {
            var promise = Promise.resolve();
            var i = 0;
            var next = function () {
                let linkDecode = linkDecodes[i].linkDownload;
                let nameFile = linkDecodes[i].nameFile;
                let host = linkDecodes[i].host;
                let linkToStrm;
                if(serveurStrm !== undefined && serveurStrm !== null && serveurStrm !== '' && serveurStrm.match(/^https:\/\//g)) {
                    if (choixStrm == 1) {
                        /// AllDebrid choix
                        // if(serveurStrm === "https://pasbesoin") {
                        //     linkToStrm = linkDecode;
                        // }
                        // else {
                        linkToStrm = serveurStrm + linkDecode;
                        // }
    
                        if(autoSave == true){
                            return saveStrmFile(linkToStrm, nameFile);
                        }
    
                        if(ftpChecked == true) {
                            return searchByName(linkToStrm, nameFile)
                        }
                    } else if (choixStrm == 2) {
                        /// Uptobox choix
                        console.log("BartBot LOG -> HOST : " + host)
                        console.log(" ")
                        console.log(linkDecodes)
                        if(host == "uptobox") {
                            if(linkDecodes[i+2]) {
                                if(linkDecodes[i+2].newLinkUptobox == undefined) {
                                    let idUptobox = linkDecodes[i+1].linkUptobox.replace(/.*uptobox.*\//gm, "").replace(/\?aff_id.*/gm, "");
                                    linkToStrm = serveurStrm + idUptobox;
                                } else {
                                    linkToStrm = serveurStrm + linkDecodes[i+2].newLinkUptobox;
                                }
    
                                console.log("BartBot LOG -> Lien STRM : " + linkToStrm)
                                console.log(" ")
    
                                if(linkToStrm.match(/.*redirect.alldebrid.*/g)) {
                                    return console.log("BartBot LOG -> Erreur : Lien AllDebrid crypté détécter !")
                                }
    
                                if(ftpChecked == true) {
                                    return searchByName(linkToStrm, nameFile)
                                }
    
                                if(autoSave == true){
                                    return saveStrmFile(linkToStrm, nameFile);
                                }
                            } else {

                                let linkUptobox;
    
                                if(linkDecodes[i+1]?.linkUptobox == undefined) {
                                    linkUptobox = linkDecodes[i].linkUptobox;
                                } else {
                                    linkUptobox = linkDecodes[i+1].linkUptobox;
                                }
    
                                console.log("BartBot LOG -> Lien Uptobox : " + linkUptobox)
                                console.log(" ")
                                
                                if(linkUptobox.match(/.*redirect.alldebrid.*/g)) {
                                    return console.log("BartBot LOG -> Erreur : Lien AllDebrid crypté détécter !")
                                } else {
                                    return ownTheFile(linkUptobox, linkDecodes);
                                }
                            }
                        } 
                    }
                } else {
                    if (linkDecodes[i + 2]) {
                        console.log("1 SAVE NORMALMMENT")
                    } else {
                        /// Uptobox choix
                        if(host == undefined) return;
                        console.log("BartBot LOG -> HOST : " + host)
                        console.log(" ")
                        console.log(linkDecodes)
                        if (host == "uptobox") {

                            let linkUptobox;

                            if (linkDecodes[i + 1]?.linkUptobox == undefined) {
                                linkUptobox = linkDecodes[i].linkUptobox;
                            } else {
                                linkUptobox = linkDecodes[i + 1].linkUptobox;
                            }

                            console.log("BartBot LOG -> Lien Uptobox : " + linkUptobox)
                            console.log(" ")

                            if (linkUptobox.match(/.*redirect.alldebrid.*/g)) {
                                return console.log("BartBot LOG -> Erreur : Lien AllDebrid crypté détécter !")
                            } else {
                                return ownTheFile(linkUptobox, linkDecodes);
                            }
                        }
                    }
                }
               
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
            console.log("LOUPE COMBIEN ? ")
            next();
        });
    };

    loop().then(function () {
        /// PLUS TARD");
    });
}