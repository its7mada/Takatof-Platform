const renderdashboard = async () => {
  activeLoading();
  let rowsHtml = "";


    container.innerHTML = ` 
    
<!-- Bootstrap Icons (Make sure to include this in your <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

<!-- Dashboard Title -->
<h2 class="text-start mb-4 fw-bold">Admin Dashboard</h2>

<!-- Dashboard Cards Section -->
<div id="dashboardCards" class="row row-cols-1 row-cols-md-2 g-4">

    <!-- Requests Card -->
    <div class="col">
        <a href="#" onclick="renderRequests()" class="text-decoration-none">
            <div class="card text-white shadow-sm border-0 custom-card" style="background: linear-gradient(135deg, #4e54c8, #8f94fb);">
                <div class="card-body text-center py-5">
                    <i class="bi bi-envelope-open-fill"></i>
                    <h5 class="card-title fw-semibold">Requests</h5>
                    <p class="card-text small">Review new incoming requests.</p>
                </div>
            </div>
        </a>
    </div>

    <!-- Products Card -->
    <div class="col">
        <a href="#" onclick="renderAllProducts()" class="text-decoration-none">
            <div class="card text-white shadow-sm border-0 custom-card" style="background: linear-gradient(135deg, #43cea2, #185a9d);">
                <div class="card-body text-center py-5">
                    <i class="bi bi-box-seam"></i>
                    <h5 class="card-title fw-semibold">Products</h5>
                    <p class="card-text small">Manage all products.</p>
                </div>
            </div>
        </a>
    </div>

    <!-- Users Card -->
    <div class="col">
        <a href="#" onclick="renderAllUsers()" class="text-decoration-none">
            <div class="card text-white shadow-sm border-0 custom-card" style="background: linear-gradient(135deg, #ff6a00, #ee0979);">
                <div class="card-body text-center py-5">
                    <i class="bi bi-person-lines-fill"></i>
                    <h5 class="card-title fw-semibold">Users</h5>
                    <p class="card-text small">Manage user accounts.</p>
                </div>
            </div>
        </a>
    </div>

    <!-- Profile Card -->
    <div class="col">
        <a href="#" onclick="renderProfile()" class="text-decoration-none">
            <div class="card text-white shadow-sm border-0 custom-card" style="background: linear-gradient(135deg, #ff416c, #ff4b2b);">
                <div class="card-body text-center py-5">
                    <i class="bi bi-person-vcard"></i>
                    <h5 class="card-title fw-semibold">Profile</h5>
                    <p class="card-text small">Update your profile information.</p>
                </div>
            </div>
        </a>
    </div>

    <!-- Home Page Card -->
    <div class="col">
        <a href="#" onclick="backToHomePage()" class="text-decoration-none">
            <div class="card text-white shadow-sm border-0 custom-card" style="background: linear-gradient(135deg, #00c6ff, #0072ff);">
                <div class="card-body text-center py-5">
                    <i class="bi bi-house-door-fill"></i>
                    <h5 class="card-title fw-semibold">Home Page</h5>
                    <p class="card-text small">Return to the main website.</p>
                </div>
            </div>
        </a>
    </div>

    <!-- Logout Card -->
    <div class="col">
        <a href="#" onclick="logOut()" class="text-decoration-none">
            <div class="card text-white shadow-sm border-0 custom-card" style="background: linear-gradient(135deg, #667db6, #0082c8);">
                <div class="card-body text-center py-5">
                    <i class="bi bi-box-arrow-right"></i>
                    <h5 class="card-title fw-semibold">Logout</h5>
                    <p class="card-text small">Sign out of the admin panel.</p>
                </div>
            </div>
        </a>
    </div>

</div>

<!-- Custom CSS for Hover Effects -->
<style>
    .custom-card {
        border-radius: 1rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .custom-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    
   
</style>


`;
 disableLoading();
};
