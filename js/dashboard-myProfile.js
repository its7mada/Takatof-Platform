const AUTH_KEY = "AUTH_KEY";
const userData = JSON.parse(sessionStorage.getItem(AUTH_KEY));
// Profile Page Functions
const getProfileData = async () => {
  const res = await fetch(`http://localhost:5501/api/user/${userData.id}`);
  const data = res.json();
  return data;
};

const renderProfile = async () => {
  activeLoading();
  const data = await getProfileData();
  console.log(data);

  container.innerHTML = `
<div class="profile-container">
    <div class="profile-card">
        <h2 class="profile-title">Profile Information</h2>
        
        <div class="profile-avatar-container">
            <div class="avatar-wrapper">
                <img id="profileImage" src="../img/${data.avatar}" alt="User Image" class="profile-avatar">
                <label for="imageUpload" class="avatar-upload-label">
                    <i class="bi bi-camera-fill"></i>
                </label>
                <input type="file" id="imageUpload" class="d-none" accept="image/*">
            </div>
        </div>

        <form id="profileForm" class="profile-form">
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="input-group input-group-modern">
                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                        <input type="text" class="form-control" placeholder="First Name" value="${data.firstName}" readonly>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="input-group input-group-modern">
                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                        <input type="text" class="form-control" placeholder="Middle Name" value="${data.middleName}" readonly>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="input-group input-group-modern">
                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                        <input type="text" class="form-control" placeholder="Last Name" value="${data.lastName}" readonly>
                    </div>
                </div>
            </div>
            
            <div class="profile-form-group">
                <div class="input-group input-group-modern">
                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                    <input type="email" class="form-control" placeholder="Email Address" value="${data.email}" readonly>
                </div>
            </div>

            <div class="profile-form-group">
                <div class="input-group input-group-modern">
                    <span class="input-group-text"><i class="bi bi-card-text"></i></span>
                    <input type="text" class="form-control" placeholder="ID Number" value="${data.idNumber}" readonly>
                </div>
            </div>

            <div class="profile-form-group">
                <div class="input-group input-group-modern">
                    <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                    <input type="text" class="form-control" placeholder="Phone Number" value="${data.phoneNumber}" readonly>
                </div>
            </div>

            <div class="profile-form-group">
                <div class="input-group input-group-modern">
                    <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                    <input type="text" class="form-control" placeholder="City" value="${data.city}" readonly>
                </div>
            </div>

            <div class="profile-form-group">
                <label class="form-label">Gender</label>
                <div class="gender-options">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="gender" value="male" ${data.gender === "male" ? "checked" : ""} disabled>
                        <label class="form-check-label">Male</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="gender" value="female" ${data.gender === "female" ? "checked" : ""} disabled>
                        <label class="form-check-label">Female</label>
                    </div>
                </div>
            </div>

            <div class="password-fields d-none" id="passwordFields">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="input-group input-group-modern">
                            <span class="input-group-text"><i class="bi bi-lock"></i></span>
                            <input type="password" class="form-control" id="currentPassword" placeholder="Current Password">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="input-group input-group-modern">
                            <span class="input-group-text"><i class="bi bi-lock"></i></span>
                            <input type="password" class="form-control" id="newPassword" placeholder="New Password">
                        </div>
                    </div>
                </div>
            </div>

            <div class="profile-actions">
                <div class="row g-3">
                    <div class="col-md-6">
                        <button type="button" class="btn btn-primary btn-edit" id="editButton" onclick="enableEdit()">
                            <i class="bi bi-pencil-square me-2"></i>Edit Profile
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button type="button" class="btn btn-outline-dark btn-change-password" id="changePasswordButton" onclick="enablePasswordEdit()">
                            <i class="bi bi-key me-2"></i>Change Password
                        </button>
                    </div>
                </div>
                
                <div class="edit-buttons d-none" id="editButtons">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <button type="submit" class="btn btn-success btn-save">
                                <i class="bi bi-check-circle me-2"></i>Save Changes
                            </button>
                        </div>
                        <div class="col-md-6">
                            <button type="button" class="btn btn-outline-secondary btn-cancel" onclick="cancelEdit()">
                                <i class="bi bi-x-circle me-2"></i>Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<style>
.profile-container {
    width: 100%;
    padding: 1rem;
}

.profile-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
    padding: 2rem;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
}

.profile-title {
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-align: center;
    position: relative;
    font-size: 1.5rem;
}

.profile-title::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #4e73df, #224abe);
    margin: 0.5rem auto 0;
}

.profile-avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.avatar-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
}

.profile-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #f8f9fc;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.avatar-upload-label {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: #4e73df;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.9rem;
}

.avatar-upload-label:hover {
    background: #224abe;
    transform: scale(1.1);
}

.profile-form-group {
    margin-bottom: 1.25rem;
}

.input-group-modern {
    margin-bottom: 0.75rem;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.input-group-modern .input-group-text {
    background-color: #f8f9fc;
    border: none;
    color: #4e73df;
    min-width: 45px;
    justify-content: center;
    padding: 0.75rem;
}

.input-group-modern .form-control {
    border-left: none;
    padding: 0.75rem;
    background-color: #f8f9fc;
    border-color: #e3e6f0;
    height: auto;
}

.input-group-modern .form-control:focus {
    box-shadow: none;
    background-color: #fff;
}

.gender-options {
    padding: 0.5rem 0;
}

.form-check-input:checked {
    background-color: #4e73df;
    border-color: #4e73df;
}

.profile-actions {
    margin-top: 1.5rem;
}

.btn-edit, .btn-change-password, .btn-save, .btn-cancel {
    padding: 0.75rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s;
    width: 100%;
}

.btn-edit {
             background-color: #485dff;
    border: none;
}

.btn-edit:hover {
             background-color: #485dff;
    transform: translateY(-2px);
}

.btn-change-password {
    border: 1px solid #d1d3e2;
}

.btn-change-password:hover {
    background-color: #f8f9fc;
    border-color: #bac8f3;
    transform: translateY(-2px);
}

.btn-save {
    background-color: #1cc88a;
    border: none;
}

.btn-save:hover {
    background-color: #17a673;
    transform: translateY(-2px);
}

.btn-cancel:hover {
    transform: translateY(-2px);
}

.password-fields {
    margin: 1.25rem 0;
    padding: 1.25rem;
    background-color: #f8f9fc;
    border-radius: 8px;
}

.edit-buttons {
    animation: fadeIn 0.3s ease-in-out;
    margin-top: 1rem;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
    .profile-card {
        padding: 1.5rem;
    }
    
    .avatar-wrapper {
        width: 100px;
        height: 100px;
    }
    
    .profile-title {
        font-size: 1.3rem;
        margin-bottom: 1rem;
    }
    
    .input-group-modern .input-group-text,
    .input-group-modern .form-control {
        padding: 0.6rem;
    }
}

@media (max-width: 576px) {
    .profile-card {
        padding: 1.25rem;
    }
    
    .profile-title {
        font-size: 1.2rem;
    }
    
    .avatar-wrapper {
        width: 90px;
        height: 90px;
    }
    
    .avatar-upload-label {
        width: 28px;
        height: 28px;
        font-size: 0.8rem;
    }
}
</style>
    `;
  document.getElementById("sidebar").classList.remove("show");
  document.getElementById("profileForm").addEventListener("submit", submitForm);

  disableLoading();
};
const enableEdit = () => {
  document
    .querySelectorAll("input")
    .forEach((input) => input.removeAttribute("readonly"));
  document
    .querySelectorAll('input[type="radio"]')
    .forEach((radio) => radio.removeAttribute("disabled"));

  document.getElementById("profileImage").classList.add("d-none");
  document.getElementById("imageUpload").classList.remove("d-none");

  document.getElementById("editButton").classList.add("d-none");
  document.getElementById("editButtons").classList.remove("d-none");
};

