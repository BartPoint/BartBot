import { tokenUptobox } from './info.js';
import { mooveFileToFolder } from './mooveFileToFolder.js';
import { clear, error, log, warning } from '../consoleLog/global.js';

export function getIdFolderUptobox(path, name, linkToStrm) {
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    delay(500).then(() => {
        
        log("BartBot LOG -> Path Uptobox : " + path)
        log(" ")
        console.log("BartBot LOG -> Path Uptobox : " + path)
        console.log(" ")

        fetch('https://uptobox.com/api/user/files?token=' + tokenUptobox + '&path=' + path + '/' + name + '&limit=50').then(function (response) {
            if (response.status !== 200) {
                log('BartBot LOG -> Erreur Status Code : ' + response.status);
                console.log('BartBot LOG -> Erreur Status Code : ' + response.status);
                return;
            }
            response.text().then(function (data) {
                data = JSON.parse(data)
                log("BartBot LOG -> Sucess : ");
                log(JSON.stringify(data))
                log("BartBot LOG -> Informations Supplémentaires : ")
                log(JSON.stringify(data.data.currentFolder))
                log(" ")
                console.log("BartBot LOG -> Sucess : ");
                console.log(data)
                console.log("BartBot LOG -> Informations Supplémentaires : ")
                console.log(data.data.currentFolder)
                console.log(" ")
                let idFolder = data.data.currentFolder.fld_id;
                return mooveFileToFolder(path, name, linkToStrm, idFolder);
            })
        }).catch(function (error) {
            error(JSON.stringify(error));
            console.log(error);
        });
    })
}