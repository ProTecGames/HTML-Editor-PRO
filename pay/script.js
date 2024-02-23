// index.js

document.addEventListener("DOMContentLoaded", function() {
    const hero = document.querySelector('.hero');
    hero.style.backgroundColor = '#007bff'; // Blue color
});

paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '6.00' // Payment amount
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            var uid = document.getElementById('uid').value;
            appendToAccountsJSON(uid);
        });
    }
}).render('#paypal-button-container');

async function appendToAccountsJSON(uid) {
    const sha = await getAccountsJsonSha();
    if (sha) {
        fetch('https://api.github.com/repos/ProTecGames/HTML-Editor-PRO/contents/app/accounts.json', {
            method: 'GET',
            headers: {
                'Authorization': 'token ' + process.env.GITHUB_ACCESS_TOKEN
            }
        })
        .then(response => response.json())
        .then(data => {
            data["PREMIUM ACCOUNTS"].push(uid);
            updateAccountsJSON(data, sha);
            alert("Payment successful! Please take a screenshot for future use.");
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error('Unable to fetch SHA of accounts.json');
    }
}

function updateAccountsJSON(data, sha) {
    fetch('https://api.github.com/repos/ProTecGames/HTML-Editor-PRO/contents/app/accounts.json', {
        method: 'PUT',
        headers: {
            'Authorization': 'token ' + process.env.GITHUB_ACCESS_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Add UID to accounts.json',
            content: btoa(JSON.stringify(data)),
            sha: sha
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('UID appended successfully:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to fetch the SHA value of the accounts.json file
function getAccountsJsonSha() {
    return fetch('https://api.github.com/repos/ProTecGames/HTML-Editor-PRO/contents/app/accounts.json')
        .then(response => response.json())
        .then(data => {
            return data.sha;
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}
