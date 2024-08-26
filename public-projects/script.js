// Function to initialize particles.js
function initParticles() {
    particlesJS.load('particles-js', 'particles-config.json', function() {
        console.log('Particles.js config loaded');
    });
}

// Function to handle CAPTCHA success
function onCaptchaSuccess(downloadUrl) {
    document.getElementById('captcha-modal').style.display = 'none';
    window.location.href = downloadUrl;
}

// Function to close CAPTCHA modal
function closeCaptchaModal() {
    document.getElementById('captcha-modal').style.display = 'none';
}

// Function to handle download button click
async function handleDownloadClick(downloadUrl) {
    grecaptcha.execute();
    window.__captchaSuccess = () => onCaptchaSuccess(downloadUrl);
}

// Function to fetch and display projects
async function fetchProjects() {
    try {
        const response = await fetch('https://htmleditorpro.deno.dev/projects');
        const data = await response.json();

        if (data.status === 'success') {
            const projectsContainer = document.getElementById('projects-container');
            projectsContainer.innerHTML = '';

            data.projects.forEach((project, index) => {
                const projectCard = document.createElement('div');
                projectCard.className = 'card animate';
                projectCard.style.animationDelay = `${index * 0.1}s`; // Staggered animations

                projectCard.innerHTML = `
                    <h2>${project.FileName}</h2>
                    <p>Uploaded by: ${project.Username}</p>
                    <p>Downloads: ${project.Download}</p>
                    <a href="#" onclick="handleDownloadClick('${project.File}'); return false;">View File</a>
                `;

                projectsContainer.appendChild(projectCard);
            });
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Function to perform a search
async function performSearch() {
    const query = document.getElementById('search-box').value.trim();

    if (query) {
        try {
            const response = await fetch(`https://htmleditorpro.deno.dev/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.status === 'success') {
                const resultsContainer = document.getElementById('search-results');
                resultsContainer.innerHTML = '';

                data.projects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'card animate';

                    projectCard.innerHTML = `
                        <h2>${project.FileName}</h2>
                        <p>Uploaded by: ${project.Username}</p>
                        <p>Downloads: ${project.Download}</p>
                        <a href="#" onclick="handleDownloadClick('${project.File}'); return false;">View File</a>
                    `;

                    resultsContainer.appendChild(projectCard);
                });
            }
        } catch (error) {
            console.error('Error performing search:', error);
        }
    }
}

// Function to fetch and display the leaderboard
async function fetchLeaderboard() {
    try {
        const response = await fetch('https://htmleditorpro.deno.dev/leaderboard');
        const data = await response.json();

        if (data.status === 'success') {
            const leaderboardContainer = document.getElementById('leaderboard');
            leaderboardContainer.innerHTML = '';

            data.projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'card';

                projectCard.innerHTML = `
                    <h2>${project.FileName}</h2>
                    <p>Uploaded by: ${project.Username}</p>
                    <p>Downloads: ${project.Download}</p>
                `;

                leaderboardContainer.appendChild(projectCard);
            });
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    fetchProjects();
});

// Function to handle search modal visibility
function openSearchModal() {
    document.getElementById('search-modal').style.display = 'flex';
}

// Function to handle leaderboard modal visibility
function openLeaderboardModal() {
    document.getElementById('leaderboard-modal').style.display = 'flex';
}
