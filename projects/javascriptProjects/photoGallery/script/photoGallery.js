const galleryContainer = document.getElementById("gallery-container");
const filterButtons = document.getElementById("filter-buttons");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeLightbox = document.getElementById("close-lightbox");
const prevImg = document.getElementById("prev-img");
const nextImg = document.getElementById("next-img");
const searchBar = document.getElementById("search-bar");
const uploadForm = document.getElementById("upload-form");
const categoryForm = document.getElementById("category-form");
const categorySelect = document.getElementById("category-select");
const uploadButton = document.getElementById("upload-button");
const createCategoryButton = document.getElementById("create-category-button");
const newCategoryInput = document.getElementById("new-category");
const addCategoryButton = document.getElementById("add-category-button");

let images = [
    { src: "images/bees.jpg", category: "Pets" },
    { src: "images/bird.jpg", category: "Pets" },
    { src: "images/idfk.jpg", category: "All" },
    { src: "images/machine.jpg", category: "All" },
    { src: "images/snow.jpg", category: "Nature" },
];
let currentImageIndex = 0;
let categories = ["All", "Nature", "Pets", "Me", "Me and Friends"];

function loadImages(filter = "All") {
    galleryContainer.innerHTML = "";
    images
        .filter((img) => filter === "All" || img.category === filter)
        .forEach((img, index) => {
            const imgElement = document.createElement("img");
            imgElement.src = img.src;
            imgElement.dataset.index = index;
            imgElement.alt = img.category;
            imgElement.addEventListener("click", () => openLightbox(index));
            galleryContainer.appendChild(imgElement);
        });

    if (galleryContainer.innerHTML === "") {
        galleryContainer.innerHTML = `<p>No images found for category "${filter}".</p>`;
    }
}

function addCategory() {
    const newCategory = newCategoryInput.value.trim();
    if (newCategory && !categories.includes(newCategory)) {
        categories.push(newCategory);
        updateCategorySelect();
        updateFilterButtons();
        const button = document.createElement("button");
        button.textContent = newCategory;
        button.dataset.filter = newCategory;
        button.classList.add("filter-btn");
        button.addEventListener("click", () => {
            document
                .querySelectorAll(".filter-btn")
                .forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            loadImages(newCategory);
        });
        filterButtons.appendChild(button);
        newCategoryInput.value = "";
    }
}

function updateFilterButtons() {
    filterButtons.innerHTML = "";

    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category;
        button.dataset.filter = category;
        button.classList.add("filter-btn");
        if (category.toLowerCase() === "all") button.classList.add("active");

        button.addEventListener("click", () => {
            document
                .querySelectorAll(".filter-btn")
                .forEach((btn) => btn.classList.remove("active"));

            button.classList.add("active");
            loadImages(category);
        });

        filterButtons.appendChild(button);
    });
}

function updateCategorySelect() {
    categorySelect.innerHTML =
        '<option value="default">Select Category</option>';
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        console.log(option);
        categorySelect.appendChild(option);
    });
}

function uploadImage() {
    const fileInput = document.getElementById("image-upload");
    let file = fileInput.files[0];
    const category = categorySelect.value;
    if (file && category !== "default") {
        const reader = new FileReader();
        reader.onload = (e) => {
            images.push({ src: e.target.result, category });
            loadImages();
            fileInput.value = "";
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a file and a category.");
    }
}

function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = images[index].src;
    lightbox.classList.remove("hidden");
}

closeLightbox.addEventListener("click", () => {
    lightbox.classList.add("hidden");
});

prevImg.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentImageIndex].src;
});

nextImg.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImg.src = images[currentImageIndex].src;
});

searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    galleryContainer.innerHTML = "";

    images
        .filter(
            (img) =>
                img.category.toLowerCase().includes(query) ||
                img.src.toLowerCase().includes(query)
        )
        .forEach((img, index) => {
            const imgElement = document.createElement("img");
            imgElement.src = img.src;
            imgElement.dataset.index = index;
            imgElement.alt = img.category;
            imgElement.addEventListener("click", () => openLightbox(index));
            galleryContainer.appendChild(imgElement);
        });
    if (galleryContainer.innerHTML === "") {
        galleryContainer.innerHTML = `<p>No images found for "${query}".</p>`;
    }
});

createCategoryButton.addEventListener("click", () => {
    if (categoryForm.style.display == "flex") {
        categoryForm.style.display = "none";
    } else {
        categoryForm.style.display = "flex";
    }
});

addCategoryButton.addEventListener("click", () => {
    const newCategory = newCategoryInput.value.trim();
    if (newCategory && !categories.includes(newCategory)) {
        categories.push(newCategory);
        updateCategorySelect();
        updateFilterButtons();
        newCategoryInput.value = "";
        categoryForm.classList.add("hidden");
    } else {
        alert("Category already exists or is invalid.");
    }
});

uploadButton.addEventListener("click", uploadImage);

updateCategorySelect();
updateFilterButtons();
loadImages();
