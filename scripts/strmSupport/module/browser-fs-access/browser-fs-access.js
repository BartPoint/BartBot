const e = (() => {
        if ("undefined" == typeof self) return !1;
        if ("top" in self && self !== top) try {
            top
        } catch (e) {
            return !1
        } else if ("showOpenFilePicker" in self) return "showOpenFilePicker";
        return !1
    })(),
    t = e ? import("./file-open-002ab408.js") : import("./file-open-7c801643.js");
async function n(...e) {
    return (await t).default(...e)
}
const i = e ? import("./directory-open-4ed118d0.js") : import("./directory-open-01563666.js");
async function r(...e) {
    return (await i).default(...e)
}
const o = e ? import("./file-save-745eba88.js") : import("./file-save-3189631c.js");
async function s(...e) {
    return (await o).default(...e)
}
export {
    r as directoryOpen, n as fileOpen, s as fileSave, e as supported
};
