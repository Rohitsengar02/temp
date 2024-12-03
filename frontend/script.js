const API_BASE = "http://localhost:5000/api"; // Backend base URL

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
const viewPageModal = document.getElementById("view-page-modal");
const viewPageDetails = document.getElementById("view-page-details");
const closeViewBtn = document.getElementById("close-view-btn");
const deletePageBtn = document.createElement("button");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const authForms = document.getElementById("auth-forms");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const signupSubmit = document.getElementById("signup-submit");
const loginSubmit = document.getElementById("login-submit");
const storiesSection = document.getElementById("stories-section");
const fetchStoriesBtn = document.getElementById("fetch-stories-btn");
const newStoryBtn = document.getElementById("new-story-btn");
const storiesGrid = document.getElementById("stories-grid");

let quill; // Quill editor instance
let token = localStorage.getItem("token"); // Auth token for API calls
let currentPageIndex = null; // Track the currently viewed or edited page

// Initialize Quill editor
function initializeQuill() {
  const editorContainer = document.getElementById("editor");
  quill = new Quill(editorContainer, {
    theme: "snow",
    placeholder: "Write about your journey...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
    },
  });
}

// Toggle forms visibility
function toggleAuthForms(showSignup) {
  authForms.classList.remove("hidden");
  signupForm.classList.toggle("hidden", !showSignup);
  loginForm.classList.toggle("hidden", showSignup);
}

// Show/Hide sections
function toggleSections(showStories) {
  authForms.classList.add("hidden");
  storiesSection.classList.toggle("hidden", !showStories);
}

// Handle Signup
signupSubmit.addEventListener("click", async () => {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      alert("Signup successful! Please log in.");
      toggleAuthForms(false); // Show login form
    } else {
      const { error } = await response.json();
      alert(error || "Signup failed.");
    }
  } catch (err) {
    console.error(err);
  }
});

// Handle Login
loginSubmit.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      token = data.token;
      localStorage.setItem("token", token);
      alert("Login successful!");
      toggleSections(true); // Show stories section
      fetchStories(); // Load stories after login
    } else {
      alert(data.message || "Login failed.");
    }
  } catch (err) {
    console.error(err);
  }
});

// Fetch Stories
async function fetchStories() {
  try {
    const response = await fetch(`${API_BASE}/stories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const stories = await response.json();
      displayStories(stories);
    } else {
      alert("Failed to fetch stories.");
    }
  } catch (err) {
    console.error(err);
  }
}

// Display Stories
function displayStories(stories) {
  storiesGrid.innerHTML = stories
    .map(
      (story, index) => `
      <div class="page-card" data-index="${index}">
        <h2>${story.title}</h2>
        <p>${story.text}</p>
        <button class="edit-page-btn" onclick="editPage(${index}, '${story._id}')">Edit Story</button>
      </div>
    `
    )
    .join("");
}

// Add New Story
newStoryBtn.addEventListener("click", async () => {
  const title = prompt("Enter story title:");
  const text = prompt("Enter story content:");

  try {
    const response = await fetch(`${API_BASE}/stories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, text, images: [] }),
    });

    if (response.ok) {
      alert("Story added successfully!");
      fetchStories(); // Refresh stories
    } else {
      alert("Failed to add story.");
    }
  } catch (err) {
    console.error(err);
  }
});

// Edit a story
async function editPage(index, storyId) {
  const title = prompt("Edit story title:");
  const text = prompt("Edit story content:");

  try {
    const response = await fetch(`${API_BASE}/stories/${storyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, text, images: [] }),
    });

    if (response.ok) {
      alert("Story updated successfully!");
      fetchStories(); // Refresh stories
    } else {
      alert("Failed to update story.");
    }
  } catch (err) {
    console.error(err);
  }
}

// Delete a story
async function deletePage(storyId) {
  try {
    const response = await fetch(`${API_BASE}/stories/${storyId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Story deleted successfully!");
      fetchStories(); // Refresh stories
    } else {
      alert("Failed to delete story.");
    }
  } catch (err) {
    console.error(err);
  }
}

// Handle Logout
logoutBtn.addEventListener("click", () => {
  token = null;
  localStorage.removeItem("token");
  toggleSections(false); // Show login/signup
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  if (token) {
    toggleSections(true); // Show stories if already logged in
    fetchStories();
  } else {
    toggleAuthForms(false); // Show login form
  }
});
