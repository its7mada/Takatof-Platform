const CART_KEY = "cart";

// const ProductsArray = [
//   {
//     id: 1,
//     name: "Laptop asdf as dafasdf asd asdfads fads fasdf asdf asd ",
//     coverImg: "img/product-1.jpg",
//     images:
//       '["https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4", "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4"]',
//     price: 199,
//     categoryId: "1",
//     categoryName: "Electronics",
//     type: "single",
//   },
//   {
//     id: 1,
//     name: "Laptop ",
//     coverImg: "img/product-1.jpg",
//     images:
//       '["https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4", "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4"]',
//     price: 199,
//     categoryId: "1",
//     categoryName: "Electronics",
//     type: "single",
//   },
//   {
//     id: 3,
//     name: "Laptop ",
//     coverImg: "img/product-1.jpg",
//     images:
//       '["https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4", "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4"]',
//     price: 199,
//     categoryId: "1",
//     categoryName: "Electronics",
//     type: "single",
//   },
//   {
//     id: 1,
//     name: "Laptop ",
//     coverImg: "img/product-1.jpg",
//     images:
//       '["https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4", "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4"]',
//     price: 199,
//     categoryId: "1",
//     categoryName: "Electronics",
//     type: "single",
//   },
//   {
//     id: 1,
//     name: "Laptop ",
//     coverImg: "img/product-1.jpg",
//     images:
//       '["https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4", "https://fastly.picsum.photos/id/453/200/200.jpg?hmac=IO3u3eOcKSOUCe8J1IlvctdxPKLTh5wFXvBT4O3BNs4"]',
//     price: 199,
//     categoryId: "1",
//     categoryName: "Electronics",
//     type: "group",
//   },
// ];

