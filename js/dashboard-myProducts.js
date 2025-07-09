// My Products Page Functions
const renderMyProducts = async () => {
  try {
    await activeLoading();

    const response = await fetch(
      `http://localhost:5501/api/products/get?sellerId=${userData.id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();

    let rowsHtml = "";

    // Loop through the data from the backend and generate HTML for each row
    data.data.forEach((ele, index) => {
      console.log(ele);

      rowsHtml += `
        <tr id="${ele._id}" coverImg="${ele.img}" moreImgs='${JSON.stringify(
        ele.moreImgs
      )}' ProductName="${ele.name}" desc="${ele.desc}" status="${
        ele.status
      }" date="${ele.createdAt}" categ="${ele.categ.name}" quan="${
        ele.quan
      }" price="${ele.price}" type="${ele.type}" state=${ele.condition}>
          <td>${index + 1}</td>
          <td style="width:60px"><img style="width:100%" src="../img/${
            ele.img
          }" class="w-10 prodcut-img"/></td>
          <td>${ele.name}</td>
          <td><button class="btn btn-primary" onClick="productDetails(event)">Details</button></td>
        </tr>`;
    });

    // Render the main content
    container.innerHTML = `
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center py-3">
            <h1>My Products</h1>
        </div>

        <!-- Table -->
        <div class="card mb-4">
            <div class="card-header">My Products</div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
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

    // Hide the sidebar if open
    document.getElementById("sidebar").classList.remove("show");
  } catch (error) {
    console.error("Error rendering My Products:", error);
    container.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Failed to load data. Please try again later.
      </div>`;
  } finally {
    disableLoading(); // Hide loading indicator
  }
};

const productDetails = (event) => {
  const parent = event.target.closest("tr");

  // Product attributes from the table
  const coverImg = parent.getAttribute("coverImg");
  const moreImgs = JSON.parse(parent.getAttribute("moreImgs") || "[]");

  // Modal HTML structure
  const modalHtml = `
    <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content p-4">
          <div class="modal-header">
            <h5 class="modal-title" id="detailsModalLabel">Product Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="content-wrapper">
            <!-- View Mode -->
            <div id="viewMode">
            <div id="productId" style="display:none;">${parent.getAttribute(
              "id"
            )}</div>
              <div class="form-group">
                <label>Cover Image:</label>
                <img src="../img/${coverImg}" alt="Cover Image" class="img-fluid" />
              </div>
              <div class="form-group">
                <label>Other Images:</label>
                <div id="sliderContainer" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-inner">
                    ${moreImgs
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
            </div>

            <!-- Edit Mode -->
            <div id="editMode" style="display: none;">
              <div class="form-group">
                <input type="checkbox" id="editImagesCheckbox" />
                <label for="editImagesCheckbox">Edit Images</label>
              </div>

              <!-- Cover Image Input -->
              <div class="form-group">
                <label for="coverImage">Cover Image</label>
                <input 
                  type="file" 
                  class="form-control" 
                  accept="image/*"
                  id="coverImage" 
                  disabled
                />
              </div>

              <!-- More Images Input -->
              <div class="form-group">
                <label for="moreImages">More Images</label>
                <input 
                  type="file" 
                  class="form-control" 
                  id="moreImages"
                  accept="image/*" 
                  multiple 
                  disabled
                />
              </div>
            </div>

            <!-- General Information -->
            <div class="sale-details-container">
              <h3>General Information</h3>
              <form id="productForm">
                <label for="productName">Product Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="productName" 
                  value="${parent.getAttribute("ProductName")}" 
                  readonly 
                />
                <div class="form-group">
                  <label for="productDescription">Product Description</label>
                  <textarea 
                    class="form-control" 
                    id="productDescription" 
                    rows="3" 
                    readonly 
                  >${parent.getAttribute("desc")}</textarea>
                </div>
                <div class="form-group">
                  <label for="quantity">Quantity</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="quantity" 
                    value="${parent.getAttribute("quan")}" 
                    readonly 
                  />
                </div>
                <div class="form-group">
                  <label for="price">Price</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="price" 
                    value="${parent.getAttribute("price")}" 
                    readonly 
                  />
                </div>
                <div class="form-group">
              <label for="category">Category</label>
              <select class="form-control" id="category" disabled>
                <option value="67708c69f5314a57f1d3f2ac" ${
                  parent.getAttribute("categ") === "furniture" ? "selected" : ""
                }>Furniture</option>
                <option value="67708c8ff5314a57f1d3f2ae" ${
                  parent.getAttribute("categ") === "electronics"
                    ? "selected"
                    : ""
                }>Electronics</option>
                <option value="67708cc6f5314a57f1d3f2b2" ${
                  parent.getAttribute("categ") === "games" ? "selected" : ""
                }>Electronic or Regular Games</option>
                <option value="67708cd7f5314a57f1d3f2b4" ${
                  parent.getAttribute("categ") === "Sports and Fitness"
                    ? "selected"
                    : ""
                }>Sports and Fitness</option>
                <option value="67708caef5314a57f1d3f2b0" ${
                  parent.getAttribute("categ") === "Industrial equipment"
                    ? "selected"
                    : ""
                }>Sports and Fitness</option>
              </select>

              <div class="form-group">
                            <label for="type">Type</label>
                            <select class="form-control" id="type" required disabled>
                                <option value="single" ${
                                  parent.getAttribute("type") === "single"
                                    ? "selected"
                                    : ""
                                } >Single Product</option>
                                <option value="group"  ${
                                  parent.getAttribute("type") === "single"
                                    ? ""
                                    : "selected"
                                }>Group Products</option>
                            </select>
                        </div>
                <div class="form-group">
                  <label for="state">State</label>
                  <div 
                    class="form-control" 
                    id="state" 
                disabled
                  >${parent.getAttribute("state")}</div>
                </div>
            </div>
              </form>
            </div>
          </div>
          <div class="modal-footer">
           <button type="button" id="deleteButton" class="btn btn-danger" data-bs-dismiss="modal" onClick="DeleteProduct('${parent.getAttribute(
             "id"
           )}')">
            Delete <i class="bi bi-trash3"></i></button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="editButton">Edit</button>
            <button type="button" class="btn btn-success" id="saveButton" style="display: none;" onclick="saveProductDetails('${parent.getAttribute(
              "id"
            )}')">Save</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append modal to the container
  container.innerHTML += modalHtml;

  // Show the modal using Bootstrap's modal method
  const detailsModal = new bootstrap.Modal(
    document.getElementById("detailsModal")
  );
  detailsModal.show();

  const editButton = document.getElementById("editButton");
  const saveButton = document.getElementById("saveButton");
  const viewMode = document.getElementById("viewMode");
  const editMode = document.getElementById("editMode");

  const editImagesCheckbox = document.getElementById("editImagesCheckbox");
  const coverImageInput = document.getElementById("coverImage");
  const moreImagesInput = document.getElementById("moreImages");

  const deleteButton = document.getElementById("deleteButton");

  // Switch to Edit Mode
  editButton.addEventListener("click", () => {
    // Switch UI modes
    viewMode.style.display = "none";
    editMode.style.display = "block";
    editButton.style.display = "none";
    saveButton.style.display = "inline-block";

    // Enable form fields for editing
    const formElements = document.querySelectorAll(
      "#productForm input, #productForm textarea, #productForm select"
    );
    formElements.forEach((el) => el.removeAttribute("readonly"));

    // Enable the select element explicitly
    document.getElementById("category").removeAttribute("disabled");
  });

  // Enable/Disable image inputs based on checkbox
  editImagesCheckbox.addEventListener("change", () => {
    const isChecked = editImagesCheckbox.checked;
    coverImageInput.disabled = !isChecked;
    moreImagesInput.disabled = !isChecked;
  });

  // Remove modal from DOM after closing
  document
    .getElementById("detailsModal")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("detailsModal").remove();
    });

  // // Handle Delete Button
  // deleteButton.addEventListener("click", () => {
  //   detailsModal.hide();
  //   deleteProduct(parent.getAttribute("id"));
  // });
};

