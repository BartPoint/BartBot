export let agentName, apiKey, diffDays, username;

chrome.storage.sync.get(['diffDays'], function (result) {
  diffDays = result.diffDays;
})
chrome.storage.sync.get(['username'], function (result) {
  username = result.username;
})

chrome.storage.sync.get(['apiKey'], function (result) {
  apiKey = result.apiKey;
  chrome.storage.sync.get(['agentName'], function (result) {
    agentName = result.agentName;
  })
})

