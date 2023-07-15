// Add some interactivity

// Example: Changing the page title dynamically
const currentPage = window.location.pathname.split("/").pop();
document.title = currentPage.charAt(0).toUpperCase() + currentPage.slice(1) + " - My Docusaurus Project";

// Example: Adding active class to the current page link in the navigation
const currentLink = document.querySelector(`nav ul li a[href="${currentPage}"]`);
if (currentLink) {
  currentLink.classList.add("active");
}
