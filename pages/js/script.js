document.addEventListener('DOMContentLoaded', function () {
  // Load the JSON data
  fetch('/pages/json/projects.json')
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          // Ensure the container exists
          const projectsContainer = document.getElementById('projects-container');
          if (!projectsContainer) {
              throw new Error('projects-container element not found in the DOM.');
          }

          // Check if the data has a projects array
          if (!Array.isArray(data.projects)) {
              throw new Error('Invalid JSON format: Expected data.projects to be an array.');
          }

          // Loop through each project and create HTML elements
          data.projects.forEach(project => {
              const projectArticle = document.createElement('article');
              projectArticle.classList.add('project');

              // Add company name
              if (project.companyName) {
                  const companyName = document.createElement('div');
                  companyName.classList.add('company-name');
                  companyName.textContent = project.companyName;
                  projectArticle.appendChild(companyName);
              }

              // Add project title
              if (project.projectName) {
                  const projectTitle = document.createElement('h3');
                  projectTitle.textContent = project.projectName;
                  projectArticle.appendChild(projectTitle);
              }

              // Add project tags
              if (Array.isArray(project.tags)) {
                  const projectMeta = document.createElement('div');
                  projectMeta.classList.add('project-meta');
                  project.tags.forEach(tag => {
                      const tagSpan = document.createElement('span');
                      tagSpan.textContent = tag;
                      projectMeta.appendChild(tagSpan);
                  });
                  projectArticle.appendChild(projectMeta);
              }

              // Add 'View Work' link
              if (project.projectLink) {
                  const viewWorkLink = document.createElement('a');
                  viewWorkLink.classList.add('view-work');
                  viewWorkLink.href = project.projectLink;
                  viewWorkLink.textContent = 'View Work';
                  projectArticle.appendChild(viewWorkLink);
              }

              // Add video preview
              if (project.previewLink) {
                  const projectVideo = document.createElement('video');
                  projectVideo.width = 1200;
                  projectVideo.height = 600;
                  projectVideo.autoplay = true;
                  projectVideo.loop = true;
                  projectVideo.muted = true;
                  projectVideo.classList.add('project-image');

                  const videoSource = document.createElement('source');
                  videoSource.src = project.previewLink;
                  videoSource.type = 'video/mp4';
                  projectVideo.appendChild(videoSource);
                  projectArticle.appendChild(projectVideo);
              }

              // Append the project article to the container
              projectsContainer.appendChild(projectArticle);
          });
      })
      .catch(error => {
          console.error('Error loading or displaying projects:', error);
      });
});
