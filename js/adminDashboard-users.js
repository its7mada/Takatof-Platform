// const testUsersArray = [
//   {
//     id: 1,
//     firstName: "John",
//     middleName: "Michael",
//     lastName: "Doe",
//     image: "https://www.htdc.org/wp-content/uploads/unnamed.jpg",
//     email: "john.doe@example.com",
//     idNumber: "123456789",
//     phoneNumber: "+1 234 567 8900",
//     city: "New York",
//     gender: "male",
//     state: "user",
//   },
//   {
//     id: 2,
//     firstName: "MOhammed",
//     middleName: "Michael",
//     lastName: "Doe",
//     image: "https://www.htdc.org/wp-content/uploads/unnamed.jpg",
//     email: "john.doe@example.com",
//     idNumber: "123456789",
//     phoneNumber: "+1 234 567 8900",
//     city: "New York",
//     gender: "male",
//     state: "admin",
//   },
//   {
//     id: 3,
//     firstName: "Ali",
//     middleName: "Michael",
//     lastName: "Doe",
//     image: "https://www.htdc.org/wp-content/uploads/unnamed.jpg",
//     email: "john.doe@example.com",
//     idNumber: "123456789",
//     phoneNumber: "+1 234 567 8900",
//     city: "New York",
//     gender: "male",
//     state: "user",
//   },
//   {
//     id: 5,
//     firstName: "Oday",
//     middleName: "Michael",
//     lastName: "Doeas",
//     image: "https://www.htdc.org/wp-content/uploads/unnamed.jpg",
//     email: "john.doe@example.com",
//     idNumber: "123456789",
//     phoneNumber: "+1 234 567 8900",
//     city: "New York",
//     gender: "male",
//     state: "user",
//   },
// ];

const renderAllUsers = async () => {
  activeLoading();
  let rowsHtml = "";

  try {
    // Make the GET request to the API
    const endpoint = "http://localhost:5501/api/user";
    const response = await fetch(endpoint);

    // Check if the response is OK (200)
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    // Parse the response data
    const users = await response.json();
    console.log("API Response:", users);

    // Loop through the users and generate HTML for each row
    users.forEach((user) => {
      rowsHtml += `
        <tr UserId="${user._id}" middleName="${user.middleName}" firstName="${user.firstName}" lastName="${user.lastName}" Image='${user.avatar}' email="${user.email}" userIdNumber="${user.idNumber}" phone="${user.phoneNumber}" gender="${user.gender}" city="${user.city}" state="${user.state}" blocked="${user.blocked}">
          <td>${user.firstName} ${user.lastName}</td>
          <td>${user.state}</td>
          <td><button class="btn btn-primary" onClick="userDetailsPage(event)">Details</button></td>
        </tr>`;
    });

    // Render the HTML with user data
    container.innerHTML = `
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center py-3">
          <h1>Users</h1>
      </div>

      <!-- Table -->
      <div class="card mb-4">
          <div class="card-header">Users</div>
          <div class="card-body">
              <table class="table">
                  <thead>
                      <tr>
                          <th>Name</th>
                          <th>State</th>
                          <th>Details</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${rowsHtml} 
                  </tbody>
              </table>
          </div>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching users:", error);
    container.innerHTML = `<p class="text-danger">Failed to load users. Please try again later.</p>`;
  } finally {
    document.getElementById("sidebar").classList.remove("show");
    disableLoading();
  }
};

const userDetailsPage = (event) => {
  const parent = event.target.closest("tr");

  // Modal HTML structure
  const modalHtml = `
    <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="detailsModalLabel">User Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h2 class="mb-4">Profile Information</h2>
            <div class="text-center mb-4">
              <img id="profileImage" src="../img/${parent.getAttribute(
                "image"
              )}" alt="User Image" class="rounded-circle" style="width: 150px; height: 150px; object-fit: cover;">
            </div>
            <form>
              <div class="row g-3 mb-3">
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <input type="text" class="form-control" placeholder="First Name" value="${parent.getAttribute(
                      "firstName"
                    )}" readonly>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <input type="text" class="form-control" placeholder="Middle Name" value="${parent.getAttribute(
                      "middleName"
                    )}" readonly>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <input type="text" class="form-control" placeholder="Last Name" value="${parent.getAttribute(
                      "lastName"
                    )}" readonly>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input type="email" class="form-control" placeholder="Email Address" value="${parent.getAttribute(
                    "email"
                  )}" readonly>
                </div>
              </div>
              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-card-text"></i></span>
                  <input type="text" class="form-control" placeholder="ID Number" value="${parent.getAttribute(
                    "userIdNumber"
                  )}" readonly>
                </div>
              </div>
              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                  <input type="text" class="form-control" placeholder="Phone Number" value="${parent.getAttribute(
                    "phone"
                  )}" readonly>
                </div>
              </div>
              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                  <input type="text" class="form-control" placeholder="City" value="${parent.getAttribute(
                    "city"
                  )}" readonly>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Gender</label>
                <div>
                  <input type="text" class="form-control" value="${parent.getAttribute(
                    "gender"
                  )}" readonly>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" onclick="changeState('${parent.getAttribute(
              "UserId"
            )}')" data-bs-dismiss="modal">${
    parent.getAttribute("state") === "user"
      ? `Make Admin <i class="bi bi-shield-fill-check"></i>`
      : `Return User <i class="bi bi-person-down"></i>`
  }</button>
            <button type="button" class="btn btn-danger" onclick="blockUser('${parent.getAttribute(
              "UserId"
            )}')"
             data-bs-dismiss="modal">${
               parent.getAttribute("blocked") === "true" ? "Unblock" : "block"
             }<i class="bi bi-person-slash"></i></button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const detailsModal = new bootstrap.Modal(
    document.getElementById("detailsModal")
  );
  detailsModal.show();

  document
    .getElementById("detailsModal")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("detailsModal").remove();
    });
};

const changeState = async (userId) => {
  console.log(`User ${userId} has been changed state.`);

  try {
    const res = await fetch(
      `http://localhost:5501/api/user/toAdmin/${userId}`,
      {
        method: "PATCH",
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to change user state: ${res.statusText}`);
      showNotification(1);
    }
    showNotification(0, "User has been Updated Successfuly");
  } catch {
    showNotification(1);
  }

  renderAllUsers();
};

const blockUser = async (userId) => {
  try {
    const res = await fetch(
      `http://localhost:5501/api/user/blockUser/${userId}`,
      {
        method: "PATCH",
      }
    );
    const data = res.json();
    console.log(data);
    if (!res.ok) {
      throw new Error(`Failed to block user: ${res.statusText}`);
      showNotification(1);
    }
    showNotification(0, "User has been Blocked Successfuly");
  } catch {
    showNotification(1);
  }

  renderAllUsers();
};
