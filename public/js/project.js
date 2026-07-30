function getProjectIdFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('id')
}

const taskList = document.getElementById('task-list')
const newTaskForm = document.getElementById('new-task-form')
const logoutBtn = document.getElementById('logout-btn')
const errorMessage = document.getElementById('error-message')
const memberList = document.getElementById('member-list')
const inviteMemberForm = document.getElementById('invite-member-form')
const memberMessage = document.getElementById('member-message')
const taskCount = document.getElementById('task-count')
const doneCount = document.getElementById('done-count')
const memberCount = document.getElementById('member-count')
const memberSummary = document.getElementById('member-summary')
const taskSummary = document.getElementById('task-summary')
const addTaskButton = newTaskForm.querySelector('button[type="submit"]')
const inviteMemberButton = inviteMemberForm.querySelector('button[type="submit"]')
const projectId = getProjectIdFromUrl()

async function loadProject() {
  errorMessage.textContent = ''
  memberMessage.textContent = ''

  const projectResponse = await apiFetch(`/projects/${projectId}`)

  if (!projectResponse.ok) {
    window.location.href = 'projects.html'
    return
  }

  const project = await projectResponse.json()
  document.getElementById('project-name').textContent = project.name

  const [tasksResponse, membersResponse] = await Promise.all([
    apiFetch(`/projects/${projectId}/tasks`),
    apiFetch(`/projects/${projectId}/members`)
  ])

  if (!tasksResponse.ok) {
    errorMessage.textContent = 'Could not load tasks'
    return
  }

  if (!membersResponse.ok) {
    memberMessage.textContent = 'Could not load members'
    return
  }

  const tasks = await tasksResponse.json()
  const members = await membersResponse.json()
  const completedTasks = tasks.filter((task) => task.status === 'done').length

  taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'}`
  doneCount.textContent = `${completedTasks} done`
  taskSummary.textContent = tasks.length > 0
    ? 'Keep momentum by moving tasks across the board.'
    : 'Create the first task to bring this board to life.'

  memberCount.textContent = `${members.length} member${members.length === 1 ? '' : 's'}`
  memberSummary.textContent = members.length > 0
    ? 'The owner stays visible and collaborators can be invited from here.'
    : 'Invite the first teammate to start collaborating on this project.'

  renderTasks(tasks)
  renderMembers(members)
}

function renderTasks(tasks) {
  taskList.innerHTML = ''

  tasks.forEach((task) => {
    const li = document.createElement('li')

    const title = document.createElement('span')
    title.textContent = task.title

    const select = document.createElement('select')
      ;['pending', 'in_progress', 'done'].forEach((status) => {
        const option = document.createElement('option')
        option.value = status
        option.textContent = status
        if (task.status === status) option.selected = true
        select.appendChild(option)
      })

    select.addEventListener('change', async () => {
      const response = await apiFetch(`/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: select.value })
      })

      if (!response.ok) {
        errorMessage.textContent = 'Could not update task status'
        return
      }

      errorMessage.textContent = ''
    })

    li.appendChild(title)
    li.appendChild(select)
    taskList.appendChild(li)
  })

  if (tasks.length === 0) {
    const emptyItem = document.createElement('li')
    emptyItem.className = 'empty-state'
    emptyItem.textContent = 'No tasks yet. Add the first one above.'
    taskList.appendChild(emptyItem)
  }
}

function renderMembers(members) {
  memberList.innerHTML = ''

  members.forEach((member) => {
    const li = document.createElement('li')

    const details = document.createElement('div')
    details.className = 'member-details'

    const name = document.createElement('strong')
    name.textContent = member.name

    const email = document.createElement('span')
    email.className = 'member-email'
    email.textContent = member.email

    details.appendChild(name)
    details.appendChild(email)

    const role = document.createElement('span')
    role.className = member.isOwner ? 'member-badge member-badge-owner' : 'member-badge'
    role.textContent = member.isOwner ? 'Owner' : 'Member'

    li.appendChild(details)
    li.appendChild(role)
    memberList.appendChild(li)
  })

  if (members.length === 0) {
    const emptyItem = document.createElement('li')
    emptyItem.className = 'empty-state'
    emptyItem.textContent = 'No members yet. Invite the first one above.'
    memberList.appendChild(emptyItem)
  }
}

newTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const title = document.getElementById('task-title').value.trim()

  addTaskButton.disabled = true
  const response = await apiFetch(`/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })

  addTaskButton.disabled = false

  if (!response.ok) {
    errorMessage.textContent = 'Could not create task'
    return
  }

  document.getElementById('task-title').value = ''
  loadProject()
})

inviteMemberForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('member-email').value.trim()

  memberMessage.textContent = ''
  inviteMemberButton.disabled = true

  const response = await apiFetch(`/projects/${projectId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })

  inviteMemberButton.disabled = false

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    memberMessage.textContent = payload.message || 'Could not invite member'
    return
  }

  document.getElementById('member-email').value = ''
  loadProject()
})

logoutBtn.addEventListener('click', () => {
  clearAuthAndRedirect()
})

loadProject()
