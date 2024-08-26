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
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('projectName').textContent = data.FileName || 'N/A';
                document.getElementById('username').textContent = `Username: ${data.Username || 'N/A'}`;
                document.getElementById('verified').textContent = data.Verified === 'true' ? "Verified" : "Not Verified";
                document.getElementById('uid').textContent = `UID: ${data.UID || 'N/A'}`;
                document.getElementById('downloadCount').textContent = `Downloads: ${data.Download || '0'}`;
                document.getElementById('fileUrl').textContent = `File URL: ${data.File || 'N/A'}`;
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
