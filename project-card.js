// Define the ProjectCard custom element
class ProjectCard extends HTMLElement {
    constructor() {
      super();
      // Create a shadow DOM for encapsulation
      this.attachShadow({ mode: 'open' });
    }
  
    // Called when the element is added to the DOM
    connectedCallback() {
      this.render();
    }
  
    // Set project data
    set project(data) {
      this._project = data;
      this.render();
    }
  
    // Render the card content
    render() {
      if (!this._project) return;
  
      // Get data from project object
      const { title, imageUrl, altText, description, link } = this._project;
  
      // Create the card HTML content
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --card-bg: var(--bg-medium, #222);
            --card-text: var(--text-primary, #fff);
            --card-accent: var(--primary-color, #0984e3);
            --card-border-radius: 1rem;
            --card-padding: 1.5rem;
            --card-transition: all 0.3s ease;
            
            display: block;
            background: var(--card-bg);
            border-radius: var(--card-border-radius);
            overflow: hidden;
            transition: var(--card-transition);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
  
          :host(:hover) {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }
  
          .card-container {
            display: grid;
            grid-template-rows: auto 1fr auto;
            height: 100%;
          }
  
          .card-header {
            padding: var(--card-padding);
            padding-bottom: 0;
          }
  
          h2 {
            margin: 0 0 0.5rem 0;
            color: var(--card-accent);
            font-size: 1.5rem;
          }
  
          .card-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }
  
          .card-content {
            padding: var(--card-padding);
          }
  
          .card-description {
            margin-bottom: 1rem;
            line-height: 1.5;
          }
  
          .card-footer {
            padding: 0 var(--card-padding) var(--card-padding);
          }
  
          .card-link {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: var(--card-accent);
            color: white;
            text-decoration: none;
            border-radius: 0.25rem;
            transition: var(--card-transition);
          }
  
          .card-link:hover {
            background: color-mix(in srgb, var(--card-accent) 80%, white);
            transform: translateY(-2px);
          }
  
          @media (max-width: 768px) {
            :host {
              --card-padding: 1rem;
            }
            
            .card-image {
              height: 150px;
            }
          }
        </style>
        
        <div class="card-container">
          <div class="card-header">
            <h2>${title}</h2>
          </div>
          
          <picture>
            <img class="card-image" src="${imageUrl}" alt="${altText}">
          </picture>
          
          <div class="card-content">
            <p class="card-description">${description}</p>
          </div>
          
          <div class="card-footer">
            <a href="${link}" class="card-link">View Project</a>
          </div>
        </div>
      `;
    }
  }
  
  // Register the custom element
  customElements.define('project-card', ProjectCard);
  
  // Function to load projects from localStorage
  function loadLocalProjects() {
    clearProjects();
    const projectsContainer = document.getElementById('projects-container');
    
    try {
      // Attempt to get projects from localStorage
      const localProjects = JSON.parse(localStorage.getItem('projects'));
      
      if (localProjects && localProjects.length > 0) {
        renderProjects(localProjects);
      } else {
        projectsContainer.innerHTML = '<p>No projects found in local storage.</p>';
      }
    } catch (error) {
      console.error('Error loading local projects:', error);
      projectsContainer.innerHTML = '<p>Error loading projects from local storage.</p>';
    }
  }
  
  // Function to load projects from remote server
  async function loadRemoteProjects() {
    clearProjects();
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '<p>Loading projects...</p>';
    
    try {
      // Fetch projects from JSONBin or My JSON Server
      // Replace with your actual endpoint
      const response = await fetch('https://my-json-server.typicode.com/liuziyue141/CSE134_HW5/projects');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const remoteProjects = await response.json();
      
      if (remoteProjects && remoteProjects.length > 0) {
        // Save to localStorage for future use
        localStorage.setItem('projects', JSON.stringify(remoteProjects));
        renderProjects(remoteProjects);
      } else {
        projectsContainer.innerHTML = '<p>No projects found on remote server.</p>';
      }
    } catch (error) {
      console.error('Error loading remote projects:', error);
      projectsContainer.innerHTML = `<p>Error loading projects from remote server: ${error.message}</p>`;
    }
  }
  
  // Helper function to render projects
  function renderProjects(projects) {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';
    
    projects.forEach(project => {
      const card = document.createElement('project-card');
      card.project = project;
      projectsContainer.appendChild(card);
    });
  }
  
  // Helper function to clear existing projects
  function clearProjects() {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';
  }
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners for buttons
    document.getElementById('load-local-btn').addEventListener('click', loadLocalProjects);
    document.getElementById('load-remote-btn').addEventListener('click', loadRemoteProjects);
    
    // Sample project data for testing
    const sampleProjects = [
      {
        title: "Ray Tracer Project",
        imageUrl: "ray_tracer.png",
        altText: "3D rendered scene showing light reflection and shadow effects",
        description: "Developed a comprehensive raytracer from scratch in C++, implementing core rendering features including shadow computation, reflection handling, and geometric primitive intersection calculations.",
        link: "https://github.com/liuziyue141/RayTracerProject"
      },
      {
        title: "Codename",
        imageUrl: "codename.avif",
        altText: "Screenshot of Codename game interface showing word grid",
        description: "A strategic word-guessing party game built with React frontend and Node.js backend. Implemented Socket.IO for real-time gameplay features.",
        link: "https://github.com/liuziyue141/codename"
      },
      {
        title: "Intent Classification Using BERT",
        imageUrl: "pa4.ppm",
        altText: "Contrastive learning diagram",
        description: "Led an NLP project analyzing Amazon's intent dataset using BERT and advanced contrastive learning approaches, achieving 88% accuracy on intent classification.",
        link: "/CSE_151B___PA4___Report.pdf"
      }
    ];
    
    // Store sample data in localStorage for testing
    if (!localStorage.getItem('projects')) {
      localStorage.setItem('projects', JSON.stringify(sampleProjects));
    }
  });