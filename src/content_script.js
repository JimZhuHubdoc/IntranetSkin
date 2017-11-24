let headerBar;
let holidayRowClasses;
let logoURL;
function initOnce() {
    holidayRowClasses = {
        christmas: ['christmas-even', 'christmas-odd'],
        halloween: ['halloween-even', 'halloween-odd']
    };
    // check if element exists yet
    headerBar = document.querySelector('body nav div');
    if (headerBar) {
        // element exists, remove the event listeners so we don't run this twice
        document.removeEventListener('DOMNodeInserted', initOnce);
        document.removeEventListener('DOMContentLoaded', initOnce);

        // send a message to the background script to enable the page action
        chrome.runtime.sendMessage('enable_page_action', function() {});
        logoURL = document.querySelector('body nav div img').src;
    }
    applyStyle();
}

// event listeners
document.addEventListener('DOMNodeInserted', initOnce);
document.addEventListener('DOMContentLoaded', initOnce);

// listen for messages from the background script to update
chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    if (message === 'apply_style') {
        applyStyle();
    }
});

function applyStyle() {
    chrome.storage.sync.get(
        {
            enabled: true,
            originalHeader: true,
            shortHeader: true,
            shortSearchBox: true,
            originalColors: true
        },
        function(options) {
            resetClasses();
            if (options.enabled) {
                setClasses(options);
            }
        }
    );
}

function resetClasses() {
    headerBar.classList.remove('dark-header');
    document.querySelector('body').classList.remove('dark-font');
    document.querySelector('body').classList.remove('dark-body');
    document.querySelector('body nav div img').src = logoURL;
    // let rows = document.querySelectorAll('.robot-status.danger');
    // for (let i = 0; i < rows.length; i++) {
    //     rows[i].className = getHolidayPattern(i);
    // }
}

function setClasses(options) {
    if (options.originalHeader && headerBar) {
        logo = document.querySelector('body nav div img');
        logo.src = chrome.runtime.getURL('../assets/logo.png');
        headerBar.classList.add('dark-header');
    }
    if (options.originalColors) {
        document.querySelector('body').classList.add('dark-font');
        document.querySelector('body').classList.add('dark-body');
        // let rows = document.querySelectorAll('.robot-status.danger');

        // for (let i = 0; i < rows.length; i++) {
        //     rows[i].className = getHolidayPattern(i);
        // }
    }
}

function getHolidayPattern(parity) {
    let date = new Date('Dec 25 2017');
    let colourSet = ['danger', 'danger'];
    if (date.getMonth() == 11 && date.getDate() > 15) {
        colourSet = holidayRowClasses.christmas;
    } else if (date.getMonth() == 9 && date.getDate() > 20) {
        colourSet = holidayRowClasses.halloween;
    }
    return colourSet[parity % 2];
}
