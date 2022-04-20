/* Import  Function */

import { allDebridRedirect } from '../allDebrid/redirect.js';
import { allCopy } from '../utils/copyData.js';

/* Function */

document.getElementById("launch").addEventListener('click', wawaCity);

function wawaCity() {
    chrome.tabs.query({ active: true }).then((tab) => {
        tab = tab[0]
        let statusON = document.getElementById('status');
        statusON.textContent = "BartBot execute votre demande !";
        setTimeout(function () {
            statusON.textContent = '';
        }, 2500);
        let linkActual = tab.url;
        if (linkActual.match(/^(.*).wawacity(.*)id=[0-9]/g)) {
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
                                    allLinks.push(linkDL)
                                }   
                                return allDebridRedirect(allLinks);
                        });
                    }
                )
                .catch(function (err) {
                    console.log('Fetch Error : ', err);
                });
        } else {
            let statusON = document.getElementById('status');
            statusON.textContent = "Vous n'êtes pas sur une page compatible WawaCity";
            setTimeout(function () {
                statusON.textContent = '';
            }, 5000);
            console.log("Vous n'êtes pas sur une page compatible WawaCity");
            // window.open("https://www.wawacity.blue/",'_blank');
        }
    })
}

allCopy();