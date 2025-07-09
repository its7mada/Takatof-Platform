function handleMainImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Display the main image
      document.getElementById(
        "mainImage"
      ).style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(file);
  }
}

function handleImageUpload(event) {
  const files = event.target.files;
  const container = document.getElementById("smallImagesContainer");

  // Clear previous images
  container.innerHTML = "";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function (e) {
      // Create a new image element
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.width = "23%";
      img.style.height = "100px";
      img.style.objectFit = "cover";
      img.style.border = "2px solid #ccc";
      img.style.borderRadius = "5px";
      img.style.marginRight = "5px";

      // Append the image element to the container
      container.appendChild(img);
    };

    reader.readAsDataURL(file);
  }
}

const submitProduct = () => {
  const productName = document.getElementById("productName").value.trim();
  const productDescription = document
    .getElementById("productDescription")
    .value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const price = document.getElementById("price").value.trim(); // Fixed price input
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const productCondition = document.getElementById("productCondition").value;

  const mainImage = document.getElementById("mainImageUpload").files[0];
  console.log(mainImage);
  const smallImages = Array.from(document.getElementById("imageUpload").files);

  if (!productName || !productDescription || !quantity || !price) {
    Swal.fire({
      title: "Oops!",
      text: "Please Fill All Fields Before Submitting.",
      icon: "error",
    });
    return;
  }

  const productData = {
    name: productName,
    description: productDescription,
    quantity: parseInt(quantity, 10),
    price: parseFloat(price),
    type: type,
    category: category,
    condition: productCondition,
    mainImage: mainImage,
    additionalImages: smallImages,
  };

  console.log("Product Data:", productData);

  submitProductData(productData);
};

const submitProductData = async (data) => {
  try {
    const formData = new FormData();
    const userData = JSON.parse(sessionStorage.getItem(AUTH_KEY));

    // Append product data
    formData.append("sellerId", userData.id);
    formData.append("name", data.name);
    formData.append("desc", data.description);
    formData.append("quan", data.quantity);
    formData.append("price", data.price);
    formData.append("type", data.type);
    formData.append("categ", data.category);
    formData.append("condition", data.condition || "new");

    // Append main image if it exists
    if (data.mainImage && data.mainImage instanceof File) {
      formData.append("mainImage", data.mainImage);
    } else {
      console.error("Main image is not a valid File object");
      Swal.fire({
        title: "Failed",
        text: "Main image is required and should be a valid file.",
        icon: "error",
      });
      return;
    }

    // Append additional images if they exist
    if (data.additionalImages && data.additionalImages.length > 0) {
      data.additionalImages.forEach((imageFile) => {
        if (imageFile instanceof File) {
          formData.append("additionalImages", imageFile);
        } else {
          console.error("Invalid file type in additional images");
        }
      });
    }

    // Print formData content for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Send data to backend
    const response = await fetch("http://localhost:5501/api/products/add", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to submit product data.");

    const result = await response.json();
    console.log("Server Response:", result);

    // Success notification
    Swal.fire({
      title: "Good job!",
      text: "Your product was added successfully.",
      icon: "success",
    });
  } catch (error) {
    console.error("Error submitting product data:", error);
    Swal.fire({
      title: "Failed",
      text: "Failed to submit product. Please try again later.",
      icon: "error",
    });
  }
};
