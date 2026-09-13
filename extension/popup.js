
const SERVER_URL = API_URL;

// When opening the popup, look if there is an active account
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["email", "token"], (result) => {
        if (result.email) {
            document.getElementById("status").textContent = `Aktiver Account: ${result.email}`;
        }
    });
});

document.getElementById("generateBtn").addEventListener("click", async () => {
    const statusDiv = document.getElementById("status");
    statusDiv.textContent = "Ask Server...";

    try {
        const response = await fetch(`${SERVER_URL}/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Servererror");

        statusDiv.textContent = `success: ${data.email}`;

        // safe token and email in the storage
        chrome.storage.local.set({ token: data.token, email: data.email });

        // Send data to the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "fillForm",
                email: data.email,
                password: data.password
            });
        });

    } catch (error) {
        statusDiv.textContent = `Fehler: ${error.message}`;
    }
});

document.getElementById("checkInboxBtn").addEventListener("click", async () => {
    const inboxDiv = document.getElementById("inbox");
    inboxDiv.textContent = "Load Mails...";

    chrome.storage.local.get(["token"], async (result) => {
        if (!result.token) {
            inboxDiv.textContent = "No Account.";
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/check_inbox`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: result.token })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            if (data.messages.length === 0) {
                inboxDiv.textContent = "Postfach ist leer.";
            } else {
                inboxDiv.innerHTML = data.messages.map(m => `
                    <div style="border-bottom: 1px solid #ccc; margin-bottom: 8px; padding-bottom: 4px;">
                        <b>Von:</b> ${m.from}<br>
                        <b>Betreff:</b> ${m.subject}<br>
                        <b>Inhalt:</b> <div style="background:#fff; padding:4px; max-height:80px; overflow-y:auto;">${m.text || m.intro}</div>
                    </div>
                `).join("");
            }
        } catch (error) {
            inboxDiv.textContent = `Error: ${error.message}`;
        }
    });
});