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

let currentCategory = "javascript";
let currentIndex = 0;

function updateCarousel() {
    const items = document.querySelectorAll(".item");

    items.forEach((item) => {
        item.style.transition = "transform 0.4s, opacity 0.4s";
        item.style.opacity = "0"; // Start by hiding all items
        item.style.display = "block";
        item.classList.remove("active", "left", "right");
    });

    const visibleItems = Array.from(items).filter((item) =>
        item.classList.contains(currentCategory)
    );

    visibleItems.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add("active");
            setTimeout(() => {
                item.style.opacity = "1"; // Smoothly show the item
                item.style.display = "block";
            }, 0);
        } else if (
            index ===
            (currentIndex - 1 + visibleItems.length) % visibleItems.length
        ) {
            item.classList.add("left");
            setTimeout(() => {
                item.style.opacity = "0.3";
                item.style.display = "block";
            }, 0);
        } else if (index === (currentIndex + 1) % visibleItems.length) {
            item.classList.add("right");
            setTimeout(() => {
                item.style.opacity = "0.3";
                item.style.display = "block";
            }, 0);
        }
    });
}

function nextItem() {
    const items = Array.from(
        document.querySelectorAll(`.item.${currentCategory}`)
    );
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
}

function prevItem() {
    const items = Array.from(
        document.querySelectorAll(`.item.${currentCategory}`)
    );
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
}

function changeCategory(category) {
    currentCategory = category;
    currentIndex = 0; // Reset to the first item in the selected category
    updateCarousel();
}

document.addEventListener("DOMContentLoaded", updateCarousel);
