const themeBtn = document.getElementById('themeToggle')

const saved = localStorage.getItem('theme') || 'dark'
document.body.setAttribute('data-theme', saved)
themeBtn.innerHTML = saved === 'dark'
  ? '<img src="images/light-mode.png" alt="light mode" />'
  : '<img src="images/dark-mode.png" alt="dark mode" />'

themeBtn.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme')
  const next = current === 'dark' ? 'light' : 'dark'
  document.body.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
  themeBtn.innerHTML = next === 'dark'
    ? '<img src="images/light-mode.png" alt="light mode" />'
    : '<img src="images/dark-mode.png" alt="dark mode" />'
})