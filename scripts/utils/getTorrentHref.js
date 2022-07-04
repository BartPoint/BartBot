function getTorrentHref() {
    let links = document.querySelectorAll('a[href]')
    let torrentId = []
    for (var i = 0; i < links.length; i++) {
      var link = links[i].getAttribute("href");
      if(link.match(/.*yggtorrent.*\/torrent\/.*/gm)) {
        torrentId.push(link)
      }
    }
    return torrentId;
}

chrome.runtime.sendMessage({
    action: "ToGetTorrentHref",
    source: getTorrentHref()
});