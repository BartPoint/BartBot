export const settings = {
    clientKey: '12345678901234567890123456789012',
    websiteSToken: null,
    recaptchaDataSValue: null,
    phrase: null,
    case: null,
    numeric: null,
    math: null,
    minLength: null,
    maxLength: null,
    languagePool: null,
    comment: null,
    connectionTimeout: 20,
    firstAttemptWaitingInterval: 5,
    normalWaitingInterval: 2,
    isVerbose: true,
    taskId: 0,
    funcaptchaApiJSSubdomain: null,
    funcaptchaDataBlob: null,
    softId: 0
};

export const setAPIKey = key => {
    settings.clientKey = key;
};

export const shutUp = () => {
    settings.isVerbose = false;
};

export const setSoftId = softId => {
    settings.softId = softId;
};

export const getBalance = () => {
    return new Promise((resolve, reject) => {
        JSONRequest('getBalance', {
                clientKey: settings.clientKey
            })
            .then(res => resolve(res.balance))
            .catch(err => reject(err));
    });
};

export const solveRecaptchaV2Proxyless = (websiteURL, websiteKey, isInvisible = false) => {
    return new Promise((resolve, reject) => {
        let task = {
            type: 'RecaptchaV2TaskProxyless',
            websiteURL: websiteURL,
            websiteKey: websiteKey,
            websiteSToken: settings.websiteSToken,
            recaptchaDataSValue: settings.recaptchaDataSValue
        };
        if (isInvisible === true) {
            task['isInvisible'] = true;
        }
        JSONRequest('createTask', {
                clientKey: settings.clientKey,
                task: task,
                softId: settings.softId
            })
            .then(res => {
                settings.taskId = res.taskId;
                return waitForResult(res.taskId);
            })
            .then(solution => {
                if (solution.cookies) {
                    settings.cookies = solution.cookies;
                }
                resolve(solution.gRecaptchaResponse);
            })
            .catch(err => reject(err));
    });
};

export const waitForResult = taskId => {
    return new Promise((resolve, reject) => {
        (async () => {
            if (settings.isVerbose) console.log(`created task with ID ${taskId}`);
            if (settings.isVerbose) console.log(`waiting ${settings.firstAttemptWaitingInterval} seconds`);
            await delay(settings.firstAttemptWaitingInterval * 1000);

            while (taskId > 0) {
                await JSONRequest('getTaskResult', {
                        clientKey: settings.clientKey,
                        taskId: taskId
                    })
                    .then(response => {
                        if (response.status === 'ready') {
                            taskId = 0;
                            resolve(response.solution);
                        }
                        if (response.status === 'processing') {
                            if (this.settings.isVerbose) console.log('captcha result is not yet ready');
                        }
                    })
                    .catch(error => {
                        taskId = 0;
                        reject(error);
                    });


                if (this.settings.isVerbose) console.log('waiting ' + this.settings.normalWaitingInterval + ' seconds');
                await this.delay(this.settings.normalWaitingInterval * 1000);

            }

        })();


    });

};

function JSONRequest(methodName, payLoad) {
    return new Promise((resolve, reject) => {
        fetch('https://api.anti-captcha.com/' + methodName, {
            method: 'POST',
            body: JSON.stringify(payLoad),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Accept: 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error))
    });
}

export const getCookies = () => {
    return settings.cookies;
};

export const delay = time => {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
};