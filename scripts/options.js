function save_options() {
  let apiKey = document.getElementById('apiKey').value;
  let agentName = document.getElementById('agentName').value;
  chrome.storage.sync.set({
    apiKey: apiKey,
    agentName: agentName
  }, function () {
    validAuthAllDebrid()
  });
}
function validAuthAllDebrid() {
  let agentName, apiKey;

  chrome.storage.sync.get(['apiKey'], function (result) {
    apiKey = result.apiKey;
    chrome.storage.sync.get(['agentName'], function (result) {
      agentName = result.agentName;
      apiCheckAllDebrid();
    })
  })

  function apiCheckAllDebrid() {
    fetch('https://api.alldebrid.com/v4/user?agent=' + agentName + '&apikey=' + apiKey)
      .then(
        function (response) {
          if (response.status !== 200) {
            console.log('Error Status Code : ' + response.status)
            return;
          }
          response.text().then(function (data) {
            data = JSON.parse(data)
            if (data.status == "success") {
              /// Variable a synchroniser
              let username = data.data.user.username;
              let timestamp = data.data.user.premiumUntil;
              /// Script pour get les jours restant avant la fin de l'abo
              const oneDay = 24 * 60 * 60 * 1000;
              let firstDate = new Date(timestamp * 1000);
              let secondDate = new Date();
              const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
              chrome.storage.sync.set({
                username: username,
                diffDays: diffDays
              }, function () {
                let status = document.getElementById('status');
                status.textContent = 'Connexion valide !';
                status.style.color = '#22780F';
                setTimeout(function () {
                  status.textContent = '';
                  location.reload();
                }, 1500);
              })
            } else {
              let status = document.getElementById('status');
              status.textContent = 'Il semblerait que votre API Key ne soit pas valide ! ';
              setTimeout(function () {
                status.textContent = '';
              }, 5000);
              chrome.storage.sync.remove(['apiKey']);
              chrome.storage.sync.remove(['agentName']);
              chrome.storage.sync.remove(['username']);
              chrome.storage.sync.remove(['diffDays']);
              }
          })
        })
        .catch(function (err) {
          console.log('Fetch Error : ', err);
      });
  }
}

function getAccount() {
  let agentName, apiKey;

  chrome.storage.sync.get(['apiKey'], function (result) {
    apiKey = result.apiKey;
    chrome.storage.sync.get(['agentName'], function (result2) {
      agentName = result2.agentName;
      let Key = document.getElementById('apiKey')
      let Name = document.getElementById('agentName')
      Key.value += apiKey;
      Name.value += agentName;
    })
  })
}

function save_bonus() {
  let ftpChecked = document.getElementById('ftp').checked;
  let serverStrm = document.getElementById('strmServer').value;
  let choixStrm = document.querySelector(`input[type="radio"][name=strm]:checked`).value
  let tokenUptobox = document.getElementById('apiUptobox').value;
  let autoSave = document.getElementById('autoSave').checked;
  let ownFiles = document.getElementById('ownFiles').checked;
  let replacesUptobox = document.getElementById('replacesUptobox').checked;
  let apiKeyTMDB = document.getElementById('apiKeyTMDB').value;
  let addFormat = document.getElementById('addFormat').checked;
  chrome.storage.sync.set({
    serveurStrm: serverStrm,
    choixStrm: choixStrm,
    autoSave: autoSave,
    tokenUptobox: tokenUptobox,
    apiKeyTMDB: apiKeyTMDB,
    ownFiles: ownFiles,
    replacesUptobox: replacesUptobox,
    ftpChecked: ftpChecked,
    addFormat: addFormat
  }, function () {
    let statusStrm = document.getElementById('statusStrm');
    statusStrm.textContent = 'Options STRM sauvegardées !';
    statusStrm.style.color = '#22780F';
    let statusParam = document.getElementById('statusParam');
    statusParam.textContent = 'Options Paramètres sauvegardées !';
    statusParam.style.color = '#22780F';
    setTimeout(function () {
      statusStrm.textContent = '';
      statusParam.textContent = '';
    }, 3000);
    validAuthUptobox();
    validApiKeyTMDB();
  });
}

