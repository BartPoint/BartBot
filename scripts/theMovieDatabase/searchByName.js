import { sendToFtp } from '../ftpSupport/sendToFTP.js';
import { updateFolderUptobox } from '../uptoboxSupport/updateFolderUptobox.js';
import { apiKeyTMDB } from './account.js'
import { ownFiles } from '../uptoboxSupport/info.js'

export function searchByName(linkToStrm, nameFileOriginal) {
    let nameFile;
    let dateOriginal; 
    let i = 0;

    if (nameFileOriginal.match(/[Ss][0-9]/g)) {
        /// SERIES

        nameFile = nameFileOriginal.replaceAll(/.(\d{1,2}\d{1,2}\d{2,4})/g, "").replaceAll(/.[S-s][0-9].*/g, " ").replaceAll(/[.]/g, " ").replace(/[ ]$/g, "").replace(/ -/gm, "").replaceAll(/\[French-Stream.Re\]/g, "").replaceAll(/^ /gm, "").replaceAll(/ $/gm, "")

        /// IF YOU WANT TO DO SEARCH CUSTOM JUST ADD .replace("CUSTOM REPLACE", "") if for example ' is too much or not necessary to get good result

        fetch('https://api.themoviedb.org/3/search/multi?api_key=' + apiKeyTMDB + '&query=' + nameFile).then(function (response) {
            if (response.status !== 200) {
                console.log('Error status Code : ' + response.status);
                return;
            }
            response.text().then(function (data) {
                console.log("BartBot LOG -> Nom Fichier après édit : ")
                console.log(nameFile)
                data = JSON.parse(data)
                let nameFolder = nameFile;
                let mediaType;
                let releaseDate;
                console.log("BartBot LOG -> All Data : ")
                console.log(data.results)

                let done = false;

                do {
                    if (data.results[i].media_type == "tv") {
                        mediaType = data.results[i].media_type;
                        releaseDate = data.results[i]?.first_air_date;
                        done = true;
                    }
                    console.log("BartBot LOG -> Data Actu : ")
                    console.log(data.results[i])
                    console.log("")
                    i++;
                } while (done == false);

                let match = releaseDate.match(/(\d{1,2}\d{1,2}\d{2,4})/g);
                if (releaseDate) {
                    releaseDate = match[0]
                } else {
                    releaseDate = "Unknown";
                }

                let season = nameFileOriginal.match(/S[0-9]./g);

                if (ownFiles) {
                    return sendToFtp(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate, season), updateFolderUptobox(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate, season)
                } else {
                    return sendToFtp(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate, season)
                }
            });
        });
        }
        else if (nameFileOriginal.match(/(.*).(\d{1,2}\d{1,2}\d{2,4})/g)) {
            /// FILMS 

            dateOriginal = nameFileOriginal.match(/(\d{1,2}\d{1,2}\d{2,4})/g);

            nameFile = nameFileOriginal.replaceAll(/.(\d{1,2}\d{1,2}\d{2,4}).*/g, "").replaceAll(".", " ").replace(/[ ]$/gm, "").replaceAll(/ ★/gm, "")

            fetch('https://api.themoviedb.org/3/search/multi?api_key=' + apiKeyTMDB + '&query=' + nameFile).then(function (response) {
                        if (response.status !== 200) {
                            console.log('Error status Code : ' + response.status);
                            return;
                        }
                        response.text().then(function (data) {
                            data = JSON.parse(data)
                            let nameFolder = nameFile;
                            let globalResults = data.results[0];
                            let mediaType = globalResults?.media_type;
                            let releaseDate;
                            console.log("BartBot LOG -> All Data : ")
                            console.log(data.results)
                            console.log("BartBot LOG -> Data Actu : ")
                            console.log(globalResults)
                            console.log("")
                            let done = false;

                            do {
                                if (data.results[i].media_type == "movie" && data.results[i].release_date.match(/(\d{1,2}\d{1,2}\d{2,4})/g)[0] == (dateOriginal[0] + 1) || data.results[i].release_date.match(/(\d{1,2}\d{1,2}\d{2,4})/g)[0] == (dateOriginal[0] - 1) || data.results[i].release_date.match(/(\d{1,2}\d{1,2}\d{2,4})/g)[0] == dateOriginal[0]) {
                                    mediaType = data.results[i].media_type;
                                    releaseDate = data.results[i]?.release_date;
                                    done = true;
                                } 
                                console.log("BartBot LOG -> Data Actu : ")
                                console.log(data.results[i])
                                console.log("")
                                i++;
                            } while (done == false);


                            let match = releaseDate?.match(/(\d{1,2}\d{1,2}\d{2,4})/g);
                            console.log(match)
                            if (releaseDate) {
                                releaseDate = match[0]
                            } else {
                                releaseDate = "Unknown";
                            }
                            if (ownFiles) {
                                return sendToFtp(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate), updateFolderUptobox(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate)
                            } else {
                                return sendToFtp(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate)
                            }
                        })
        });
    } else if (nameFileOriginal.match(/(.*).Integral|(.*).INTEGRAL/g)) {
        /// INTEGRAL 

        let nameFile = nameFileOriginal.replaceAll(/.Integral.*|.INTEGRAL.|S[0-9].*/g, "").replaceAll(".", " ").replace(/[ ]$/g, "");

        fetch('https://api.themoviedb.org/3/search/multi?api_key=' + apiKeyTMDB + '&query=' + nameFile).then(function (response) {
            if (response.status !== 200) {
                console.log('Error status Code : ' + response.status);
                return;
            }
            response.text().then(function (data) {
                data = JSON.parse(data)
                let globalResults = data.results[0];
                let nameFolder = nameFile
                let releaseDate = globalResults?.release_date;
                let match = releaseDate.match(/(\d{1,2}\d{1,2}\d{2,4})/g);
                console.log("BartBot LOG -> All Data : ")
                console.log(data.results)
                console.log("BartBot LOG -> Data Actu : ")
                console.log(globalResults)
                console.log("")
                if(releaseDate) {
                    releaseDate = match[0]
                } else {
                    releaseDate = "Unknown";
                }
                let mediaType = globalResults?.media_type
                if(ownFiles) {
                    return sendToFtp(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate), updateFolderUptobox(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate)
                } else {
                    return sendToFtp(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate)
                }
            })
        });
    } else {
        /// PROBABILIT2 PLUS ELEVER FILMS 
        let nameFolder = nameFile
        let releaseDate = "Unknown"
        let mediaType = "movie";
        if (ownFiles) {
            return sendToFtp(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate), updateFolderUptobox(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate)
        } else {
            return sendToFtp(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate)
        }
    }
}