const ordersArray = [];
const renderOverview = async () => {
  try {
    activeLoading(); // Show loading indicator

    // Fetch data from the backend API
    console.log(userData.id);
    const response = await fetch(
      `http://localhost:5501/api/orders/filter?userId=${userData.id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);

    let rowsHtml = "";

    // Loop through the data from the backend and generate HTML for each row
    data.forEach((ele) => {
      ordersArray.push(ele);
      rowsHtml += `
        <tr id="${ele._id}">
          <td> Order </td>
          <td>${ele.status}</td>
          <td>${ele.createdAt.slice(0, 10)}</td>
          <td>
            <button class="btn btn-primary" onClick="OverviewnDetailsPage(event)">Details</button>
            <button class="btn btn-danger ms-2" onClick="deleteOrder(event, '${ele._id}')">Delete</button>
          </td>
        </tr>`;
    });

    // Render the main content
    container.innerHTML = `
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center py-3">
            <h1>Overview</h1>
        </div>

        <!-- Table -->
        <div class="card mb-4">
            <div class="card-header">Recent Activities</div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml} 
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Hide the sidebar if open
    document.getElementById("sidebar").classList.remove("show");
  } catch (error) {
    console.error("Error rendering overview:", error);
    container.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Failed to load data. Please try again later.
      </div>`;
  } finally {
    disableLoading(); // Hide loading indicator
  }
};

const deleteOrder = async (event, orderId) => {
  try {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    const response = await fetch(`http://localhost:5501/api/orders/delete/${orderId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete order: ${response.statusText}`);
    }

    // Remove the order from the table
    const row = event.target.closest('tr');
    row.remove();

    // Show success message
    alert('Order deleted successfully');
    
    // Optional: refresh the orders list
    // renderOverview();
  } catch (error) {
    console.error('Error deleting order:', error);
    alert('Failed to delete order. Please try again.');
  }
};

const OverviewnDetailsPage = (event) => {
  const parent = event.target.closest("tr");
  const orderId = parent.getAttribute("id");
  const orderDetails = ordersArray.find((x) => x._id === orderId);
  const orderItems = orderDetails.items;

  const modalHtml = `
    <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content p-4">
          <div class="modal-header">
            <h5 class="modal-title" id="detailsModalLabel">Order Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="content-wrapper">
            <div class="form-wrapper">
              <div class="sale-details-container">
                <h3>Order Information</h3>
                <form id="productForm">
                  <div class="form-group">
                    <label for="productDescription">Products :</label>
                    <div class="form-control">
                      <table class="table">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Product</th>
                            <th scope="col">Price</th>
                            <th scope="col">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${orderItems
                            .map(
                              (item, index) => `
                              <tr>
                                <th scope="row">${index + 1}</th>
                                <td>${item.productId.name}</td>
                                <td>${item.price * item.quantity} $</td>
                                <td>
                                  <button class="btn btn-info btn-item-details" data-item-id="${
                                    item.productId._id
                                  }">
                                    Details
                                  </button>
                                </td>
                              </tr>`
                            )
                            .join("")}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="price">Total Price</label>
                    <input
                      type="text"
                      class="form-control"
                      id="price"
                      placeholder="Enter price"
                      value="${orderDetails.totalPrice} $"
                      readonly
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append modal to the container
  container.innerHTML += modalHtml;

  const detailsModal = new bootstrap.Modal(
    document.getElementById("detailsModal")
  );
  detailsModal.show();

  // Add event listener for item details buttons
  document.querySelectorAll(".btn-item-details").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering other click handlers
      const itemId = e.target.getAttribute("data-item-id");
      const itemDetails = orderItems.find(
        (item) => item.productId._id === itemId
      );

      // Create and show the second modal
      const itemModalHtml = `
  <div class="modal fade" id="itemDetailsModal" tabindex="-1" aria-labelledby="itemDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content p-4">
        <div class="modal-header">
          <h5 class="modal-title" id="itemDetailsModalLabel">Product Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Product Details -->
          <div class="form-group">
            <label>Cover Image:</label>
            <img src="../img/${
              itemDetails.productId.img
            }" alt="Cover Image" class="img-fluid" />
          </div>
          <div class="form-group">
            <label>Other Images:</label>
            <div id="sliderContainer" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                ${itemDetails.productId.moreImgs
                  .map(
                    (img, index) => `
                  <div class="carousel-item ${index === 0 ? "active" : ""}">
                    <img src="../img/${img}" class="d-block w-100" alt="Image ${
                      index + 1
                    }" />
                  </div>`
                  )
                  .join("")}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#sliderContainer" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#sliderContainer" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
          <h4>${itemDetails.productId.name}</h4>
          <p><strong>Price:</strong> ${itemDetails.price} $</p>
          <p><strong>Quantity:</strong> ${itemDetails.quantity}</p>
          <p><strong>Total:</strong> ${
            itemDetails.price * itemDetails.quantity
          } $</p>
          <p><strong>Description:</strong> ${
            itemDetails.productId.desc || "No description available."
          }</p>
          
          <!-- Seller Information -->
          <div class="seller-info mt-4">
            <h5>Seller Contact Information</h5>
            <p><strong>Name:</strong> ${itemDetails.sellerId.firstName} ${
        itemDetails.sellerId.middleName
      } ${itemDetails.sellerId.lastName}</p>
            <p><strong>Email:</strong> ${itemDetails.sellerId.email}</p>
            <p><strong>Phone Number:</strong> ${
              itemDetails.sellerId.phoneNumber
            }</p>
           
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
`;

      container.innerHTML += itemModalHtml;

      const itemDetailsModal = new bootstrap.Modal(
        document.getElementById("itemDetailsModal")
      );

      // Hide the first modal while showing the second
      detailsModal.hide();

      itemDetailsModal.show();

      // Restore the first modal after the second modal is closed
      document
        .getElementById("itemDetailsModal")
        .addEventListener("hidden.bs.modal", () => {
          document.getElementById("itemDetailsModal").remove();
          detailsModal.show();
        });
    });
  });

  // Remove the first modal from DOM after it's closed to avoid duplicates
  document
    .getElementById("detailsModal")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("detailsModal").remove();
    });
};