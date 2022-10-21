import { tokenUptobox, ownFiles } from './info.js';
import { getFileStrm } from '../strmSupport/fileStrm.js';
import { clear, error, log, warning } from '../consoleLog/global.js';

export function ownTheFile(linkUptobox, linkDecode) {

    let idUptobox;

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    if (ownFiles == true) {
        if (typeof linkUptobox == 'string') {
            let valeur = linkUptobox;
            linkUptobox = [];
            linkUptobox.push(valeur)
        }
        let interval = 400; // Link resolve 200ms moyenne
        var loop = function () {
            return new Promise(function (outerResolve) {
                var promise = Promise.resolve();
                var i = 0;
                var next = function () {
                    if (linkUptobox[i].match(/.*uptobox.*\//gm)) {
                        idUptobox = linkUptobox[i].replace(/.*uptobox.*\//gm, "").replace(/\?aff_id.*/gm, "");
                    } else {
                        idUptobox = linkUptobox[i].replace(/\//g, "").replace(/\?aff_id.*/gm, "");
                    }
                    fetch('https://uptobox.com/api/user/file/alias?token=' + tokenUptobox + '&file_code=' + idUptobox).then(function (response) {
                        if (response.status !== 200) {
                            error('Error status Code : ' + response.status);
                            console.log('Error status Code : ' + response.status);
                            return;
                        }
                        response.text().then(function (data) {
                            data = JSON.parse(data)
                            if (data.message == "Success") {
                                let newIdUptobox = data.data.file_code;
                                if(linkDecode == undefined) {
                                    let allLinks = document.getElementById('resultatArea');

                                    allLinks.insertAdjacentHTML("beforeend",
                                `Own New File on Uptobox Account with TextUP Feature :) 

----------------------------------------------------
    
Ancien ID Uptobox : ` + idUptobox + `
    
----------------------------------------------------
    
New ID Uptobox : ` + newIdUptobox + `
    
----------------------------------------------------
    
`)
                                } else {
                                    linkDecode.push({
                                        newLinkUptobox: newIdUptobox
                                    })
                                    return getFileStrm(linkDecode);
                                }
                            }  else if(data.statusCode == 1) {
                                linkDecode.push({
                                    newLinkUptobox: idUptobox
                                })
                                return getFileStrm(linkDecode);
                            } else if (data.statusCode == 28) {
                                log("BartBot LOG -> Erreur : Lien Mort !")
                                log(" ")
                                console.log("BartBot LOG -> Erreur : Lien Mort !")
                                console.log(" ")
                            } else {
                                log("BartBot LOG -> Erreur : " + data.message + " Info : " + data.statusCode)
                                log("")
                                console.log("BartBot LOG -> Erreur : " + data.message + " Info : " + data.statusCode)
                                console.log(" ")
                            }
                        })
                    }).catch(function (error) {
                        error(JSON.stringify(error));
                        console.log(error);
                    })
                    if (++i < linkUptobox.length) {
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
            log("BartBot -> Link(s) has been owned in your Uptobox Account :)")
            console.log("BartBot -> Link(s) has been owned in your Uptobox Account :)")
        });
    } else {
        linkDecode.push({
            newLinkUptobox: idUptobox
        })
        return getFileStrm(linkDecode);
    }
}
