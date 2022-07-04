export let ftpChecked, lienServer, serveurFTP, usernameFTP, passwordFTP, portFTP, pathFilms, pathSeries;

chrome.storage.sync.get(['ftpChecked'], function (result) {
	ftpChecked = result.ftpChecked;
	chrome.storage.sync.get(['lienServer'], function (result) {
		lienServer = result.lienServer;
		chrome.storage.sync.get(['serveurFTP'], function (result) {
			serveurFTP = result.serveurFTP;
			chrome.storage.sync.get(['usernameFTP'], function (result) {
				usernameFTP = result.usernameFTP;
				chrome.storage.sync.get(['passwordFTP'], function (result) {
					passwordFTP = result.passwordFTP;
					chrome.storage.sync.get(['portFTP'], function (result) {
						portFTP = result.portFTP;
						chrome.storage.sync.get(['pathFilms'], function (result) {
							pathFilms = result.pathFilms;
							chrome.storage.sync.get(['pathSeries'], function (result) {
								pathSeries = result.pathSeries;
							})
						})
					})
				})
			})
		})	
	})
})


