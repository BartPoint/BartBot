export let tokenUptobox, ownFiles, replacesUptobox

chrome.storage.sync.get(['tokenUptobox'], function (result) {
    tokenUptobox = result.tokenUptobox;
    chrome.storage.sync.get(['ownFiles'], function (result) {
        ownFiles = result.ownFiles;
        chrome.storage.sync.get(['replacesUptobox'], function (result) {
            replacesUptobox = result.replacesUptobox;
        })
    })
})