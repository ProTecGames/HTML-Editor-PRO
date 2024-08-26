window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('projectId');
  
  if (projectId) {
    fetch(`https://htmleditorpro.deno.dev/info?projectId=${projectId}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          document.getElementById('project-title').textContent = data.FileName;
          document.getElementById('project-username').textContent = `Username: ${data.Username}`;
          document.getElementById('project-uid').textContent = `UID: ${data.UID}`;
          document.getElementById('project-verified').textContent = `Verified: ${data.Verified}`;
          document.getElementById('project-downloads').textContent = `Downloads: ${data.Download}`;
        } else {
          console.error('Failed to fetch project details:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    console.error('No projectId provided.');
  }
};
