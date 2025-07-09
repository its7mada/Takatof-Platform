// Show the loading spinner
const activeLoading = () => {
  const spinner = document.getElementById("pageLoadingSpinner");
  if (spinner) spinner.style.display = "flex";
};

// Hide the loading spinner
const disableLoading = () => {
  const spinner = document.getElementById("pageLoadingSpinner");
  if (spinner) spinner.style.display = "none";
};

const showNotification = (
  notification,
  message = "Product updated successfully!"
) => {
  if (notification === 0) {
    const notification = document.createElement("div");
    notification.className = "alert alert-success alert-dismissible fade show";
    notification.role = "alert";
    notification.style = `
  position:absolute;
  right:0;
  margin:5px;
  z-index:999`;
    notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

    // Append the notification to the top of the page
    document.body.prepend(notification);

    // Optionally auto-dismiss the notification after 5 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      notification.classList.add("fade");
      setTimeout(() => notification.remove(), 150); // Wait for fade-out animation to complete
    }, 5000);
  } else {
    const notification = document.createElement("div");
    notification.className = "alert alert-danger alert-dismissible fade show";
    notification.role = "alert";
    notification.style = `
  position:absolute;
  right:0;
  margin:5px;`;
    notification.innerHTML = `
    Something went Wront , Please try again!
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

    // Append the notification to the top of the page
    document.body.prepend(notification);

    // Optionally auto-dismiss the notification after 5 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      notification.classList.add("fade");
      setTimeout(() => notification.remove(), 150); // Wait for fade-out animation to complete
    }, 5000);
  }
};
