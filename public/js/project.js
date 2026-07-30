function getProjectIdFromUrl () {
  const params = new URLSearchParams(window.location.search)
  return params.get('id')
}

const taskList = document.getElementById('task-list')
const newTaskForm = document.getElementById('new-task-form')
const logoutBtn = document.getElementById('logout-btn')
const errorMessage = document.getElementById('error-message')
const taskCount = document.getElementById('task-count')
const doneCount = document.getElementById('done-count')
const taskSummary = document.getElementById('task-summary')
const addTaskButton = newTaskForm.querySelector('button[type="submit"]')
const projectId = getProjectIdFromUrl()

async function loadProject () {
  errorMessage.textContent = ''
  const projectResponse = await apiFetch(`/projects/${projectId}`)

  if (!projectResponse.ok) {
    window.location.href = 'projects.html'
    return
  }

  const project = await projectResponse.json()
  document.getElementById('project-name').textContent = project.name

  const tasksResponse = await apiFetch(`/projects/${projectId}/tasks`)
  if (!tasksResponse.ok) {
    errorMessage.textContent = 'Could not load tasks'
    return
  }

  const tasks = await tasksResponse.json()
  const completedTasks = tasks.filter((task) => task.status === 'done').length

  taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'}`
  doneCount.textContent = `${completedTasks} done`
  taskSummary.textContent = tasks.length > 0
    ? 'Keep momentum by moving tasks across the board.'
    : 'Create the first task to bring this board to life.'

  renderTasks(tasks)
}

function renderTasks (tasks) {
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

logoutBtn.addEventListener('click', () => {
  clearAuthAndRedirect()
})

loadProject()