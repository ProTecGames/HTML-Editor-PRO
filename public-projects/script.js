const SITE_KEY = '6LfmQTAqAAAAANucWGHhD7LDaYhH-UaP3xAdyKBG';  // Replace with your Google reCAPTCHA site key

async function fetchProjects() {
  try {
    // Execute reCAPTCHA and get a token
    const token = await grecaptcha.execute(SITE_KEY);
    
    const response = await fetch('https://htmleditorpro.deno.dev/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      displayProjects(data.projects);
    } else {
      console.error('Failed to fetch projects');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayProjects(projects) {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';

  projects.forEach(project => {
    const li = document.createElement('li');
    li.textContent = `Project ID: ${project.projectId}, File: ${project.FileName}`;
    projectList.appendChild(li);
  });
}

// Load projects when the page loads
window.onload = fetchProjects;
