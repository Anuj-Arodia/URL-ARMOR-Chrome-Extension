const flaggedList = document.getElementById("flaggedList");
const whitelistList = document.getElementById("whitelistList");

// Load flagged and whitelisted URLs
chrome.storage.local.get(["flaggedUrls", "whitelist"], (data) => {
    const flaggedUrls = data.flaggedUrls || [];
    const whitelist = data.whitelist || [];

    flaggedUrls.forEach(url => addToList(flaggedList, url, "flaggedUrls"));
    whitelist.forEach(url => addToList(whitelistList, url, "whitelist"));
});

function addToList(list, url, storageKey) {
    const li = document.createElement("li");
    li.textContent = url;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "12px";
    deleteBtn.addEventListener("click", () => removeFromList(url, storageKey, list, li));

    li.appendChild(deleteBtn);
    list.appendChild(li);
}

function removeFromList(url, storageKey, list, listItem) {
    chrome.storage.local.get(storageKey, (data) => {
        let urls = data[storageKey] || [];
        urls = urls.filter(item => item !== url);
        chrome.storage.local.set({ [storageKey]: urls }, () => {
            list.removeChild(listItem);
        });
    });
}

// Check URL
document.getElementById("checkBtn").addEventListener("click", () => {
    const urlInput = document.getElementById("urlInput").value.trim();
    const resultText = document.getElementById("result");

    fetch(chrome.runtime.getURL('blacklist.txt'))
      .then(response => response.text())
      .then(text => {
          let blacklist = new Set(text.split("\n").map(url => url.trim()));
          if (blacklist.has(urlInput)) {
              resultText.innerHTML = " Malicious URL detected!";
              resultText.style.color = "red";
          } else {
              resultText.innerHTML = " Safe URL!";
              resultText.style.color = "green";
          }
      });
});

// Flag URL
document.getElementById("flagBtn").addEventListener("click", () => {
    manageURL("flaggedUrls", flaggedList);
});

// Whitelist URL
document.getElementById("whitelistBtn").addEventListener("click", () => {
    manageURL("whitelist", whitelistList);
});

function manageURL(storageKey, list) {
    const url = document.getElementById("urlManageInput").value.trim();
    if (!url) return;

    chrome.storage.local.get(storageKey, (data) => {
        let urls = data[storageKey] || [];
        if (!urls.includes(url)) {
            urls.push(url);
            chrome.storage.local.set({ [storageKey]: urls }, () => {
                addToList(list, url, storageKey);
            });
        }
    });
}

// Redirect to report page
document.getElementById("reportBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("report.html") });
});
