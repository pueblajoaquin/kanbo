async function readResponseData (response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function setErrorMessage (element, message) {
  element.textContent = message
}

const loginForm = document.getElementById('login-form')

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const submitButton = loginForm.querySelector('button[type="submit"]')
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value
    const errorMessage = document.getElementById('error-message')

    setErrorMessage(errorMessage, '')
    submitButton.disabled = true

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await readResponseData(response)

      if (!response.ok) {
        setErrorMessage(errorMessage, data?.error || 'Login failed')
        return
      }

      localStorage.setItem('token', data.token)
      window.location.href = 'projects.html'
    } catch (error) {
      setErrorMessage(errorMessage, 'Something went wrong')
    } finally {
      submitButton.disabled = false
    }
  })
}

const registerForm = document.getElementById('register-form')

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const submitButton = registerForm.querySelector('button[type="submit"]')
    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value
    const errorMessage = document.getElementById('error-message')

    setErrorMessage(errorMessage, '')
    submitButton.disabled = true

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await readResponseData(response)

      if (!response.ok) {
        setErrorMessage(errorMessage, data?.error || 'Registration failed')
        return
      }

      window.location.href = 'index.html'
    } catch (error) {
      setErrorMessage(errorMessage, 'Something went wrong')
    } finally {
      submitButton.disabled = false
    }
  })
}