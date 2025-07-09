window.onload = () => {
  const userData = JSON.parse(sessionStorage.getItem(AUTH_KEY));
  renderProducts();
};

const API_URL = "http://localhost:5501/api";
const CART_KEY = "cart";
const userData = JSON.parse(sessionStorage.getItem(AUTH_KEY));
// Function to calculate the total price

const calcTotalPrice = (items) => {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );
  return `
    <li class="total list-group-item d-flex justify-content-between" style="background-color: #80808038;">
      <span>Total</span>
      <strong>$${totalPrice.toFixed(2)}</strong>
    </li>`;
};

// Function to render products in the cart

const renderProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/cart/${userData.id}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.error("Cart not found.");
        document.querySelector(".bill-container-products").innerHTML = `
          <li class="list-group-item text-center">Your cart is empty.</li>`;
        return;
      } else {
        throw new Error("Failed to fetch cart data");
      }
    }

    const cart = await response.json();
    console.log(cart);

    const productContainer = document.querySelector(".bill-container-products");
    productContainer.innerHTML = "";

    if (cart.items.length === 0) {
      productContainer.innerHTML = `<li class="list-group-item text-center">Your cart is empty.</li>`;
      return;
    }

    cart.items.forEach((product) => {
      productContainer.innerHTML += `
        <li class="list-group-item d-flex justify-content-between lh-condensed">
          <div>
            <h6 class="my-0">${product.productId.name}</h6>
            
          </div>
          <span class="text-muted">$${(
            product.productId.price * product.quantity
          ).toFixed(2)}</span>
        </li>`;
    });

    productContainer.innerHTML += calcTotalPrice(cart.items);
  } catch (error) {
    console.error("Error loading cart:", error);
    document.querySelector(".bill-container-products").innerHTML = `
      <li class="list-group-item text-center">Failed to load cart. Please try again later.</li>`;
  }
};

// Function to calculate total price (unchanged)

// Call renderProducts to load the cart when the page loads
renderProducts();

// Function to handle form submission
const handleCheckout = async (event) => {
  event.preventDefault();

  // Retrieve form data
  const firstName = document
    .querySelector("input[placeholder='First Name']")
    .value.trim();
  const middleName = document
    .querySelector("input[placeholder='Middle Name']")
    .value.trim();
  const lastName = document
    .querySelector("input[placeholder='Last Name']")
    .value.trim();
  const phoneNumber = document
    .querySelector("input[placeholder='Phone Number']")
    .value.trim();
  const city = document.querySelector("input[placeholder='City']").value.trim();
  const address = document
    .querySelector("input[placeholder='Address']")
    .value.trim();
  const address2 = document
    .querySelector("input[placeholder='Address 2 (Optional)']")
    .value.trim();

  if (!firstName || !lastName || !phoneNumber || !city || !address) {
    Swal.fire({
      icon: "error",
      title: "Missing Information",
      text: "Please fill in all required fields.",
    });

    return;
  }

  // Construct request payload
  const orderData = {
    userId: userData.id,
    contactInfo: {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      city,
      address,
      address2,
    },
  };

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Order placed successfully!",
        text: "Your order has been processed.",
      }).then(() => {
        window.location.href = "../index.html";
      });
      sessionStorage.removeItem(CART_KEY);
      renderProducts();
    } else {
      const errorData = await response.json();
      Swal.fire({
        icon: "error",
        title: "Failed to place order",
        text: errorData.message || "An error occurred.",
      });
    }
  } catch (error) {
    console.error("Error placing order:", error);
    Swal.fire({
      icon: "error",
      title: "Order Error",
      text: "An error occurred while placing your order. Please try again.",
    });
  }
};

document.querySelector("form").addEventListener("submit", handleCheckout);

renderProducts();
