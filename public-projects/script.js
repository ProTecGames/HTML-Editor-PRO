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
                projectCard.style.animationDelay = `${index * 0.1}s`;

                projectCard.innerHTML = `
                    <h2>${project.FileName}</h2>
                    <p>Uploaded by: ${project.Username}</p>
                    <p>Downloads: ${project.Download}</p>
                    <form class="download-form" data-download-url="${project.File}">
                        <div class="g-recaptcha" data-sitekey="6LeQ3C8qAAAAAI9hm74as6Pehi1pkEw5LQaGgyIL"></div>
                        <button type="submit" class="cta-button">Download</button>
                    </form>
                `;

                projectsContainer.appendChild(projectCard);
            });

            document.querySelectorAll('.download-form').forEach(form => {
                form.addEventListener('submit', async event => {
                    event.preventDefault();

                    const recaptchaResponse = grecaptcha.getResponse();
                    
                    if (!recaptchaResponse) {
                        alert('Please complete the reCAPTCHA');
                        return;
                    }

                    const downloadUrl = form.getAttribute('data-download-url');
                    window.location.href = downloadUrl;
                });
            });
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

particlesJS.load('particles-js', 'particles-config.json', function() {
    console.log('Particles.js config loaded');
});

document.addEventListener('DOMContentLoaded', fetchProjects);
