// Projects Data Management System
// Usage: Include this in your HTML files to dynamically load project content

class ProjectsManager {
  constructor() {
    this.projects = [];
    this.isLoaded = false;
  }

  // Load projects data from JSON file
  async loadProjects() {
    try {
      const response = await fetch('data/projects.json');
      const data = await response.json();
      this.projects = data.projects;
      this.isLoaded = true;
      return this.projects;
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to embedded data if JSON file fails
      this.loadFallbackData();
      return this.projects;
    }
  }

  // Fallback data embedded in JavaScript
  loadFallbackData() {
    this.projects = fetch('data/projects.json')
      .then(response => response.json())
      .then(data => data.projects);
    this.isLoaded = true;
  }

  // Get featured projects for homepage
  getFeaturedProjects() {
    return this.projects.filter(project => project.featured);
  }

  // Get all projects for projects page
  getAllProjects() {
    return this.projects;
  }

  // Get projects by category
  getProjectsByCategory(category) {
    return this.projects.filter(project => project.category === category);
  }

  // Generate HTML for a single project card (homepage style)
  generateHomeProjectCard(project) {
    const techTags = project.technologies.map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');

    const links = this.generateProjectLinks(project, 'home');

    return `
      <div class="project-card">
        <div class="project-icon">
          <i class="${project.icon}"></i>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tech-tags">
          ${techTags}
        </div>
        <div class="project-links">
          ${links}
        </div>
      </div>
    `;
  }

  // Generate HTML for a single project card (projects page style)
  generateProjectsPageCard(project) {
    const techTags = project.technologies.map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');

    const links = this.generateProjectLinks(project, 'projects');

    return `
      <div class="project-card">
        <div class="project-icon">
          <i class="${project.icon}"></i>
        </div>
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        <div class="tech-tags">
          ${techTags}
        </div>
        <div class="project-links">
          ${links}
        </div>
        <a href="#" class="btn btn-primary">
          <i class="fas fa-arrow-right"></i> View Details
        </a>
      </div>
    `;
  }

  // Generate project links HTML
  generateProjectLinks(project, pageType) {
    let links = [];

    if (project.links.github) {
      links.push(`<a href="${project.links.github}" class="project-link" target="_blank" rel="noopener">
        <i class="fab fa-github"></i> GitHub
      </a>`);
    }

    if (project.links.demo) {
      links.push(`<a href="${project.links.demo}" class="project-link" target="_blank" rel="noopener">
        <i class="fas fa-external-link-alt"></i> Demo
      </a>`);
    }

    if (project.links.documentation) {
      const iconClass = project.category === 'Data Engineering' ? 'fas fa-chart-bar' : 
                       project.category === 'Systems Programming' ? 'fas fa-file-code' : 
                       'fas fa-external-link-alt';
      const linkText = project.category === 'Data Engineering' ? 'Analytics' : 'Documentation';
      
      links.push(`<a href="${project.links.documentation}" class="project-link" target="_blank" rel="noopener">
        <i class="${iconClass}"></i> ${linkText}
      </a>`);
    }

    return links.join('');
  }

  // Render featured projects on homepage
  async renderHomeFeaturedProjects(containerId = 'featured-projects-container') {
    if (!this.isLoaded) {
      await this.loadProjects();
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return;
    }

    const featuredProjects = this.getFeaturedProjects();
    const projectsHTML = featuredProjects.map(project => 
      this.generateHomeProjectCard(project)
    ).join('');

    container.innerHTML = `
      <h2 class="section-title">Featured Projects</h2>
      <div class="projects-grid">
        ${projectsHTML}
      </div>
      <div style="text-align: center; margin-top: 3rem;">
        <a href="projects.html" class="btn btn-primary" style="font-size: 1.1rem;">
          <i class="fas fa-arrow-right"></i> View All Projects
        </a>
      </div>
    `;
  }

  // Render all projects on projects page
  async renderAllProjects(containerId = 'all-projects-container') {
    if (!this.isLoaded) {
      await this.loadProjects();
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return;
    }

    const allProjects = this.getAllProjects();
    const projectsHTML = allProjects.map(project => 
      this.generateProjectsPageCard(project)
    ).join('');

    container.innerHTML = projectsHTML;
  }

  // Update project in data (for future admin features)
  updateProject(id, updatedData) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updatedData };
      return true;
    }
    return false;
  }
}

// Initialize global projects manager
const projectsManager = new ProjectsManager();

// DOM Content Loaded event listener
document.addEventListener('DOMContentLoaded', function() {
  // Auto-render based on page context
  const currentPage = window.location.pathname;
  
  if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
    // Homepage - render featured projects
    const featuredContainer = document.getElementById('featured-projects-container');
    if (featuredContainer) {
      projectsManager.renderHomeFeaturedProjects('featured-projects-container');
    }
  } else if (currentPage.includes('projects.html')) {
    // Projects page - render all projects
    const allProjectsContainer = document.getElementById('all-projects-container');
    if (allProjectsContainer) {
      projectsManager.renderAllProjects('all-projects-container');
    }
  }
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectsManager;
}