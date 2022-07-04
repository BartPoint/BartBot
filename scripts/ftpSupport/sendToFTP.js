import { lienServer, serveurFTP, usernameFTP, passwordFTP, portFTP, pathFilms, pathSeries} from './info.js';

export function sendToFtp(linkToStrm, nameFile, nameFolder, mediaType, releaseDate, season) {
  fetch(lienServer, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: ['host=' + serveurFTP + '&user=' + usernameFTP + '&pass=' + passwordFTP + '&port=' + portFTP + '&path_films=' + pathFilms + '&path_series=' + pathSeries + '&releaseDate=' + releaseDate + '&nameFile=' + nameFile + '&linkToStrm=' + linkToStrm + '&nameFolder=' + nameFolder + '&mediaType=' + mediaType + '&season=' + season]
  })
  .then(response => response.body)
  .then(stream => {
    return new Response(stream, {
      headers: {
        "Content-Type": "text/html"
      }
    }).text();
  })
  .then(result => {
    console.log("BartBot LOG -> Envoie sur le FTP effectué !")
    console.log(" ")
    console.log("BartBot LOG -> Data : ")
    console.log(result);
    console.log(" ")
  })
  // ,
  // fetch(lienServer, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   body: ['host=&user=' + usernameFTP + '&pass=' + passwordFTP + '&port=' + portFTP + '&path_films=' + pathFilms + '&path_series=' + pathSeries + '&releaseDate=' + releaseDate + '&nameFile=' + nameFile + '&linkToStrm=' + linkToStrm + '&nameFolder=' + nameFolder + '&mediaType=' + mediaType + '&season=' + season]
  // })
  // .then(response => response.body)
  // .then(stream => {
  //   return new Response(stream, {
  //     headers: {
  //       "Content-Type": "text/html"
  //     }
  //   }).text();
  // })
  // .then(result => {
  //   console.log("BartBot LOG -> Envoie sur le FTP effectué !")
  //   console.log(" ")
  //   console.log("BartBot LOG -> Data : ")
  //   console.log(result);
  //   console.log(" ")
  //   // console.log("BartBot LOG -> Envoie sur le second FTP effectué !");
  // })

}