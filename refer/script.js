/* Modernized script.js with animated modals */
const serverUrl = "https://pws-0h89.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const dashboard = document.getElementById("dashboard");
    const inputSection = document.getElementById("inputSection");
    const referralCodeInput = document.getElementById("referralCode");
    const codeDisplay = document.getElementById("codeDisplay");
    const referralCountDisplay = document.getElementById("referralCount");
    const balanceDisplay = document.getElementById("balance");
});

function showDashboard() {
    const code = document.getElementById("referralCode").value.trim();
    if (!code) {
        showErrorModal("Please enter a referral code.");
        return;
    }

    fetch(`${serverUrl}/refer/count?code=${code}`)
        .then(response => response.json())
        .then(data => {
            if (data.count !== undefined) {
                codeDisplay.textContent = data.code;
                referralCountDisplay.textContent = data.count;
                balanceDisplay.textContent = data.count * 50;
                document.getElementById("dashboard").classList.remove("hidden");
                document.getElementById("inputSection").classList.add("hidden");
            } else {
                showErrorModal("Invalid referral code.");
            }
        })
        .catch(error => showErrorModal("Error fetching referral count. Please try again later."));
}

function createNewCode() {
    const newCode = generateCode();
    fetch(`${serverUrl}/refer/save?code=${newCode}`)
        .then(response => response.json())
        .then(data => {
            showSuccessModal(`New referral code created: ${data.code}`);
            document.getElementById("referralCode").value = data.code;
        })
        .catch(error => showErrorModal("Error creating referral code. Please try again later."));
}

function resetCount() {
    const code = document.getElementById("codeDisplay").textContent;
    fetch(`${serverUrl}/refer/reset?code=${code}`)
        .then(response => response.json())
        .then(data => {
            showSuccessModal(data.message);
            referralCountDisplay.textContent = "0";
            balanceDisplay.textContent = "0";
        })
        .catch(error => showErrorModal("Error resetting referral count. Please try again later."));
}

function generateCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function showErrorModal(message) {
    showModal(message, "error-modal");
}

function showSuccessModal(message) {
    showModal(message, "success-modal");
}

function showModal(message, type) {
    const modal = document.createElement("div");
    modal.className = `modal ${type} show`;
    modal.innerHTML = `<div class='modal-content'><p>${message}</p><button onclick='closeModal(this)'>OK</button></div>`;
    document.body.appendChild(modal);
}

function closeModal(button) {
    const modal = button.closest(".modal");
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 300);
}