const container = document.getElementById("container");

// for Responsive Mobile View Header
const toggleSidebar = () => {
  document.getElementById("sidebar").classList.toggle("show");
};

window.onload = async () => {
  await renderRequests();
};

//back to home page function
const backToHomePage = () => {
  window.location.href = "index.html";
};

const logOut = () => {
  sessionStorage.removeItem(AUTH_KEY);
  // Redirect the user to the login page
  window.location.href = "/login.html";
};
