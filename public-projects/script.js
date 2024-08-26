document.addEventListener('DOMContentLoaded', async () => {
    loadProjects();
    document.getElementById('search-input').addEventListener('keydown', handleSearch);
});

async function loadProjects(query = '') {
    const response = await fetch(`/search?q=${query}`);
    const result = await response.json();
    if (result.status === 'success') {
        displayProjects(result.projects);
    }
}

function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card animate';
        card.innerHTML = `
            <h2>${project.FileName}</h2>
            <p>Uploaded by: ${project.Username}</p>
            <button onclick="handleDownload('${project.projectId}', '${project.File}')">Download</button>
        `;
        container.appendChild(card);
    });
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        loadProjects(query);
    }
}

let downloadUrl = '';

function handleDownload(projectId, fileUrl) {
    downloadUrl = fileUrl;
    document.getElementById('captcha-modal').style.display = 'block';
}

function onCaptchaSuccess() {
    document.getElementById('captcha-modal').style.display = 'none';
    window.location.href = downloadUrl;
    fetch(`/increase?projectId=${projectId}`)
        .then(response => response.json())
        .then(data => console.log('Download count increased:', data))
        .catch(error => console.error('Error increasing download count:', error));
}

function closeCaptchaModal() {
    document.getElementById('captcha-modal').style.display = 'none';
}
