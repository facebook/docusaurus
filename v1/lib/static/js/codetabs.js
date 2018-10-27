// Turn off ESLint for this file because it's sent down to users as-is.
/* eslint-disable */
window.addEventListener('load', function() {
  // add event listener for all tab
  document.querySelectorAll('.nav-link').forEach(function(el) {
    el.addEventListener('click', function(e) {
      const groupId = e.target.getAttribute('data-group');
      document
        .querySelectorAll(`.nav-link[data-group=${groupId}]`)
        .forEach(function(el) {
          el.classList.remove('active');
        });
      document
        .querySelectorAll(`.tab-pane[data-group=${groupId}]`)
        .forEach(function(el) {
          el.classList.remove('active');
        });
      e.target.classList.add('active');
      document
        .querySelector(`#${e.target.getAttribute('data-tab')}`)
        .classList.add('active');
    });
  });
});
