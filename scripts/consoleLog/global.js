let globalRef = document.getElementById('consoleLog');

export function log() {
    let args = Array.prototype.slice.call(arguments);
    let log = args.join(' ');
    globalRef.insertAdjacentHTML("beforeend", ` > ` + log + ` \n`);
}

export function warning() {
    let args = Array.prototype.slice.call(arguments);
    let log = args.join(' ');
    globalRef.insertAdjacentHTML("beforeend", `  ⚠️ > ` + log + ` \n`);
}

export function error() {
    let args = Array.prototype.slice.call(arguments);
    let log = args.join(' ');
    globalRef.insertAdjacentHTML("beforeend", `❌ > ` + log + ` \n`);
}
export function clear() {
    globalRef.innerHTML = ''; /// Pas beau mais fonctionnel !

    /// globalRef.insertAdjacentHTML("beforeend", ` \n`); a tester
}
