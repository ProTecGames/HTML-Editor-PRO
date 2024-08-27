document.addEventListener("DOMContentLoaded", function() {
  var hamburger = document.querySelector('.hamburger')
  var sideNav = document.querySelector('.sideNav')
  var overlay = document.querySelector('.overlay')

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active')
    sideNav.classList.toggle('active')
    overlay.classList.toggle('active')
  })
});