
let task = JSON.parse(localStorage.getItem("task")) || [];

const form = document.getElementById("task-form");
const imageInput = document.getElementById("task-image");
const nameInput = document.getElementById("task-name");
const descriptionInput = document.getElementById("task-description");
const categoryInput = document.getElementById("task-category");
const dateInput = document.getElementById("task-date");
const statusInput = document.getElementById("task-status");
const taskId = document.getElementById("task-id");
const tbody = document.querySelector("#task-table tbody");

function saveToLocalStorage() {
  localStorage.setItem("task", JSON.stringify(task));
}

function resetForm() {
  form.reset();
  taskId.value = "";
}

function renderTable() {
  tbody.innerHTML = "";
  task.forEach((task, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${task.image}" width="50" height="50" alt="task image" /></td>
      <td>${task.name}</td>
      <td>${task.description}</td>
      <td>${task.category}</td>
      <td>${task.date}</td>
      <td>${task.status}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editTask(${task.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const category = categoryInput.value.trim();
  const date = dateInput.value.trim();
  const status = statusInput.value.trim();
  const id = taskId.value;

  // Read the image file as base64
  const file = imageInput.files[0];
  if (!file && !id) return alert("Please select an image.");
  if (!name || !description || !category || !date || !status) {
    return alert("Please fill out all fields.");
  }

  const processTask = (imageData) => {
    if (id) {
      // Edit mode
      const index = task.findIndex((t) => t.id == id);
      task[index] = {
        ...task[index],
        name,
        description,
        category,
        date,
        status,
        image: imageData || task[index].image
      };
    } else {
      // Create new task
      task.push({
        id: Date.now(),
        name,
        description,
        category,
        date,
        status,
        image: imageData
      });
    }

    saveToLocalStorage();
    renderTable();
    resetForm();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      processTask(event.target.result); // base64 image
    };
    reader.readAsDataURL(file);
  } else {
    processTask(); // No image change
  }
});

function editTask(id) {
  const taskToEdit = task.find((p) => p.id == id);
  if (!taskToEdit) return;

  nameInput.value = taskToEdit.name;
  descriptionInput.value = taskToEdit.description;
  categoryInput.value = taskToEdit.category;
  dateInput.value = taskToEdit.date;
  statusInput.value = taskToEdit.status;
  taskId.value = taskToEdit.id;
  // We won't set image input here — browser doesn't allow pre-setting file input
}

function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;
  task = task.filter((p) => p.id !== id);
  saveToLocalStorage();
  renderTable();
}

// Initial render
renderTable();

