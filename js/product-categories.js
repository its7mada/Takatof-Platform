const renderCategrories = async () => {
  const categoriesEndpoint = "http://localhost:5501/api/categories";
  try {
    const response = await fetch(categoriesEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const CategoriesArray = await response.json();

    const categoriesContainer = document.getElementById("categories-container");
    categoriesContainer.innerHTML = CategoriesArray.map(
      (categ) =>
        `<div class="circle" id="${categ._id}" onclick="changeClassificationImage('../img/${categ.imageUrl}', '${categ.name}')">
              <div class="circle-cover">
                  <img src="../img/${categ.imageUrl}" alt="${categ.name}" />
              </div>
              <p>${categ.name}</p>
          </div>`
    ).join("");

    const asideCategoriesContainer = document.querySelector(
      ".category-sidebar ul"
    );

    asideCategoriesContainer.innerHTML += CategoriesArray.map((categ) => {
      return `<li id="category-${categ._id}" onclick="changeClassificationImage('../img/${categ.imageUrl}', '${categ.name}')">${categ.name}</li>`;
    }).join("");

    // Now attach event listeners after the categories are rendered
    attachCategoryListeners(CategoriesArray);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Function to attach event listeners to category elements
const attachCategoryListeners = (CategoriesArray) => {
  CategoriesArray.forEach((categ) => {
    const categoryElement = document.getElementById(categ._id);
    categoryElement.addEventListener("click", () => {
      changeClassificationImage(`../img/${categ.imageUrl}`, categ.name);
      getProductsDepandOnCategory(categ._id);
    });

    // Optionally attach event listeners for sidebar items as well
    const sidebarItem = document.getElementById(`category-${categ._id}`);
    sidebarItem.addEventListener("click", () => {
      changeClassificationImage(`../img/${categ.imageUrl}`, categ.name);
      getProductsDepandOnCategory(categ._id);
    });
  });
};

const getProductsDepandOnCategory = async (categNum) => {
  const productsByCategoryEndpoint = `http://localhost:5501/api/products/get?categ=${categNum}`;
  try {
    const response = await fetch(productsByCategoryEndpoint);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products for category ${categNum}: ${response.statusText}`
      );
    }

    const productsArray = await response.json();
    // Pass the fetched products to the render function
    await renderProducts(productsArray.data, categNum);

    // Apply default filters
    defaultFilters();
  } catch (error) {
    console.error("Error fetching products by category:", error);
  }
};

const defaultFilters = () => {
  document.getElementById("filter").value = "product";
  document.getElementById("sort").value = "default";
};

// Initialize categories when the script loads
document.addEventListener('DOMContentLoaded', renderCategrories);