// Fetch and display projects
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
                    <a href="${project.File}" target="_blank">View File</a>
                    <button onclick="handleDownload('${project.projectId}')">Download</button>
                `;

                projectsContainer.appendChild(projectCard);
            });
        } else {
            console.error('Failed to fetch projects:', data.message);
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Handle project download request
function handleDownload(projectId) {
    showCaptchaModal(projectId);
}

// Show CAPTCHA modal
function showCaptchaModal(projectId) {
    const modal = document.getElementById('captcha-modal');
    modal.style.display = 'flex';
    window.currentProjectId = projectId;
}

// Close CAPTCHA modal
function closeCaptchaModal() {
    const modal = document.getElementById('captcha-modal');
    modal.style.display = 'none';
}

// Callback for CAPTCHA success
function onCaptchaSuccess() {
    const projectId = window.currentProjectId;
    fetch(`https://htmleditorpro.deno.dev/increase?projectId=${projectId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Redirect to project URL or download page
                window.location.href = `https://htmleditorpro.deno.dev/download/${projectId}`; // Adjust URL if needed
            } else {
                console.error('Failed to increase download count:', data.message);
            }
        })
        .catch(error => console.error('Error during download increment:', error));
    closeCaptchaModal();
}

// Initialize particles.js
particlesJS.load('particles-js', 'particles-config.json', function() {
    console.log('Particles.js config loaded');
});

// Fetch projects on page load
document.addEventListener('DOMContentLoaded', fetchProjects);
