import { allDebridRedirect } from '../allDebrid/redirect.js';

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
              return allDebridRedirect();
            } else {
              let status = document.getElementById('status');
              status.textContent = 'API/AgentName not valid. !';
              setTimeout(function () {
                status.textContent = '';
              }, 5000);
            }
          })
        })
        .catch(function (err) {
          console.log('Fetch Error : ', err);
      });
  }