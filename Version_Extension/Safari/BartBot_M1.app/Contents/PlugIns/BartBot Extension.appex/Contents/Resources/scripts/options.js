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
            console.log(data)
            data = JSON.parse(data)
            if (data.status == "success") {
              let status = document.getElementById('status');
              status.textContent = 'Options saved and valid.';
              status.style.color = 'green';
              setTimeout(function () {
                status.textContent = '';
              }, 1500);
            } else {
              let status = document.getElementById('status');
              status.textContent = 'Options saved but API/AgentName not valid. !';
              setTimeout(function () {
                status.textContent = '';
              }, 5000);
              chrome.storage.sync.remove(['apiKey'], function (result) {
                console.log(result)
                chrome.storage.sync.remove(['agentName'], function (result) {
                  console.log(result)
                })
              })
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