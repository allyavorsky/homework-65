const productForm = document.getElementById("product-form");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const productsList = document.getElementById("products-list");

const API_URL = "/products";

const fetchAndRenderProducts = async () => {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    productsList.innerHTML = "";

    products.forEach((product) => {
      const productItem = document.createElement("div");
      productItem.className = "product-item";
      productItem.innerHTML = `
        <span>${product.name} - ${product.price} UAH (${product.category})</span>
        <div>
          <button class="delete-btn" data-id="${product._id}">Видалити</button>
        </div>
      `;
      productsList.appendChild(productItem);
    });
  } catch (error) {
    console.error("Не вдалося отримати товари:", error);
  }
};

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newProduct = {
    name: nameInput.value,
    price: Number(priceInput.value),
    category: categoryInput.value,
    inStock: true,
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    productForm.reset();

    fetchAndRenderProducts();
  } catch (error) {
    console.error("Не вдалося створити товар:", error);
  }
});

productsList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const productId = event.target.dataset.id;

    try {
      await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
      });

      fetchAndRenderProducts();
    } catch (error) {
      console.error("Не вдалося видалити товар:", error);
    }
  }
});

fetchAndRenderProducts();
