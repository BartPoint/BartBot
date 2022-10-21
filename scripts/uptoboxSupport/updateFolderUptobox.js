import { pathFilms, pathSeries} from '../ftpSupport/info.js';
import { tokenUptobox } from './info.js';
import { getIdFolderUptobox } from './getIdFolderUptobox.js';
import { clear, error, log, warning } from '../consoleLog/global.js';
export function updateFolderUptobox(linkToStrm, nameFileOriginal, nameFolder, mediaType, releaseDate, season) {

    function uptobox_mksubdirs(fullPath) {
        let fullPathSeparete = fullPath.split('/')
            for(let i = 1; i <= fullPathSeparete.length; i++) {
                let name;
                let path;

                if(i == 1) {
                    path = "//";
                    name = fullPathSeparete[i -1];
                    createFolder(path, name, fullPathSeparete.length, i);
                }

                else if(i == 2) {
                    path = "//" + fullPathSeparete[i-2];
                    name = fullPathSeparete[i -1];
                    createFolder(path, name, fullPathSeparete.length, i);
                }

                else if(i == 3) {
                    path = "//" + fullPathSeparete[i-3] + '/' + fullPathSeparete[i-2];
                    name = fullPathSeparete[i- 1];
                    createFolder(path, name, fullPathSeparete.length, i);
                }

                else if(i == 4) {
                    path = "//" + fullPathSeparete[i-4] + '/' + fullPathSeparete[i-3] + '/' + fullPathSeparete[i-2];
                    name = fullPathSeparete[i- 1];
                    createFolder(path, name, fullPathSeparete.length, i);
                }

                else if(i == 5) {
                    path = "//" + fullPathSeparete[i-5] + '/' + fullPathSeparete[i-4] + '/' + fullPathSeparete[i-3] + '/' + fullPathSeparete[i-2];
                    name = fullPathSeparete[i- 1];
                    createFolder(path, name, fullPathSeparete.length, i);
                }
            }

            function createFolder(path, name, nb, nbOk) {
                fetch('https://uptobox.com/api/user/files', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: tokenUptobox,
                        path: path,
                        name: name
                    })
                  }) .then(response => response.body)
                  .then(stream => {
                    return new Response(stream, {
                      headers: {
                        "Content-Type": "application/json"
                      }
                    }).text();
                  })
                  .then(result => {
                    let test = JSON.parse(result)
                    if(!test.statusCode == 1) {       
                        
                        log("BartBot LOG -> Sucess : création du dossier" + path + "/" + name)
                        log(" ")
                        console.log("BartBot LOG -> Sucess : création du dossier" + path + "/" + name)
                        console.log(" ")
                        
                        if(nbOk >= nb) {
                                return getIdFolderUptobox(path, name, linkToStrm);
                        }                 
                    } else {
                        if(nbOk >= nb) {
                            function delay(time) {
                                return new Promise(resolve => setTimeout(resolve, time));
                            }
                            delay(4000).then(() => {
                                return getIdFolderUptobox(path, name, linkToStrm);
                            })
                        }
                    }
                  })
                }
    }
    if (mediaType == "movie") {
        /// FILMS -> Name -> Strm File
        let fullPath = pathFilms.replaceAll('/', '') + '/' + releaseDate + '/' + nameFolder; 

        return uptobox_mksubdirs(fullPath)

    }

    /// ENVOIE DU FICHIER (TYPE SERIES) ET CREATION DU FICHIER .STRM
    if (mediaType == "tv") {
        /// SERIES -> Name -> Saison -> Strm File
        let fullPath = pathSeries.replaceAll('/', '') + '/' + releaseDate + '/' + nameFolder + '/' + season;

        return uptobox_mksubdirs(fullPath)
    }
}