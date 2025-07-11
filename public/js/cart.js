const CART_KEY = "cart";
const API_URL = "http://localhost:5501/api/cart";

// Initialize the cart on window load
window.onload = async () => {
  await viewCart();
};

// Function to display the cart
const viewCart = async () => {
  const productContainer = document.querySelector(".product-container");
  const userData = JSON.parse(sessionStorage.getItem(AUTH_KEY));

  if (!userData || !userData.id) {
    productContainer.innerHTML = `<h3 class="text-align-center">No Products in Cart</h3>`;
    return;
  }

  const response = await fetch(`${API_URL}/${userData.id}`);
  if (!response.ok) {
    productContainer.innerHTML = `<h3 class="text-align-center">Error fetching cart</h3>`;
    return;
  }

  const cart = await response.json();

  productContainer.innerHTML = "";

  if (cart.items.length === 0) {
    productContainer.innerHTML = `<h3 class="text-align-center">No Products in Cart</h3>`;
    return;
  }

  cart.items.forEach((product) => renderProducts(product));
  renderTotalPrice(cart.items);
};

// Function to render products in the cart
const renderProducts = (product) => {
  console.log(product);

  productDetails = product.productId;

  const productContainer = document.querySelector(".product-container");
  productContainer.innerHTML += `
    <div class="row mb-4 d-flex justify-content-between align-items-center">
      <div class="col-md-2 col-lg-2 col-xl-2">
        <img src="/img/${
          productDetails
        }" class="img-fluid rounded-3" alt="${productDetails.name}">
      </div>
      <div class="col-md-3 col-lg-3 col-xl-3">
       
        <h6 class="mb-0">${productDetails.name}</h6>
      </div>
      <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
        <button class="btn btn-link px-2" onclick="updateQuantity('${
          productDetails._id
        }', 'decrease',${product.quantity})">
          <i class="fas fa-minus"></i>
        </button>
        <input min="1" name="quantity" value="${product.quantity}" type="number"
          class="form-control form-control-sm" readonly />
        <button class="btn btn-link px-2" onclick="updateQuantity('${
          productDetails._id
        }', 'increase',${product.quantity})">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
        <h6 class="mb-0">$ ${(productDetails.price * product.quantity).toFixed(
          2
        )}</h6>
      </div>
      <div class="col-md-1 col-lg-1 col-xl-1 text-end">
        <span class="text-muted" onClick="deleteProduct('${
          productDetails._id
        }')"><i class="fas fa-times"></i></span>
      </div>
    </div>
    <hr class="my-4">`;
};

// Function to update product quantity
const updateQuantity = async (productId, action, quantity) => {
  const userData = JSON.parse(sessionStorage.getItem(AUTH_KEY));

  if (!userData || !userData.id) {
    console.warn("User data not found.");
    return;
  }

  const quantityChange = action === "increase" ? quantity + 1 : quantity - 1;
  const response = await fetch(`${API_URL}/editQuantity`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userData.id,
      productId: productId,
      quantity: quantityChange,
    }),
  });

  if (response.ok) {
    await viewCart();
  } else {
    console.error("Failed to update quantity:", response.statusText);
  }
};

// Function to delete product from cart
const deleteProduct = async (productId) => {
  const userData = JSON.parse(sessionStorage.getItem(AUTH_KEY));

  if (!userData || !userData.id) {
    console.warn("User data not found.");
    return;
  }

  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userData.id,
      productId: productId,
    }),
  });

  if (response.ok) {
    await viewCart();
  } else {
    console.error("Failed to delete product:", response.statusText);
  }
};

// Function to render the total price
const renderTotalPrice = (cart) => {
  const totalPrice = cart.reduce(
    (sum, product) => (sum += product.productId.price * product.quantity),
    0
  );

  document.querySelector(".total-price").textContent = totalPrice.toFixed(2);
  document.querySelector(".total-price1").textContent = totalPrice.toFixed(2);
};
