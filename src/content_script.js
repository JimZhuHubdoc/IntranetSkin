var headerBar;
var holidayRowClasses;
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
    console.log('apply');
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
    let rows = document.querySelectorAll('.robot-status.danger');
    for (let i = 0; i < rows.length; i++) {
        rows[i].className = 'getHolidayPattern(i)';
    }
}

function setClasses(options) {
    console.log('set');

    if (options.originalHeader && headerBar) {
        console.log('bar');

        headerBar.classList.add('dark-header');
    }
    if (options.originalColors) {
        console.log('colours');

        document.querySelector('body').classList.add('dark-font');
        document.querySelector('body').classList.add('dark-body');
        let rows = document.querySelectorAll('.robot-status.danger');

        for (let i = 0; i < rows.length; i++) {
            rows[i].className = getHolidayPattern(i);
        }
        console.log(rows);
    }
}

function getHolidayPattern(parity) {
    let date = new Date();
    let colourSet = ['info', 'info'];
    if (date.getMonth() == 11 && date.getDate() > 15) {
        colourSet = holidayRowClasses.christmas;
    } else if (date.getMonth() == 9 && date.getDate() > 20) {
        colourSet = holidayRowClasses.halloween;
    }
    return colourSet[parity % 2];
}
