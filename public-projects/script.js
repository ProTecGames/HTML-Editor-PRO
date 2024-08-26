const baseUrl = "https://htmleditorpro.deno.dev";

async function fetchProjects() {
    const response = await fetch(`${baseUrl}/projects`);
    const data = await response.json();
    if (data.status === "success") {
        displayProjects(data.projects);
    } else {
        console.error("Failed to load projects:", data.message);
    }
}

function displayProjects(projects) {
    const container = document.getElementById("projects-container");
    container.innerHTML = ""; // Clear existing content

    projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "card animate";
        card.innerHTML = `
            <h2>${project.FileName}</h2>
            <p>Uploaded by: ${project.Username}</p>
            <p>Downloads: ${project.Download}</p>
            <a href="#" onclick="handleDownload('${project.projectId}')">Download</a>
        `;
        container.appendChild(card);
    });
}

async function handleSearch(event) {
    if (event.key === "Enter") {
        const query = document.getElementById("search-input").value;
        const response = await fetch(`${baseUrl}/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.status === "success") {
            displayProjects(data.projects);
        } else {
            console.error("Search failed:", data.message);
        }
    }
}

function handleDownload(projectId) {
    showCaptchaModal(projectId);
}

function showCaptchaModal(projectId) {
    const modal = document.getElementById("captcha-modal");
    modal.style.display = "block";
    window.currentProjectId = projectId; // Store the current projectId globally
}

function closeCaptchaModal() {
    const modal = document.getElementById("captcha-modal");
    modal.style.display = "none";
}

function onCaptchaSuccess() {
    const projectId = window.currentProjectId;
    fetch(`${baseUrl}/increase?projectId=${projectId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                window.location.href = `https://your-download-url/${projectId}`;
            } else {
                console.error("Failed to increase download count:", data.message);
            }
        })
        .catch(error => console.error("Error during download increment:", error));
    closeCaptchaModal();
}

document.addEventListener("DOMContentLoaded", fetchProjects);
