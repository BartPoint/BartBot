const e = async e => {
    const t = await e.getFile();
    return t.handle = e, t
};
var t = async (t = [{}]) => {
    Array.isArray(t) || (t = [t]);
    const i = [];
    t.forEach((e, t) => {
        i[t] = {
            description: e.description || "",
            accept: {}
        }, e.mimeTypes ? e.mimeTypes.map(a => {
            i[t].accept[a] = e.extensions || []
        }) : i[t].accept["*/*"] = e.extensions || []
    });
    const a = await window.showOpenFilePicker({
            id: t[0].id,
            startIn: t[0].startIn,
            types: i,
            multiple: t[0].multiple || !1,
            excludeAcceptAllOption: t[0].excludeAcceptAllOption || !1
        }),
        c = await Promise.all(a.map(e));
    return t[0].multiple ? c : c[0]
};
export {
    t as
    default
};