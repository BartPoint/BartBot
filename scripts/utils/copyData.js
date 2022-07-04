export function allCopy() {
    /* Copy ALL DATA */

    document.getElementById('copy-text').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('resultatArea').select();
        var copied;

        try {
            copied = document.execCommand('copy');
        } catch (ex) {
            copied = false;
        }
        if (copied) {
            let copied_text = document.getElementById('copied-text')
            copied_text.style.display = 'block';
            setTimeout(function () {
                copied_text.style.display = 'none';
            }, 2500);
        }
    })

    /* Copy ONLY LINK */
    document.getElementById('copy-text-link').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('resultatArea').select();
        var copied;

        try {
            let value = document.getElementById('resultatArea').value;
            let regexMatch = /https:\/\/(.*)/gm;
            let matches = value.match(regexMatch)
            let toCopy = [];
            if (matches == null) {
                let copied_text = document.getElementById('copied-text-error')
                copied_text.style.display = 'block';
                setTimeout(function () {
                    copied_text.style.display = 'none';
                }, 2500);
            } else {
                for (const match of matches) {
                    toCopy.push(match)
                }
                value = toCopy.toString().replaceAll(",", "\n");
                let TempText = document.createElement("textarea");
                TempText.value = value
                document.body.appendChild(TempText);
                TempText.select();
                copied = document.execCommand("copy");
                document.body.removeChild(TempText);
            }
        } catch (ex) {
            copied = false;
        }
        if (copied) {
            let copied_text = document.getElementById('copied-text-link')
            copied_text.style.display = 'block';
            setTimeout(function () {
                copied_text.style.display = 'none';
            }, 2500);
        }
    })
}