const cancelEdit = () => {
  document
    .querySelectorAll("input")
    .forEach((input) => input.setAttribute("readonly", true));
  document
    .querySelectorAll('input[type="radio"]')
    .forEach((radio) => radio.setAttribute("disabled", true));

  document.getElementById("profileImage").classList.remove("d-none");
  document.getElementById("imageUpload").classList.add("d-none");

  document.getElementById("editButton").classList.remove("d-none");
  document.getElementById("editButtons").classList.add("d-none");

  cancelPasswordEdit();
};

const togglePasswordFields = () => {
  const passwordFields = document.getElementById("passwordFields");
  passwordFields.classList.toggle("d-none");
};

const submitForm = async (event) => {
  event.preventDefault();

  const form = document.getElementById("profileForm");
  const imageInput = document.getElementById("imageUpload");
  const profileUpdateUrl = `http://localhost:5501/api/user/${userData.id}`;
  const changePasswordUrl = `http://localhost:5501/api/user/changePassword/${userData.id}`;

  const newData = {
    firstName: form[0].value,
    middleName: form[1].value,
    lastName: form[2].value,
    email: form[3].value,
    idNumber: form[4].value,
    phoneNumber: form[5].value,
    city: form[6].value,
    gender: form.gender.value,
  };

  const passwordFields = document.getElementById("passwordFields");
  const isPasswordChange = !passwordFields.classList.contains("d-none");
  const formData = new FormData();

  // Append text fields to FormData
  for (const [key, value] of Object.entries(newData)) {
    formData.append(key, value);
  }

  // Check if an image is selected and append it
  if (imageInput.files.length > 0) {
    formData.append("avatar", imageInput.files[0]);
  }

  try {
    // Update profile (with potential image)
    const profileResponse = await fetch(profileUpdateUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData, // Send as FormData
    });

    if (!profileResponse.ok) {
      const errorMessage = await profileResponse.text();
      throw new Error(`Profile update failed: ${errorMessage}`);
    }

    // Handle password change if required
    if (isPasswordChange) {
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;

      const passwordResponse = await fetch(changePasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
      });

      if (!passwordResponse.ok) {
        const errorMessage = await passwordResponse.text();
        throw new Error(`Password change failed: ${errorMessage}`);
      }
    }

    // Success notification
    showNotification(0, "Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    showNotification(1, error.message);
  }

  // Cancel edit mode and re-render profile
  cancelEdit();
  renderProfile();
};

const enablePasswordEdit = () => {
  const passwordFields = document.getElementById("passwordFields");
  passwordFields.classList.remove("d-none");

  document
    .getElementById("passwordFields")
    .querySelectorAll("input")
    .forEach((input) => {
      input.removeAttribute("readonly");
      input.setAttribute("required", true);
    });

  document.getElementById("changePasswordButton").classList.add("d-none");
  document.getElementById("editButtons").classList.remove("d-none");
};

const cancelPasswordEdit = () => {
  const passwordFields = document.getElementById("passwordFields");
  passwordFields.classList.add("d-none");

  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";

  document.getElementById("changePasswordButton").classList.remove("d-none");

  document
    .getElementById("passwordFields")
    .querySelectorAll("input")
    .forEach((input) => {
      input.removeAttribute("required");
    });

  const editButton = document.getElementById("editButton");
  if (editButton.classList.contains("d-none")) {
    document.getElementById("editButtons").classList.add("d-none");
  }
};
