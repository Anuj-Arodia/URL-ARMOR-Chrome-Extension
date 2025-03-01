let blacklist = new Set();
let whitelist = new Set();
let flaggedUrls = new Set();
let logs = [];

// Load stored flagged and whitelisted URLs
chrome.storage.local.get(["flaggedUrls", "whitelist"], (data) => {
    flaggedUrls = new Set(data.flaggedUrls || []);
    whitelist = new Set(data.whitelist || []);
});

// Load blacklist
fetch(chrome.runtime.getURL('blacklist.txt'))
  .then(response => response.text())
  .then(text => {
    blacklist = new Set(text.split("\n").map(url => url.trim()));
  });

chrome.webNavigation.onCompleted.addListener((details) => {
    const { url } = details;

    if (blacklist.has(url) || flaggedUrls.has(url)) {
        if (!whitelist.has(url)) {
            chrome.action.setIcon({ path: "icon-danger.png" });
            logs.push({ url, timestamp: new Date().toISOString() });
            chrome.storage.local.set({ logs });

            // Redirect to warning page
            chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("warning.html") });
        } else {
            chrome.action.setIcon({ path: "icon-safe.png" });
        }
    }
});
