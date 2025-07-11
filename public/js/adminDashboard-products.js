// const testProductsArray = [
//   {
//     id: 1,
//     sellerName: "Ahmed",
//     name: "Jexon",
//     img: "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4",
//     moreImgs:
//       '["https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4", "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4"]',

//     status: "available",
//     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nam autem possimus debitis, ducimus sapiente facilis odit. Reprehenderit, aliquid reiciendis amet, consectetur corporis, repudiandae rem cumque itaque quisquam porro provident.z",
//     date: "2024-11-04",
//     categ: "electronics",
//     type: "single",
//     quan: 1,
//     price: 25,
//   },
//   {
//     id: 2,
//     sellerName: "Oday",
//     name: "Motor",
//     img: "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4",
//     moreImgs:
//       '["https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4", "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4"]',

//     status: "available",
//     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nam autem possimus debitis, ducimus sapiente facilis odit. Reprehenderit, aliquid reiciendis amet, consectetur corporis, repudiandae rem cumque itaque quisquam porro provident.z",
//     date: "2024-11-04",
//     categ: "Furniture",
//     type: "single",
//     quan: 1,
//     price: 15,
//   },
//   {
//     id: 3,
//     sellerName: "MOhammed",
//     name: " Gear",
//     img: "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4",
//     moreImgs:
//       '["https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4", "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4"]',

//     status: "available",
//     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nam autem possimus debitis, ducimus sapiente facilis odit. Reprehenderit, aliquid reiciendis amet, consectetur corporis, repudiandae rem cumque itaque quisquam porro provident.z",
//     date: "2024-11-04",
//     categ: "games",
//     type: "single",
//     quan: 3,
//     price: 70,
//   },
// ];

const renderAllProducts = async () => {
  activeLoading();
  let rowsHtml = "";

  try {
    const endpoint = "http://localhost:5501/api/products/get";
    const queryParams = ""; // You can add any query parameters if needed, for example: ?status=available
    const url = `${endpoint}${queryParams}`;

    // Fetch the products from the API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const products = await response.json();
    console.log("API Response:", products);

    products.data.forEach((ele) => {
      rowsHtml += `
        <tr id="${ele._id}" sellerName="${ele.sellerName}" ProductName="${
        ele.name
      }" coverImg="${ele.img}" moreImgs='${JSON.stringify(
        ele.moreImgs
      )}' desc="${ele.desc}" status="${ele.status}" date="${ele.date}" categ="${
        ele.categ.name
      }" type="${ele.type}" quan="${ele.quan}" price="${ele.price}">
          <td>${ele.sellerName}</td>
          <td>${ele.name}</td>
          <td><button class="btn btn-primary" onClick="productDetailsPage(event)">Details</button></td>
        </tr>`;
    });

    container.innerHTML = `
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center py-3">
          <h1>All Products</h1>
      </div>

      <!-- Table -->
      <div class="card mb-4">
          <div class="card-header">Recent Products</div>
          <div class="card-body">
              <table class="table">
                  <thead>
                      <tr>
                          <th>Name</th>
                          <th>Product</th>
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
    console.error("Error fetching products:", error);
    container.innerHTML = `<p class="text-danger">Failed to load products. Please try again later.</p>`;
  } finally {
    document.getElementById("sidebar").classList.remove("show");
    disableLoading();
  }
};

const productDetailsPage = (event) => {
  // Retrieve the parent row to access details
  const parent = event.target.closest("tr");

  // Product attributes from the table
  const coverImg = parent.getAttribute("coverImg");
  const moreImgs = JSON.parse(parent.getAttribute("moreImgs") || "[]");

  // Modal HTML structure
  const modalHtml = `
  <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h3 class="modal-title" id="detailsModalLabel">Product Details</h3>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
          <!-- General Information -->
          <div class="mb-4">
            <h5>General Information</h5>
            <div id="productId" style="display:none;">${parent.getAttribute(
              "id"
            )}</div>

            <!-- Cover Image -->
            <div class="mb-3">
              <label>Cover Image:</label>
              <img src="../img/${coverImg}" alt="Cover Image" class="img-fluid rounded" />
            </div>

            <!-- Other Images (Carousel) -->
            <div class="mb-3">
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

            <!-- Seller Name -->
            <div class="form-group mb-3">
              <label for="seller-name">Seller Name</label>
              <input
                type="text"
                class="form-control"
                id="seller-name"
                placeholder="Enter Seller Name"
                value="${parent.getAttribute("sellerName")}"
                readonly
              />
            </div>

            <!-- Product Name -->
            <div class="form-group mb-3">
              <label for="productName">Product Name</label>
              <input
                type="text"
                class="form-control"
                id="productName"
                placeholder="Enter product name"
                value="${parent.getAttribute("ProductName")}"
                readonly
              />
            </div>

            <!-- Product Description -->
            <div class="form-group mb-3">
              <label for="productDescription">Product Description</label>
              <textarea
                class="form-control"
                id="productDescription"
                placeholder="Describe the product"
                rows="3"
                readonly
              >${parent.getAttribute("desc")}</textarea>
            </div>

            <!-- Quantity -->
            <div class="form-group mb-3">
              <label for="quantity">Quantity</label>
              <input
                type="number"
                class="form-control"
                id="quantity"
                placeholder="Enter quantity"
                value="${parent.getAttribute("quan")}"
                readonly
              />
            </div>

            <!-- Price -->
            <div class="form-group mb-3">
              <label for="price">Price</label>
              <input
                type="text"
                class="form-control"
                id="price"
                placeholder="Enter price"
                value="${parent.getAttribute("price")} $"
                readonly
              />
            </div>
          </div>

          <!-- Sale Details -->
          <div class="mt-4">
            <h5>Sale Details</h5>

            <!-- Category -->
            <div class="form-group mb-3">
              <label for="category">Category</label>
              <input
                type="text"
                class="form-control"
                id="category"
                value="${parent.getAttribute("categ")}"
                readonly
              />
            </div>

            <!-- Type -->
            <div class="form-group mb-3">
              <label for="type">Type</label>
              <input
                type="text"
                class="form-control"
                id="type"
                value="${
                  parent.getAttribute("type") === "single"
                    ? "Single Product"
                    : "Group Products"
                }"
                readonly
              />
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer" style="background-color: #fff;">
          
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick="DeleteProduct('${parent.getAttribute(
            "id"
          )}')">
            Delete <i class="bi bi-trash3"></i>
          </button>
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

  // Show the modal using Bootstrap's modal method
  const detailsModal = new bootstrap.Modal(
    document.getElementById("detailsModal")
  );
  detailsModal.show();

  // Remove the modal from DOM after it's closed to avoid duplicates
  document
    .getElementById("detailsModal")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("detailsModal").remove();
    });
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
