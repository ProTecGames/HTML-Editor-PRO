/* script.js */
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
        alert("Please enter a referral code.");
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
                alert("Invalid referral code.");
            }
        })
        .catch(error => console.error("Error fetching referral count:", error));
}

function createNewCode() {
    const newCode = generateCode();
    fetch(`${serverUrl}/refer/save?code=${newCode}`)
        .then(response => response.json())
        .then(data => {
            alert(`New referral code created: ${data.code}`);
            document.getElementById("referralCode").value = data.code;
        })
        .catch(error => console.error("Error creating referral code:", error));
}

function resetCount() {
    const code = document.getElementById("codeDisplay").textContent;
    fetch(`${serverUrl}/refer/reset?code=${code}`)
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            referralCountDisplay.textContent = "0";
            balanceDisplay.textContent = "0";
        })
        .catch(error => console.error("Error resetting referral count:", error));
}

function generateCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}
