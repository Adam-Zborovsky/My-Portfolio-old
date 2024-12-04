let currentCategory = "branding";
let currentIndex = 0;

function toggleMenu() {
    const overlay = document.getElementById("overlay");
    const sideMenu = document.getElementById("side-menu");
    overlay.classList.toggle("active");
    sideMenu.classList.toggle("active");
}
function closeMenu() {
    const overlay = document.getElementById("overlay");
    const sideMenu = document.getElementById("side-menu");
    overlay.classList.remove("active");
    sideMenu.classList.remove("active");
}

function updateCarousel() {
    const items = document.querySelectorAll(".item");
    const visibleItems = Array.from(items).filter((item) =>
        item.classList.contains(currentCategory)
    );

    visibleItems.forEach((item, index) => {
        item.classList.remove("active", "left", "right");
        item.style.display = "none"; // Hide all items by default

        if (index === currentIndex) {
            item.classList.add("active");
            item.style.display = "block";
        } else if (
            index ===
            (currentIndex - 1 + visibleItems.length) % visibleItems.length
        ) {
            item.classList.add("left");
            item.style.display = "block";
        } else if (index === (currentIndex + 1) % visibleItems.length) {
            item.classList.add("right");
            item.style.display = "block";
        }
    });
}

function nextItem() {
    const items = Array.from(
        document.querySelectorAll(`.item.${currentCategory}`)
    );
    currentIndex = (currentIndex + 1) % items.length; // Move to the next item
    updateCarousel();
}

function prevItem() {
    const items = Array.from(
        document.querySelectorAll(`.item.${currentCategory}`)
    );
    currentIndex = (currentIndex - 1 + items.length) % items.length; // Move to the previous item
    updateCarousel();
}

function changeCategory(category) {
    currentCategory = category;
    currentIndex = 0; // Reset to the first item in the new category
    updateCarousel();
}

// Initialize carousel on page load
document.addEventListener("DOMContentLoaded", updateCarousel);
