export let apiKeyTMDB;

chrome.storage.sync.get(['apiKeyTMDB'], function (result) {
    apiKeyTMDB = result.apiKeyTMDB;
})