function save_bonusFTP() {
  let lienServer = document.getElementById('lienServer').value;
  let serveurFTP = document.getElementById('serveurFTP').value;
  let usernameFTP = document.getElementById('usernameFTP').value;
  let passwordFTP = document.getElementById('passwordFTP').value;
  let portFTP = document.getElementById('portFTP').value;
  let pathFilms = document.getElementById('pathFilms').value;
  let pathSeries = document.getElementById('pathSeries').value;
  if(portFTP == "") portFTP = 21; 
  if(pathFilms == "") pathFilms = "/Films";
  if(pathSeries == "") pathSeries = "/Series";
  chrome.storage.sync.set({
    lienServer: lienServer,
    serveurFTP: serveurFTP,
    usernameFTP: usernameFTP,
    passwordFTP: passwordFTP,
    portFTP: portFTP,
    pathFilms: pathFilms,
    pathSeries: pathSeries
  }, function () {
    let statusFTP = document.getElementById('statusFTP');
    statusFTP.textContent = 'Options FTP sauvegardées !';
    statusFTP.style.color = '#22780F';
    document.getElementById('ftp').checked = true;
    setTimeout(function () {
      statusFTP.textContent = '';
      location.reload();
    }, 3000);
  })
}

function validAuthUptobox() {
  let tokenUptobox;
  chrome.storage.sync.get(['tokenUptobox'], function (result) {
    tokenUptobox = result.tokenUptobox;
    apiCheckUptobox(tokenUptobox);
  })
}

function validApiKeyTMDB() {
  let apiKeyTMDB;
  console.log("test")
  chrome.storage.sync.get(['apiKeyTMDB'], function (result) {
    apiKeyTMDB = result.apiKeyTMDB;
    apiCheckTMDB(apiKeyTMDB);
  })
}

function apiCheckUptobox(tokenUptobox) {
  fetch('https://uptobox.com/api/user/me?token=' + tokenUptobox)
  .then(
    function (response) {
      if (response.status !== 200) {
        console.log('Error Status Code : ' + response.status)
        return;
      }
      response.text().then(function (data) {
        data = JSON.parse(data)
        if(data.statusCode == 0) {
          let status = document.getElementById('statusUptobox');
          status.textContent = 'API Uptobox valide !';
          status.style.color = '#22780F';
          setTimeout(function () {
            status.textContent = '';
            location.reload();
          }, 3000);
        } else {
          let status = document.getElementById('statusUptobox');
          status.textContent = 'Il semblerait que votre API Uptobox ne soit pas valide ! ';
          statusStrm.style.color = '#BB0B0B';
          setTimeout(function () {
            status.textContent = '';
          }, 3000);
          chrome.storage.sync.remove(['tokenUptobox']);
        }
      })
    }
  )
}

