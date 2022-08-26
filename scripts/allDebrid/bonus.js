export let addFormat;

chrome.storage.sync.get(['addFormat'], function (result) {
    addFormat = result.addFormat
})