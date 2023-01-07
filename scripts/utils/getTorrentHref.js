function getTorrentHref() {
    let links = document.querySelectorAll('a[href]')
    let torrentId = []
    let nb = 0;
    for (var i = 0; i < links.length; i++) {
      var link = links[i].getAttribute("href");
      if(link.match(/.*yggtorrent.*\/torrent\/.*/gm)) {
        torrentId.push(link)
      } else if (link.match(/.*torrent\/[0-9]/gm)) {
        nb += 1;

        if(nb > 10) {
          torrentId.push(link)
        }
      }
    }


    return torrentId;
}

chrome.runtime.sendMessage({
    action: "ToGetTorrentHref",
    source: getTorrentHref()
});