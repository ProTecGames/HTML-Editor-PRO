document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadLeaderboard();

    document.getElementById('search-button').addEventListener('click', searchProjects);
});

function loadProjects() {
    fetch('https://htmleditorpro.deno.dev/projects')
        .then(response => response.json())
        .then(data => {
            const projectsList = document.getElementById('projects-list');
            projectsList.innerHTML = '';
            data.projects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsList.appendChild(projectCard);
            });
        });
}

function loadLeaderboard() {
    fetch('https://htmleditorpro.deno.dev/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboard = document.getElementById('leaderboard');
            leaderboard.innerHTML = '';
            data.projects.forEach(project => {
                const projectCard = createProjectCard(project);
                leaderboard.appendChild(projectCard);
            });
        });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card animate';
    card.innerHTML = `
        <h2>${project.FileName}</h2>
        <p>Uploaded by: ${project.Username}</p>
        <p>Downloads: ${project.Download}</p>
        <div class="g-recaptcha" data-sitekey="6LeQ3C8qAAAAAI9hm74as6Pehi1pkEw5LQaGgyIL" data-callback="onCaptchaSuccess"></div>
        <a href="#" onclick="incrementDownload('${project.projectId}')">Download</a>
    `;
    return card;
}

function searchProjects() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    if (!query) return;

    fetch(`https://htmleditorpro.deno.dev/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            const projectsList = document.getElementById('projects-list');
            projectsList.innerHTML = '';
            data.projects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsList.appendChild(projectCard);
            });
        });
}

function incrementDownload(projectId) {
    if (grecaptcha.getResponse() === '') {
        alert('Please complete the CAPTCHA');
        return;
    }
    
    fetch(`https://htmleditorpro.deno.dev/increase?projectId=${projectId}`)
        .then(response => response.json())
        .then(data => {
            alert(`Download count updated: ${data.download}`);
            loadProjects();
            loadLeaderboard();
        });
}

function onCaptchaSuccess() {
    console.log('CAPTCHA successful');
}
