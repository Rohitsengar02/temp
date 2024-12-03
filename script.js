// DOM Elements
const newPageBtn = document.getElementById("new-page-btn");
const modal = document.getElementById("new-page-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const savePageBtn = document.getElementById("save-page-btn");
const toggleModeBtn = document.getElementById("toggle-mode-btn");
const pagesGrid = document.getElementById("pages-grid");
const pageTitleInput = document.getElementById("page-title");
const imageInput = document.getElementById("image-input");
const imagePreview = document.getElementById("image-preview");

let quill;
let currentPageIndex = null;

// Initialize Quill editor
function initializeQuill() {
  const editorContainer = document.getElementById("editor");
  quill = new Quill(editorContainer, {
    theme: "snow",
    placeholder: "Write about your journey...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
      ],
    },
  });
}

// Load pages
function loadPages() {
  const pages = JSON.parse(localStorage.getItem("journeyPages")) || [];
  pagesGrid.innerHTML = "";

  pages.forEach((page, index) => {
    const pageCard = document.createElement("div");
    pageCard.classList.add("page-card");
    pageCard.setAttribute("draggable", true);

    if (page.title) {
      const titleElement = document.createElement("h2");
      titleElement.textContent = page.title;
      pageCard.appendChild(titleElement);
    }

    if (page.images.length > 0) {
      const thumbnailElement = document.createElement("img");
      thumbnailElement.src = page.images[0];
      thumbnailElement.alt = "Page Thumbnail";
      pageCard.appendChild(thumbnailElement);
    }

    const editButton = document.createElement("button");
    editButton.textContent = "Edit Story";
    editButton.className = "edit-page-btn";
    editButton.addEventListener("click", () => editPage(index));
    pageCard.appendChild(editButton);

    pageCard.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
      pageCard.classList.add("dragging");
    });

    pageCard.addEventListener("dragend", () => {
      pageCard.classList.remove("dragging");
    });

    pagesGrid.appendChild(pageCard);
  });

  pagesGrid.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggingCard = document.querySelector(".dragging");
    const siblings = [...pagesGrid.querySelectorAll(".page-card:not(.dragging)")];
    const nextSibling = siblings.find((sibling) => e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2);
    pagesGrid.insertBefore(draggingCard, nextSibling);
  });

  pagesGrid.addEventListener("drop", (e) => {
    const oldIndex = e.dataTransfer.getData("text/plain");
    const newIndex = [...pagesGrid.children].indexOf(document.querySelector(".dragging"));
    reorderPages(oldIndex, newIndex);
  });
}

function reorderPages(oldIndex, newIndex) {
  const pages = JSON.parse(localStorage.getItem("journeyPages"));
  const [movedPage] = pages.splice(oldIndex, 1);
  pages.splice(newIndex, 0, movedPage);
  localStorage.setItem("journeyPages", JSON.stringify(pages));
  loadPages();
}

// Edit page logic
function editPage(index) {
  // Fill modal fields
  modal.classList.remove("hidden");
  currentPageIndex = index;
}

// Save page logic
// ...

document.addEventListener("DOMContentLoaded", () => {
  initializeQuill();
  loadPages();
});
