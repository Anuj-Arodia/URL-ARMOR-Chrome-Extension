const suspiciousList = document.getElementById("suspiciousList");

chrome.storage.local.get("suspiciousUsers", (data) => {
    const suspiciousUsers = data.suspiciousUsers || [];

    suspiciousUsers.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user;
        const delBtn = document.createElement("button");
        delBtn.textContent = "   ❌";
        delBtn.onclick = () => removeSuspicious(user);
        li.appendChild(delBtn);
        suspiciousList.appendChild(li);
    });
});

document.getElementById("addSuspicious").addEventListener("click", () => {
    const user = document.getElementById("suspiciousInput").value.trim();
    if (user) {
        chrome.storage.local.get("suspiciousUsers", (data) => {
            const suspiciousUsers = data.suspiciousUsers || [];
            suspiciousUsers.push(user);
            chrome.storage.local.set({ suspiciousUsers }, () => location.reload());
        });
    }
});

function removeSuspicious(user) {
    chrome.storage.local.get("suspiciousUsers", (data) => {
        let suspiciousUsers = data.suspiciousUsers || [];
        suspiciousUsers = suspiciousUsers.filter(item => item !== user);
        chrome.storage.local.set({ suspiciousUsers }, () => location.reload());
    });
}
