export let serveurStrm, choixStrm, autoSave;

chrome.storage.sync.get(['serveurStrm'], function (result) {
    serveurStrm = result.serveurStrm;
    chrome.storage.sync.get(['choixStrm'], function (result) {
        choixStrm = result.choixStrm;
        chrome.storage.sync.get(['autoSave'], function (result) {
            autoSave = result.autoSave;
        })
      })
})


