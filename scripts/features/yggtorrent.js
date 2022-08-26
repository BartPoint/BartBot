/* Import  Function */

import { allDebridInstantAvailableTorrent } from '../allDebrid/instantAvailableTorrent.js';
import { allCopy } from '../utils/copyData.js';

/* Function */

document.getElementById("egg").addEventListener('click', eggYGGTorrent);
document.getElementById("launch").addEventListener('click', YGGTorrent);

function YGGTorrent() {
  chrome.tabs.query({
    active: true,
    currentWindow: true 
  }).then((tab) => {
    tab = tab[0]
    let linkActual = tab.url;
    if (linkActual.match(/.*yggtorrent.*\/torrent\/.*/gm)) {
      let statusON = document.getElementById('status');
      statusON.textContent = "BartBot execute votre demande !";
      setTimeout(function () {
        statusON.textContent = '';
      }, 2500);
      chrome.scripting.executeScript({
        target: {
          tabId: tab.id
        },
        files: ['./scripts/utils/getPagesSource.js'],
      }, function () {
        if (chrome.runtime.lastError) {
          console.log('Error : ' + chrome.runtime.lastError.message);
          return;
        }
      })
      chrome.runtime.onMessage.addListener(function (request) {
        if (request.action == "getSource") {
          let data = request.source;
          let myRegex = /<td.*Info.*\n.*<td>(.*)</gm;
          let matches = data.matchAll(myRegex);
          let allLinks = [];
          for (const match of matches) {
            let magnet = "magnet:?xt=urn:btih:" + match[1];
            allLinks.push(magnet)
          }
          return allDebridInstantAvailableTorrent(allLinks);
        }
      })
    } else {
      let statusON = document.getElementById('status');
      statusON.textContent = "Vous n'êtes pas sur une page compatible YGGTorrent";
      setTimeout(function () {
          statusON.textContent = '';
      }, 5000);
      console.log("Vous n'êtes pas sur une page compatible YGGTorrent");
  }
  })
}

let counter = 0;

function eggYGGTorrent() {
  counter += 1;
  if (counter == 5) {
    chrome.tabs.query({
      active: true
    }).then((tab) => {
      tab = tab[0]
      let linkActual = tab.url;
      console.log(linkActual)
      if (linkActual.match(/.*yggtorrent.+?(?=\/)/g)) {
        let statusON = document.getElementById('status');
        statusON.textContent = "BartBot execute votre demande !";
        setTimeout(function () {
          statusON.textContent = '';
        }, 2500);
        /// EXECUTER CA POUR RECUPERER LES ID DE LA PAGE
        chrome.scripting.executeScript({
          target: {
            tabId: tab.id
          },
          files: ['./scripts/utils/getTorrentHref.js'],
        }, function () {
          if (chrome.runtime.lastError) {
            console.log('Error : ' + chrome.runtime.lastError.message);
            return;
          }
        })

        chrome.runtime.onMessage.addListener(function (request) {
          if (request.action == "ToGetTorrentHref") {
            let allLinks = request.source;
            if (allLinks.length == 0) {
              console.log("Aucun torrent trouvé")
            }
            let interval = 2000; // Link redirect must do 50ms but up to 4s with tirexo:(
            var loop = function () {
              return new Promise(function (outerResolve) {
                var promise = Promise.resolve();
                var i = 0;
                var next = function () {
                  let link = allLinks[i];
                  fetch(link).then(function (response) {
                    if (response.status !== 200) {
                      console.log('Error status Code : ' + response.status);
                      return;
                    }
                    response.text().then(function (data) {
                      let myRegex = /<td.*Info.*\r\n.*<td>(.*)</gm;
                      let matches = data.matchAll(myRegex);
                      let allLinks = [];
                      for (const match of matches) {
                        let magnet = "magnet:?xt=urn:btih:" + match[1];
                        allLinks.push(magnet)
                      }
                      return allDebridInstantAvailableTorrent(allLinks);
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
              /// STV 
            });
          } else {
            console.log("Erreur : " + request.action);
          }
        })
      } else {
        let statusON = document.getElementById('status');
        statusON.textContent = "Vous n'êtes pas sur une page compatible YGGTorrent";
        setTimeout(function () {
            statusON.textContent = '';
        }, 5000);
        console.log("Vous n'êtes pas sur une page compatible YGGTorrent");
      }
    })
  }
}

allCopy();
