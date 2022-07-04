/* Import Function */

import { fileSave } from './module/browser-fs-access/browser-fs-access.js';

export function saveStrmFile(linkToStrm, nameFile) {

    if (linkToStrm !== undefined && linkToStrm !== '' && nameFile !== undefined && nameFile !== '') {

        let data = new Blob([linkToStrm]);

        fileSave(data, {
            fileName: nameFile + '.strm',
            extensions: ['.strm'],
        });
    }
}