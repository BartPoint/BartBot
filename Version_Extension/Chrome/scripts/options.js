function save_options() {
  var apiKey = document.getElementById('apiKey').value;
  var agentName = document.getElementById('agentName').value;
  chrome.storage.sync.set({
    apiKey: apiKey,
    agentName: agentName
  }, function () {
    validAuth()
  });
}

function validAuth() {
  let agentName, apiKey;

  chrome.storage.sync.get(['apiKey'], function (result) {
    apiKey = result.apiKey;
    document.getElementById('apiKey').innerHTML = result.apiKey;
    chrome.storage.sync.get(['agentName'], function (result) {
      agentName = result.agentName;
      apiCheck();
    })
  })

  function apiCheck() {
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
    document.getElementById('apiKey').innerHTML = result.apiKey;
    chrome.storage.sync.get(['agentName'], function (result2) {
      agentName = result2.agentName;
      var Key = document.getElementById('apiKey')
      var Name = document.getElementById('agentName')
      Key.value += apiKey;
      Name.value += agentName;
    })
  })
}

document.getElementById('save').addEventListener('click', save_options);
window.addEventListener('load', getAccount)