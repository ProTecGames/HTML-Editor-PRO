const SITE_KEY = '6LfmQTAqAAAAANucWGHhD7LDaYhH-UaP3xAdyKBG';

async function fetchProjects(endpoint) {
  try {
    await grecaptcha.ready();
    const token = await grecaptcha.execute(SITE_KEY);
    
    const response = await fetch(`https://htmleditorpro.deno.dev/${endpoint}`, {
      method: 'GET'
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.projects)) {
        displayProjects(data.projects);
      } else {
        displayError('Invalid response structure');
      }
    } else {
      displayError('Failed to fetch projects');
    }
  } catch (error) {
    displayError('Error fetching projects');
  }
}

function displayProjects(projects) {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';

  projects.forEach(project => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="project-name">Project Name: ${project.FileName}</div>
      <div class="file-name">File Name: ${project.File}</div>
      <div class="downloads">Download Count: ${project.Download}</div>
      <div class="verified">Verified: ${project.Verified ? 'Yes' : 'No'}</div>
      <div class="uid">UID: ${project.UID}</div>
    `;
    projectList.appendChild(li);
  });
}

function displayError(message) {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = `<p class="loading">${message}</p>`;
}

document.getElementById('load-projects').addEventListener('click', () => {
  fetchProjects('projects');
});

document.getElementById('load-leaderboard').addEventListener('click', () => {
  fetchProjects('leaderboard');
});

document.getElementById('search-projects').addEventListener('click', () => {
  const query = document.getElementById('search-query').value.trim();
  if (query) {
    fetchProjects(`search?q=${encodeURIComponent(query)}`);
  } else {
    displayError('Please enter a search query');
  }
});

window.onload = () => fetchProjects('projects');
