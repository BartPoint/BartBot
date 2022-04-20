export let agentName, apiKey;

chrome.storage.sync.get(['apiKey'], function (result) {
  apiKey = result.apiKey;
  chrome.storage.sync.get(['agentName'], function (result) {
    agentName = result.agentName;
  })
})