const DeleteProduct = async (productId) => {
  try {
    const endpoint = `http://localhost:5501/api/products/${productId}`;
    const response = await fetch(endpoint, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }
    showNotification(0, "Product Deleted Successfully");
    renderAllProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
    showNotification(1, "Failed to delete the product. Please try again.");
  }
};

// Enable editing of fields
const enableEditing = () => {
  document.getElementById("editBtn").classList.add("d-none");
  document.getElementById("saveBtn").classList.remove("d-none");
  const formElements = document.querySelectorAll(
    "#productForm input, #productForm textarea, #productForm select"
  );
  formElements.forEach((el) => el.removeAttribute("readonly"));
  document.getElementById("category").removeAttribute("disabled");
  document.getElementById("status").removeAttribute("disabled");
};

const saveProductDetails = async () => {
  const updatedProduct = {
    id: document.getElementById("productId").textContent,
    name: document.getElementById("productName").value,
    productDescription: document
      .getElementById("productDescription")
      .value.trim(),
    quantity: document.getElementById("quantity").value,
    price: document.getElementById("price").value,
    category: document.getElementById("category").value,
    condition: document.getElementById("state").textContent,
    type: document.getElementById("type").value,
    mainImage: document.getElementById("coverImage").files[0],
    additionalImages: Array.from(document.getElementById("moreImages").files),
  };

  console.log("Updated Product Data:", updatedProduct);

  // Check if there are any required fields missing (optional validation)
  if (
    !updatedProduct.name ||
    !updatedProduct.productDescription ||
    !updatedProduct.quantity ||
    !updatedProduct.price
  ) {
    Swal.fire({
      title: "Oops!",
      text: "Please fill in all the required fields.",
      icon: "error",
    });
    return;
  }

  // Prepare FormData for submission
  const formData = new FormData();
  formData.append("name", updatedProduct.name);
  formData.append("desc", updatedProduct.productDescription);
  formData.append("quan", updatedProduct.quantity);
  formData.append("price", updatedProduct.price);
  formData.append("type", updatedProduct.type);
  formData.append("categ", updatedProduct.category);
  formData.append("condition", updatedProduct.condition || "new"); // Default to 'new' if not provided
  formData.append("status", "available"); // or any other status you wish to set by default

  // Append main image if exists
  if (updatedProduct.mainImage) {
    formData.append("mainImage", updatedProduct.mainImage);
  }

  // Append additional images if they exist
  if (updatedProduct.additionalImages.length > 0) {
    updatedProduct.additionalImages.forEach((image, index) => {
      formData.append(`additionalImages`, image);
    });
  }

  // Send the PUT request with FormData to the server
  try {
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await fetch(
      `http://localhost:5501/api/products/${updatedProduct.id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update product data.");
    }

    const result = await response.json();
    console.log("Server Response:", result);

    // Close the modal
    const detailsModalElement = document.getElementById("detailsModal");
    const detailsModalInstance =
      bootstrap.Modal.getInstance(detailsModalElement);
    detailsModalInstance.hide();

    // Re-render the list of products after successful update
    renderMyProducts();

    // Success notification
    Swal.fire({
      title: "Success!",
      text: "Product updated successfully.",
      icon: "success",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    Swal.fire({
      title: "Failed",
      text: "Failed to update product. Please try again later.",
      icon: "error",
    });
  }
};
