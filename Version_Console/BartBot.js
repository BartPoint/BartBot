if (typeof agentName == 'undefined') agentName = "ENTER HERE";
if (typeof apiKey == 'undefined') apiKey = "ENTER HERE";

function BartBot() {
    console.log("Hey, I'm BartBot  -> You started me ? Well start my Work");
    let linkActual = document.URL;
    if (linkActual.includes("extreme-down")) ExtremeDown()
    if (linkActual.includes("tirexo")) Tirexo()
}

function ExtremeDown() {

    console.log("BartBot -> Welcome, be patient i started the tool for you for ExtremeDown website :p")
    let linkActual = document.URL;
    fetch('https://api.codetabs.com/v1/proxy?quest=' + linkActual)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Error status Code : ' + response.status + "\n Retry to call the function ExtremeDown()");
                    return;
                }
                response.text().then(function (data) {
                    const myRegex = /<a title="(.*)" href="(.*)" target="_blank".*class="hebergeur">Uptobox<\/strong>/g;
                    const matches = data.matchAll(myRegex);
                    let allLinks = [];
                    for (const match of matches) {
                        /// let titleEpisode = match[1] titre de l'épisode (nom de la release)
                        let linkDL = match[2];
                        allLinks.push(linkDL)
                    }
                    return allDebridRedirect(allLinks);
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error : ', err);
        });
}

function Tirexo() {
    console.log("BartBot -> Welcome, be patient i started the tool for you for Tirexo website :p")
    let linkActual = document.URL;
    fetch('https://api.codetabs.com/v1/proxy?quest=' + linkActual)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Error status Code : ' + response.status + "\n Retry to call the function tirexo()");
                    return;
                }
                response.text().then(function (data) {
                    let url;
                    if (data.match(/copy_serie/gm)) {
                        url = "https://www2.tirexo.art";
                        const myRegex = /<tr.*\n<td>.* href='(.*)'>Episode.*\n<td.*\n<td>(.*)<\/td>\n<td>(.*)<\/td>\n<td.*\n<td.*\n<td.*class='checkbox_uptoboxcom/g;
                        const matches = data.matchAll(myRegex);
                        let allLinks = [];
                        for (const match of matches) {
                            let linkDL = url + match[1];
                            allLinks.push(linkDL)
                            /// let episodeSize = match[2]; taille des épisode capturé 
                            /// let dateUpload = match[3]; date d'upload du fichier capturé 
                        }
                        return allDebridRedirect(allLinks);
                    } else {
                        url = "https://www2.tirexo.art/link-";
                        const myRegex = /<button.* data-id='(.*)'>/g;
                        const matches = data.matchAll(myRegex);
                        let allLinks = [];
                        for (const match of matches) {
                            let linkDL = url + match[1] + '.html';
                            allLinks.push(linkDL)
                        }
                        return allDebridRedirect(allLinks);
                    }
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error : ', err);
        });
}

function wawaCity() {
    let linkActual = document.URL;
    fetch('https://api.codetabs.com/v1/proxy?quest=' + linkActual)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Error status Code : ' + response.status);
                    return;
                }
                response.text().then(function (data) {
                    const myRegex = /href="(.*)&rl=[a-z]2"[^U]*">Uptobox/g;
                    const matches = data.matchAll(myRegex);
                    let allLinks = [];
                    for (const match of matches) {
                        let linkDL = match[1];
                        console.log(linkDL)
                        allLinks.push(linkDL)
                    }
                    return allDebridRedirect(allLinks);
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error : ', err);
        });
}

function allDebridRedirect(allLinks) {
    if (typeof allLinks == 'string') {
        let valeur = allLinks;
        allLinks= [];
        allLinks.push(valeur)
    }
    console.log("BartBot -> Just to say that we are at the Next Step be patient :)")
    let interval = 2000; // Link redirect must do 50ms but up to 4s with tirexo:(
    var loop = function () {
        return new Promise(function (outerResolve) {
            var promise = Promise.resolve();
            var i = 0;
            var next = function () {
                let link= allLinks[i];
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
                            console.log("Status Error")
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
        console.log("Tous les liens possibles ont été récupérer.")
    });
}

function allDebridDownload(linkDecodes) {
    if (typeof linkDecodes == 'string') {
        let valeur = linkDecodes;
        linkDecodes = [];
        linkDecodes.push(valeur)
    }
    let interval = 1000; // Link resolve 200ms moyenne
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
                            let linkDownload = data.data.link;
                            let hostDownload = data.data.host;
                            let nomFichier = data.data.filename;
                            let sizeFichier = data.data.filesize / (1024 * 1024 * 1024);
                            let allLinks = document.getElementById('resultatArea');
                            console.log("Host depuis : " + hostDownload + "\nNom du Fichier : " + nomFichier + "\nTaille du Fichier : " + sizeFichier.toFixed(1) + "\nLien pour télécharger : " + linkDownload);
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
        console.log("BartBot -> A link has been unbridled :)")
    });
}

clear()