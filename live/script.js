const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid');

fetch(`https://html-backend.cyclic.app/cast?uid=${uid}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('HTML code not found');
        }
        return response.text();
    })
    .then(htmlCode => {
        document.body.innerHTML = htmlCode;
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = '/404.html';
    });
