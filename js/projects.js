const username = 'ksandeleon';
const projectsContainer = document.querySelector('.projects-container');
const searchInput = document.getElementById('project-search');
const paginationContainer = document.getElementById('pagination');

let allProjects = [];
let filteredProjects = [];
let currentPage = 1;
const projectsPerPage = 4;

// Fetch projects from GitHub
async function fetchProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();

        // Filter out forks if desired, or keep them. User said "all projects".
        // Let's keep public repos.
        allProjects = data;
        filteredProjects = allProjects;

        renderProjects();
        setupPagination();
    } catch (error) {
        console.error(error);
        projectsContainer.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
    }
}

function renderProjects() {
    projectsContainer.innerHTML = '';

    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const projectsToShow = filteredProjects.slice(start, end);

    if (projectsToShow.length === 0) {
        projectsContainer.innerHTML = '<p class="no-projects">No projects found.</p>';
        return;
    }

    projectsToShow.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'project-card';

        card.innerHTML = `
            <div class="project-main">
                <div class="project-info">
                    <h3 class="project-name">${repo.name}</h3>
                    <p class="project-description">${repo.description || 'No description available.'}</p>
                </div>
                <a href="${repo.html_url}" target="_blank" class="project-link">
                    <img src="assets/icons/github.svg" alt="GitHub" class="project-icon" />
                    <img src="assets/icons/arrow-up-right.svg" alt="External" class="project-external" />
                </a>
            </div>
            <div class="project-stats">
                <div class="stat-item">
                    <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span class="stat-value">${repo.stargazers_count}</span>
                </div>
                <div class="stat-item">
                    <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="6" y1="3" x2="6" y2="15"></line>
                        <circle cx="18" cy="6" r="3"></circle>
                        <circle cx="6" cy="18" r="3"></circle>
                        <path d="M18 9a9 9 0 0 1-9 9"></path>
                    </svg>
                    <span class="stat-value">${repo.forks_count}</span>
                </div>
                ${repo.language ? `
                <div class="stat-item">
                    <span class="stat-value language-tag">${repo.language}</span>
                </div>` : ''}
            </div>
        `;

        projectsContainer.appendChild(card);
    });

    updatePaginationButtons();
}

function setupPagination() {
    paginationContainer.innerHTML = `
        <button id="prev-btn" class="pagination-btn" disabled>&lt; Prev</button>
        <span id="page-info" class="page-info">Page 1</span>
        <button id="next-btn" class="pagination-btn">Next &gt;</button>
    `;

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProjects();
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProjects();
        }
    });
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    if (prevBtn && nextBtn && pageInfo) {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    }
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filteredProjects = allProjects.filter(project =>
        project.name.toLowerCase().includes(searchTerm) ||
        (project.description && project.description.toLowerCase().includes(searchTerm))
    );
    currentPage = 1;
    renderProjects();
    updatePaginationButtons();
});

// Initialize
document.addEventListener('DOMContentLoaded', fetchProjects);
