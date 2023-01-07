function DOMtoString(document_root) {
    var html = '';
    var node = document_root.firstChild;
    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            html += node.outerHTML;
        } else if (node.nodeType === Node.TEXT_NODE) {
            html += node.textContent;
        }
        node = node.nextSibling;
    }
    return html;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});