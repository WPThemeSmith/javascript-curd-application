let task = JSON.parse(localStorage.getItem("task")) || [];

const form = document.getElementById("task-form");
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
      <td>${task.image}</td>
      <td>${task.name}</td>
      <td>${task.description}</td>
      <td>${task.category}</td>
      <td>${task.date}</td>
      <td>${task.status}</td>
      <td>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validate form inputs
  const image = imageInput.value.trim();
  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const category = categoryInput.value.trim();
  const date = dateInput.value.trim();
  const status = statusInput.value.trim();

  if (!image || !name || !description || !category || !date || !status) return alert("Please fill out all fields.");

  const id = taskId.value;

  if (id) {
    // Edit mode
    const index = task.findIndex((p) => p.id == id);
    task[index] = {
      id,
      name,
      description,
      category,
      date,
      status,
      image
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
      image
    });
  }

  saveToLocalStorage();
  renderTable();
  resetForm();
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
  imageInput.value = taskToEdit.image;
}

function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;
  task = task.filter((p) => p.id !== id);
  saveToLocalStorage();
  renderTable();
}

// Initial render
renderTable();