function apiCheckTMDB(apiKeyTMDB) {
  fetch('https://api.themoviedb.org/3/authentication/token/new?api_key=' + apiKeyTMDB)
  .then(
    function (response) {
      if (response.status !== 200) {
        console.log('Error Status Code : ' + response.status)
        return;
      }
      response.text().then(function (data) {
        data = JSON.parse(data)
        if(data.success == true) {
          let status = document.getElementById('statusTMDB');
          status.textContent = 'API TMDB valide !';
          status.style.color = '#22780F';
          setTimeout(function () {
            status.textContent = '';
            location.reload();
          }, 3000);
        } else {
          let status = document.getElementById('statusTMDB');
          status.textContent = 'Il semblerait que votre API TMDB ne soit pas valide ! ';
          statusStrm.style.color = '#BB0B0B';
          setTimeout(function () {
            status.textContent = '';
          }, 3000);
          chrome.storage.sync.remove(['apiKeyTMDB']);
        }
      })
    }
  )
}
function getOptionsBonus() {
  let lienServer, serveurStrm, choixStrm, autoSave, replacesUptobox, tokenUptobox, apiKeyTMDB, ownFiles, serveurFTP, usernameFTP, passwordFTP,  portFTP, pathFilms, pathSeries;

  chrome.storage.sync.get(['serveurStrm'], function (result) {
    serveurStrm = result.serveurStrm;
    document.getElementById('strmServer').value =  serveurStrm;
    chrome.storage.sync.get(['choixStrm'], function (result) {
      choixStrm = result.choixStrm;
      document.querySelector(`input[type="radio"][value='` + choixStrm + `']`).checked = true;
      chrome.storage.sync.get(['autoSave'], function (result) {
        autoSave = result.autoSave;
        if(autoSave == true) {
          document.getElementById('autoSave').checked = true;
        } else {
          document.getElementById('autoSave').checked = false;
        }
        chrome.storage.sync.get(['tokenUptobox'], function (result) {
          tokenUptobox = result.tokenUptobox;
          document.getElementById('apiUptobox').value = tokenUptobox;
          chrome.storage.sync.get(['ownFiles'], function (result) {
            ownFiles = result.ownFiles;
            if(ownFiles == true) {
              document.getElementById('ownFiles').checked = true;
            } else {
              document.getElementById('ownFiles').checked = false;
            }
            chrome.storage.sync.get(['serveurFTP'], function (result) {
              serveurFTP = result.serveurFTP;
              if(serveurFTP != undefined) {
                document.getElementById('serveurFTP').value = serveurFTP;
              }
              chrome.storage.sync.get(['usernameFTP'], function (result) {
                usernameFTP = result.usernameFTP;
                if(usernameFTP != undefined) {
                  document.getElementById('usernameFTP').value = usernameFTP;
                }
                chrome.storage.sync.get(['passwordFTP'], function (result) {
                  passwordFTP = result.passwordFTP;
                  if(passwordFTP != undefined) {
                    document.getElementById('passwordFTP').value = passwordFTP;
                    console.log(passwordFTP)
                  }
                  chrome.storage.sync.get(['portFTP'], function (result) {
                    portFTP = result.portFTP;
                    if(portFTP != undefined) {
                      document.getElementById('portFTP').value = portFTP;
                    }
                    chrome.storage.sync.get(['pathFilms'], function (result) {
                      pathFilms = result.pathFilms;
                      document.getElementById('pathFilms').value = pathFilms;
                      chrome.storage.sync.get(['pathSeries'], function (result) {
                        pathSeries = result.pathSeries;
                        document.getElementById('pathSeries').value = pathSeries;
                        chrome.storage.sync.get(['lienServer'], function (result) {
                          lienServer = result.lienServer;
                          document.getElementById('lienServer').value =lienServer;
                          chrome.storage.sync.get(['ftpChecked'], function (result) {
                            ftpChecked = result.ftpChecked;
                            if(ftpChecked == true) {
                              document.getElementById('ftp').checked = true;
                            } else {
                              document.getElementById('ftp').checked = false;
                            }
                            chrome.storage.sync.get(['apiKeyTMDB'], function (result) {
                              apiKeyTMDB = result.apiKeyTMDB;
                              document.getElementById('apiKeyTMDB').value = apiKeyTMDB;
                              chrome.storage.sync.get(['replacesUptobox'], function (result) {
                                replacesUptobox = result.replacesUptobox;
                                console.log(replacesUptobox)
                                if(replacesUptobox == true) {
                                  document.getElementById('replacesUptobox').checked = true;
                                } else {
                                  document.getElementById('replacesUptobox').checked = false;
                                }
                                chrome.storage.sync.get(['addFormat'], function (result) {
                                  addFormat = result.addFormat
                                  if(addFormat == true) {
                                    console.log(addFormat)
                                    document.getElementById('addFormat').checked = true;
                                  } else {
                                    document.getElementById('addFormat').checked = false;
                                  }
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                    if(portFTP != undefined && usernameFTP != undefined && passwordFTP != undefined) {
                      document.getElementById('ftp').checked = true;
                      document.getElementById('ftp_yes').style.display = 'none';
                    }
                  })
                })
            })
          })
        })
        })
      })
    });
  });
}
if(document.getElementById('save')) {
  document.getElementById('save').addEventListener('click', save_options);
  window.addEventListener('load', getAccount)
}
if(document.getElementById('saveBonus')) {
  document.getElementById('saveBonus').addEventListener('click', save_bonus);
  document.getElementById('saveFTP').addEventListener('click', save_bonusFTP);
  window.addEventListener('load', getOptionsBonus)
  document.getElementById('ftp').addEventListener('click', function handleClick() {
    if (document.getElementById('ftp').checked) {
      document.getElementById('ftp_yes').style.display = 'block';
    } else {
      document.getElementById('ftp_yes').style.display = 'none';
    }
  });
}