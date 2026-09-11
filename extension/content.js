chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillForm") {
        const emailField = document.querySelector('input[type="email"], input[name*="mail"], input[id*="mail"]');
        const userField = document.querySelector('input[name*="user"], input[name*="login"], input[id*="user"]');
        const passwordFields = document.querySelectorAll('input[type="password"]');

        if (emailField) {
            emailField.value = request.email;
            emailField.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (userField && request.username) {
            userField.value = request.username;
            userField.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (passwordFields.length > 0) {
            passwordFields[0].value = request.password;
            passwordFields[0].dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (passwordFields.length > 1) {
            passwordFields[1].value = request.password;
            passwordFields[1].dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
});