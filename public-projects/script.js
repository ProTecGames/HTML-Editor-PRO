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
                `;

                projectsContainer.appendChild(projectCard);
            });
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Initialize particles.js
particlesJS.load('particles-js', 'particles-config.json', function() {
    console.log('Particles.js config loaded');
});

document.addEventListener('DOMContentLoaded', fetchProjects);
