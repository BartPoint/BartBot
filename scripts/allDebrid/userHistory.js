import {getFileStrm} from '../strmSupport/fileStrm.js';

import { apiKey, agentName } from './account.js';

export function userHisory(linkDecodes) {

    if (typeof linkDecodes == 'string') {
        let valeur = linkDecodes;
        linkDecodes = [];
        linkDecodes.push(valeur)
    }

    let interval = 5000; // Link resolve 200ms moyenne
    var loop = function () {
        return new Promise(function (outerResolve) {
            var promise = Promise.resolve();
            var i = 0;
            var next = function () {
                let host = linkDecodes[i].host;
                fetch('https://api.alldebrid.com/v4/user/history?agent=agent='+ agentName + '&apikey=' + apiKey).then(function (response) {
                    if (response.status !== 200) {
                        console.log('Error status Code : ' + response.status);
                        return;
                    }
                    response.text().then(function (data) {
                                data = JSON.parse(data)
                                if (data.status == "success") {
                                    let nbSaveInMyAccount = data.data.links.length
                                    let getTheLastLink = nbSaveInMyAccount - 1
                                    let linkUptobox = data.data.links[getTheLastLink].link;
                                    if(host == "uptobox") {
                                        linkDecodes.push({
                                            linkUptobox: linkUptobox
                                        });
                                        // console.log(linkDecodes)
                                        return getFileStrm(linkDecodes);
                                    } else {
                                        return getFileStrm(linkDecodes);
                                    }
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
        /// PLUS TARD");
    });
}