/// Si je veux enlever toutes les autres options : chrome.contextMenus.removeAll();
chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        id: "addtoqueue",
        title: "Debloque le liens maintenant !",
        contexts: ["link"],
    });
 });

const channel = new BroadcastChannel('VARIABLE_CHANNEL');

let linkToDebrid;

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == "addtoqueue") {
        linkToDebrid =  info.linkUrl;
        chrome.notifications.create('notif_add', {
            type: 'basic',
            title: 'Tu a ajoutez un lien à la queue',
            message: 'Ouvez la PopUp a la page Custom Debrid pour récuperer le résultat!',
            iconUrl: '/icons/logo_32.png',
            priority: 2
        });
    }
});

channel.onmessage = () => {
    channel.postMessage({
        msg: linkToDebrid
    });
};

