window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (projectId) {
        fetchProjectDetails(projectId);
    } else {
        document.getElementById('projectName').textContent = "Invalid Project ID";
        document.getElementById('username').textContent = "No data available.";
    }
};

function fetchProjectDetails(projectId) {
    fetch(`https://htmleditorpro.deno.dev/info?projectId=${projectId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('projectName').textContent = data.FileName;
                document.getElementById('username').textContent = `Username: ${data.Username}`;
                document.getElementById('verified').textContent = data.Verified ? "Verified" : "Not Verified";
                document.getElementById('uid').textContent = `UID: ${data.UID}`;
                document.getElementById('downloadCount').textContent = `Downloads: ${data.Download}`;
                
            } else {
                document.getElementById('projectName').textContent = "Project Not Found";
                document.getElementById('username').textContent = "No data available.";
            }
        })
        .catch(error => {
            console.error("Error fetching project details:", error);
            document.getElementById('projectName').textContent = "Error loading project";
            document.getElementById('username').textContent = "Please try again later.";
        });
}

function downloadApp() {
    window.open('https://play.google.com/store/apps/details?id=com.protecgames.htmleditor', '_blank');
}
