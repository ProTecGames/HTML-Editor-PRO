const SITE_KEY = '6LfmQTAqAAAAANucWGHhD7LDaYhH-UaP3xAdyKBG';

async function fetchProjects(endpoint) {
  try {
    grecaptcha.ready(async () => {
      try {
        const token = await grecaptcha.execute(SITE_KEY);

        const response = await fetch(`https://htmleditorpro.deno.dev/${endpoint}`, {
          method: 'GET'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === "success" && Array.isArray(data.projects)) {
            displayProjects(data.projects);
          } else {
            displayError(`Invalid response structure: ${JSON.stringify(data)}`);
          }
        } else {
          displayError(`Failed to fetch projects. Status: ${response.status}, StatusText: ${response.statusText}`);
        }
      } catch (innerError) {
        displayError(`Error fetching projects: ${innerError.message}`);
      }
    });
  } catch (error) {
    displayError(`Error initializing reCAPTCHA: ${error.message}`);
  }
}

function displayProjects(projects) {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';

  projects.forEach(project => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="text-lg font-semibold text-gray-800"><i class="fas fa-folder"></i> ${project.FileName}</div>
      <div class="text-sm text-gray-600"><i class="fas fa-file-alt"></i> ${project.File}</div>
      <div class="text-sm text-gray-600"><i class="fas fa-user"></i> ${project.Username}</div>
      <div class="text-sm text-gray-600"><i class="fas fa-download"></i> Downloads: ${project.Download}</div>
      <div class="text-sm text-gray-600"><i class="fas fa-check-circle"></i> Verified: ${project.Verified ? 'Yes' : 'No'}</div>
      <div class="text-sm text-gray-600"><i class="fas fa-id-badge"></i> UID: ${project.UID}</div>
      <a href="${project.File}" class="block mt-2 bg-blue-500 text-white text-center px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600" target="_blank"><i class="fas fa-download"></i> Download</a>
    `;
    projectList.appendChild(li);
  });
}

function displayError(message) {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = `<p class="loading text-center text-gray-600">${message}</p>`;
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
