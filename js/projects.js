const username = 'ksandeleon';
const showcaseCard = document.getElementById('project-showcase-card');
const projectIndex = document.getElementById('project-index');
const projectLanguage = document.getElementById('project-language');
const projectTitle = document.getElementById('project-title');
const projectDescription = document.getElementById('project-description');
const projectStats = document.getElementById('project-stats');
const projectLink = document.getElementById('project-link');
const projectsStatus = document.getElementById('projects-status');
const projectsCanvas = document.getElementById('projects-visual-canvas');

const projectRotationDelay = 5000;
const projectFadeDuration = 450;

let projects = [];
let currentProjectIndex = 0;
let rotationTimer = null;
let canvasFrame = null;
let canvasContext = null;
let canvasWidth = 0;
let canvasHeight = 0;
let visualNodes = [];

function formatCount(value) {
    return new Intl.NumberFormat('en-US').format(value || 0);
}

function normalizeProject(repo) {
    return {
        name: repo.name,
        description: repo.description || 'No description available.',
        url: repo.html_url,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || 'Repository',
        updatedAt: repo.updated_at || '',
        pushedAt: repo.pushed_at || ''
    };
}

function setStatus(message) {
    if (projectsStatus) {
        projectsStatus.textContent = message;
    }
}

function renderStats(project) {
    const stats = [
        { label: 'Stars', value: formatCount(project.stars) },
        { label: 'Forks', value: formatCount(project.forks) },
        { label: 'Updated', value: project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent' }
    ];

    projectStats.innerHTML = stats.map(stat => `
        <div class="project-stat-chip">
            <span class="project-stat-value">${stat.value}</span>
            <span class="project-stat-label">${stat.label}</span>
        </div>
    `).join('');
}

function renderProject(index, { animate = true } = {}) {
    if (!projects.length || !showcaseCard) {
        return;
    }

    const project = projects[index];
    const nextIndexLabel = String(index + 1).padStart(2, '0');

    const commitRender = () => {
        if (projectIndex) {
            projectIndex.textContent = nextIndexLabel;
        }

        if (projectLanguage) {
            projectLanguage.textContent = project.language;
        }

        if (projectTitle) {
            projectTitle.textContent = project.name;
        }

        if (projectDescription) {
            projectDescription.textContent = project.description;
        }

        renderStats(project);

        if (projectLink) {
            projectLink.href = project.url;
        }

        setStatus(`Project ${index + 1} of ${projects.length}`);
    };

    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        showcaseCard.classList.remove('is-fading');
        commitRender();
        return;
    }

    showcaseCard.classList.add('is-fading');
    window.setTimeout(() => {
        commitRender();
        showcaseCard.classList.remove('is-fading');
    }, projectFadeDuration);
}

function scheduleRotation() {
    if (rotationTimer) {
        window.clearInterval(rotationTimer);
    }

    if (projects.length <= 1) {
        return;
    }

    rotationTimer = window.setInterval(() => {
        currentProjectIndex = (currentProjectIndex + 1) % projects.length;
        renderProject(currentProjectIndex);
    }, projectRotationDelay);
}

function getCanvasSize() {
    const rect = projectsCanvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvasWidth = Math.max(1, Math.floor(rect.width * ratio));
    canvasHeight = Math.max(1, Math.floor(rect.height * ratio));
    projectsCanvas.width = canvasWidth;
    projectsCanvas.height = canvasHeight;
    canvasContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    canvasContext.clearRect(0, 0, rect.width, rect.height);

    visualNodes = Array.from({ length: Math.max(12, Math.floor((rect.width * rect.height) / 26000)) }, (_, index) => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        radius: 1.2 + Math.random() * 2.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        hue: 190 + (index % 4) * 18
    }));
}

function drawCanvas() {
    if (!canvasContext || !projectsCanvas) {
        return;
    }

    const rect = projectsCanvas.getBoundingClientRect();
    canvasContext.clearRect(0, 0, rect.width, rect.height);

    const gradient = canvasContext.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, 'rgba(0, 180, 255, 0.14)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, rect.width, rect.height);

    visualNodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -20) node.x = rect.width + 20;
        if (node.x > rect.width + 20) node.x = -20;
        if (node.y < -20) node.y = rect.height + 20;
        if (node.y > rect.height + 20) node.y = -20;

        canvasContext.beginPath();
        canvasContext.fillStyle = `hsla(${node.hue}, 100%, 75%, 0.85)`;
        canvasContext.shadowColor = 'rgba(120, 220, 255, 0.6)';
        canvasContext.shadowBlur = 10;
        canvasContext.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        canvasContext.fill();
    });

    for (let i = 0; i < visualNodes.length; i += 1) {
        for (let j = i + 1; j < visualNodes.length; j += 1) {
            const first = visualNodes[i];
            const second = visualNodes[j];
            const distance = Math.hypot(first.x - second.x, first.y - second.y);

            if (distance < 130) {
                canvasContext.beginPath();
                canvasContext.strokeStyle = `rgba(160, 235, 255, ${0.18 - distance / 800})`;
                canvasContext.lineWidth = 1;
                canvasContext.moveTo(first.x, first.y);
                canvasContext.lineTo(second.x, second.y);
                canvasContext.stroke();
            }
        }
    }

    canvasContext.shadowBlur = 0;
    canvasFrame = window.requestAnimationFrame(drawCanvas);
}

function startCanvasAnimation() {
    if (!projectsCanvas) {
        return;
    }

    canvasContext = projectsCanvas.getContext('2d');

    if (!canvasContext) {
        return;
    }

    getCanvasSize();
    drawCanvas();

    window.addEventListener('resize', () => {
        getCanvasSize();
    }, { passive: true });
}

async function fetchProjects() {
    if (!projectsStatus || !showcaseCard) {
        return;
    }

    try {
        setStatus('Loading projects...');

        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        projects = data
            .filter(repo => !repo.fork)
            .map(normalizeProject)
            .sort((left, right) => new Date(right.updatedAt || right.pushedAt || 0) - new Date(left.updatedAt || left.pushedAt || 0));

        if (!projects.length) {
            setStatus('No projects found.');
            projectTitle.textContent = 'No projects found.';
            projectDescription.textContent = 'Add repositories to your GitHub profile to populate this showcase.';
            projectStats.innerHTML = '';
            return;
        }

        renderProject(0, { animate: false });
        scheduleRotation();
    } catch (error) {
        console.error(error);
        setStatus('Failed to load projects.');
        projectTitle.textContent = 'Failed to load projects.';
        projectDescription.textContent = 'Please try again later.';
        projectStats.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    startCanvasAnimation();
    fetchProjects();
});
