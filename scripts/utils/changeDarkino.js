function changeDisplaySourse() {
    let test = document.getElementById("sourse-1");
    test.classList.add("active", "show");
}

chrome.runtime.sendMessage({
    action: "changeDisplaySourse",
    source: changeDisplaySourse()
});