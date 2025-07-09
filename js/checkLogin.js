const AUTH_KEY = "AUTH_KEY";
document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.getElementById("user-icon");
  userIcon.addEventListener("click", () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem(AUTH_KEY));
      if (userData.state === "admin") {
        window.location.href = "../admin-dashboard.html";
      } else if (userData.state === "user") {
        window.location.href = "../dashboard.html";
      }
    } catch {
      window.location.href = "../login.html";
    }
  });
});
