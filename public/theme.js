const themeBtn = document.getElementById('themeToggle')

// apply saved theme on load
const saved = localStorage.getItem('theme') || 'dark'
document.body.setAttribute('data-theme', saved)
themeBtn.textContent = saved === 'dark' ? '☀️' : '🌙'

themeBtn.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme')
  const next = current === 'dark' ? 'light' : 'dark'
  document.body.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
  themeBtn.textContent = next === 'dark' ? '☀️' : '🌙'
})