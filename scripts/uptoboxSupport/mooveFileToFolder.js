import { tokenUptobox } from './info.js';
import { clear, error, log, warning } from '../consoleLog/global.js';

export function mooveFileToFolder(path, name, linkToStrm, idFolder) {

    let idUptobox = linkToStrm.replaceAll(/.*=|.*\//gm, "");
    
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    delay(500).then(() => {
        fetch('https://uptobox.com/api/user/files', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: tokenUptobox,
                    file_codes: idUptobox,
                    destination_fld_id: idFolder,
                    action: 'move'
                })
            }).then(response => response.body)
            .then(stream => {
                return new Response(stream, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).text();
            })
            .then(result => {
                let resultat = JSON.parse(result)
                if (resultat.statusCode == 1) {
                    log("BartBot LOG -> Erreur : " + resultat)
                    log(" ")
                    console.log("BartBot LOG -> Erreur : " + resultat)
                    console.log(" ")
                } else {
                    log("BartBot LOG -> Sucess : déplacement du fichier vers " + path + "/" + name)
                    log(" ")
                    console.log("BartBot LOG -> Sucess : déplacement du fichier vers " + path + "/" + name)
                    console.log(" ")
                }
            })
    })
}
