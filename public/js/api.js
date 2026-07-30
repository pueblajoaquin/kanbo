function getToken () {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = 'index.html'
  }
  return token
}

function clearAuthAndRedirect (target = 'index.html') {
  localStorage.removeItem('token')
  window.location.href = target
}

async function apiFetch (url, options = {}) {
  const token = getToken()
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  })
  return response
}

window.getToken = getToken
window.clearAuthAndRedirect = clearAuthAndRedirect
window.apiFetch = apiFetch