


chrome.tabs.onUpdated.addListener((a) => {

        chrome.scripting.executeScript({
            target: {tabId: a},
            files: ['match.js']
        })

});



