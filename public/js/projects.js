const projectList = document.getElementById('project-list')
const newProjectForm = document.getElementById('new-project-form')
const logoutBtn = document.getElementById('logout-btn')
const errorMessage = document.getElementById('error-message')
const welcomeName = document.getElementById('welcome-name')
const projectCount = document.getElementById('project-count')
const projectHint = document.getElementById('project-hint')
const createProjectButton = newProjectForm.querySelector('button[type="submit"]')

async function loadWorkspaceHeader () {
  const response = await apiFetch('/users/me')

  if (!response.ok) {
    clearAuthAndRedirect()
    return
  }

  const user = await response.json()
  welcomeName.textContent = `Welcome back, ${user.name}`
  projectHint.textContent = 'Keep everything in one place and move quickly between active boards.'
}

async function loadProjects () {
  errorMessage.textContent = ''
  const response = await apiFetch('/projects')

  if (!response.ok) {
    clearAuthAndRedirect()
    return
  }

  const projects = await response.json()
  projectCount.textContent = `${projects.length} project${projects.length === 1 ? '' : 's'}`

  projectList.innerHTML = ''

  if (projects.length === 0) {
    const emptyItem = document.createElement('li')
    emptyItem.className = 'empty-state'
    emptyItem.textContent = 'No projects yet. Create the first one to get started.'
    projectList.appendChild(emptyItem)
    return
  }

  projects.forEach((project) => {
    const li = document.createElement('li')
    const link = document.createElement('a')
    link.href = `project.html?id=${project.id}`
    link.textContent = project.name
    li.appendChild(link)
    projectList.appendChild(li)
  })
}

newProjectForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = document.getElementById('project-name').value.trim()

  createProjectButton.disabled = true
  const response = await apiFetch('/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })

  createProjectButton.disabled = false

  if (!response.ok) {
    errorMessage.textContent = 'Could not create project'
    return
  }

  document.getElementById('project-name').value = ''
  loadProjects()
})

logoutBtn.addEventListener('click', () => {
  clearAuthAndRedirect()
})

loadWorkspaceHeader()
loadProjects()