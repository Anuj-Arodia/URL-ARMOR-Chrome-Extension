setTimeout(() => {
    chrome.action.setPopup({ popup: "popup.html" }); // Set the real popup
    window.close(); // Close the splash screen
}, 2000);
