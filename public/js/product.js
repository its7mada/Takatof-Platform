// on load product page
window.onload = async () => {
  await renderCategrories();
  handleScreenResize();
  fetchProducts();
  refreshCartCounter();
};

const filterProductsByCategory = (category) => {
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const productCategory = product
      .querySelector(".product-category")
      .textContent.trim();

    // If the product matches the category or the category is "all", show it, otherwise hide it
    if (
      productCategory.toLowerCase() === category.toLowerCase() ||
      category === "all"
    ) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
};

// // Add click event listeners to category circles
// document.querySelectorAll(".circle").forEach((circle) => {
//   circle.addEventListener("click", function () {
//     const category = this.querySelector("p").textContent.trim();
//     filterProductsByCategory(category);
//   });
// });

// Add click event listener to "Categories" sidebar
document.querySelectorAll(".category-sidebar ul li").forEach((li) => {
  li.addEventListener("click", function () {
    const category = this.textContent.trim().split(" ")[0];
    filterProductsByCategory(category);
  });
});

const sortProducts = () => {
  const sortValue = document.getElementById("sort").value;
  const productsGrid = document.querySelector(".products-grid");
  const productCards = Array.from(
    productsGrid.getElementsByClassName("product-card")
  );

  // Sort products based on the selected value
  switch (sortValue) {
    case "price-asc":
      productCards.sort((a, b) => {
        return (
          parseFloat(
            a.querySelector(".product-price").textContent.replace("$", "")
          ) -
          parseFloat(
            b.querySelector(".product-price").textContent.replace("$", "")
          )
        );
      });
      break;
    case "price-desc":
      productCards.sort((a, b) => {
        return (
          parseFloat(
            b.querySelector(".product-price").textContent.replace("$", "")
          ) -
          parseFloat(
            a.querySelector(".product-price").textContent.replace("$", "")
          )
        );
      });
      break;
    case "name-asc":
      productCards.sort((a, b) => {
        return a
          .querySelector(".product-name")
          .textContent.localeCompare(
            b.querySelector(".product-name").textContent
          );
      });
      break;
    case "name-desc":
      productCards.sort((a, b) => {
        return b
          .querySelector(".product-name")
          .textContent.localeCompare(
            a.querySelector(".product-name").textContent
          );
      });
      break;
    default:
      // Do nothing if default sorting is selected
      break;
  }

  // Remove existing products and re-add them in the new order
  productsGrid.innerHTML = "";
  productCards.forEach((card) => productsGrid.appendChild(card));
};

// Change Classification Image and Label
const changeClassificationImage = (imageSrc, categoryName) => {
  const mainImage = document.getElementById("main-classification-image");
  const categoryLabel = document.getElementById("category-label");

  mainImage.src = imageSrc;
  categoryLabel.innerText = categoryName;
  categoryLabel.style.display = "block";
};