// the categories should be depands on the categoryId , every category in database should have a categoryId
// Fetch products from the API
const fetchProducts = async () => {
  const endpoint = "http://localhost:5501/api/products/get";
  const queryParams = "?status=available&accepted=accepted";
  const url = `${endpoint}${queryParams}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();

    renderProducts(data.data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const renderProducts = async (productsArray = [], categoryId = 0) => {
  activeLoading();
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  if (productsArray.length > 0) {
    productsContainer.innerHTML += productsArray
      .map((product) => {
        return `<div class="product-card product product-2 ${product.type}">
          <div class="product-image">
            <img src="../img/${product.img}" alt="Product Image">
          </div>
          <div class="product-details">
            <div class="product-info">
              <h2 class="product-name">${product.name}</h2>
              <span class="product-price">${product.price} $</span>
            </div>
            <div class="product-btns">
              <span class="product-btn details-btn" onClick="showProductModal(event)" productId="${product._id}">
                <i class="bi bi-eye"></i>
                <span class="btn-text">Product Details</span>
              </span>
              <span class="product-btn add-to-cart-btn">
                <i class="bi bi-bag-plus"></i>
                <span class="btn-text" onClick="addToCart('${product._id}')">Add to Cart</span>
              </span>
            </div>
          </div>
        </div>`;
      })
      .join("");
  } else {
    productsContainer.innerHTML = `<p class="w-100 text-center">No products available.</p>`;
  }

  disableLoading();
};

// Function to add product to cart
const addToCart = async (productId) => {
  try {
    // Get user details (assuming user is logged in and data is stored in sessionStorage)
    const userData = JSON.parse(sessionStorage.getItem(AUTH_KEY));
    if (!userData || !userData.id) {
      Swal.fire({
        title: "Error",
        text: "You must be logged in to add items to the cart.",
        icon: "error",
      });
      return;
    }

    // Prepare cart payload for the backend
    const cartPayload = {
      userId: userData.id,
      productId: productId,
      quantity: 1,
    };

    // Send the cart data to the backend
    const response = await fetch("http://localhost:5501/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartPayload),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to the cart.");
    }

    // Get updated cart details from the backend
    const updatedCart = await response.json();
    console.log(updatedCart);

    // Update the frontend cart
    sessionStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    refreshCartCounter(updatedCart.items.length);

    // Swal.fire({
    //   title: "Success",
    //   text: "Product added to the cart successfully!",
    //   icon: "success",
    // });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    Swal.fire({
      title: "Error",
      text: "Could not add product to the cart. Please try again.",
      icon: "error",
    });
  }
};

//fuction to get product details
const getProductDetails = async (productId) => {
  const endpoint = "http://localhost:5501/api/products/get";
  const url = `${endpoint}/${productId}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Failed to fetch product details: ${response.statusText}`
      );
    }
    console.log(data.data);

    return await data.data;
  } catch (error) {
    console.error("Error fetching product details:", error);

    // return {
    //   id: 0,
    //   name: "Something went wrong",
    //   img: "https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg?t=st=1736325637~exp=1736329237~hmac=a7041e8fe5624095ec8dced526e00d0b99d01d0d537b856c406654cdae5cc69f&w=740",
    //   moreImgs: [
    //     "https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg?t=st=1736325637~exp=1736329237~hmac=a7041e8fe5624095ec8dced526e00d0b99d01d0d537b856c406654cdae5cc69f&w=740",
    //     "https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg?t=st=1736325637~exp=1736329237~hmac=a7041e8fe5624095ec8dced526e00d0b99d01d0d537b856c406654cdae5cc69f&w=740",
    //   ],
    //   status: "selled",
    //   desc: "it looks like something went wrong! try again later",
    //   date: "2024-11-04",
    //   categ: "electronics",
    //   quan: 1,
    //   price: 0,
    // };
  }
};

// Function to show details page
const showProductModal = async (event) => {
  const product = event.target.parentElement;
  const productId = product.getAttribute("productId");
  const productData = await getProductDetails(productId);
  const modalElement = document.getElementById("productModal");
  const productModal = new bootstrap.Modal(modalElement);

  document.getElementById("productName").textContent = productData.name;
  document.getElementById("productDescription").textContent =
    productData.desc || "No description available.";
  document.getElementById("productPrice").textContent = productData.price;
  document.getElementById("productQuantity").textContent =
    productData.quan || "N/A";

  const carouselInner = document.querySelector(
    "#productCarousel .carousel-inner"
  );
  carouselInner.innerHTML = productData.moreImgs
    .map(
      (img, index) => `
    <div class="carousel-item ${index === 0 ? "active" : ""}">
      <img src="../img/${img}" class="d-block w-100" alt="Product Image ${
        index + 1
      }">
    </div>`
    )
    .join("");
  productModal.show();
};

const changeLayout = (layout) => {
  Array.from(document.querySelectorAll(".product")).forEach((product) => {
    product.classList.remove("product-1", "product-2");
    product.classList.add(`product-${layout}`);
  });
};

const handleScreenResize = () => {
  if (window.matchMedia("(max-width: 700px)").matches) {
    changeLayout(2);
  }
};

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

const filterProducts = () => {
  const filterValue = document.getElementById("filter").value;
  const productsGrid = document.querySelector(".products-grid");
  const productCards = Array.from(
    productsGrid.getElementsByClassName("product")
  );
  productCards.map((product) => {
    product.style.display = "flex";
  });

  productCards.map((product) => {
    product.classList.contains(filterValue)
      ? product
      : (product.style.display = "none");
  });
};

const refreshCartCounter = async () => {
  try {
    // Retrieve user data from session storage
    const userData = JSON.parse(sessionStorage.getItem(AUTH_KEY));
    if (!userData || !userData.id) {
      console.warn("User data not found in session storage.");
      return;
    }

    // Fetch the cart count from the backend
    const response = await fetch(
      `http://localhost:5501/api/cart/gitCount/${userData.id}`
    );

    if (!response.ok) {
      console.error("Failed to fetch cart count:", response.statusText);
      return;
    }

    const data = await response.json();
    const { productCount } = data;

    // Update the cart counter in the UI
    const cartCounter = document.getElementById("cart-counter");
    if (!cartCounter) {
      console.warn("Cart counter element not found on the page.");
      return;
    }

    cartCounter.textContent = productCount > 0 ? productCount : 0;
  } catch (error) {
    console.error("Error refreshing cart counter:", error);
  }
};
