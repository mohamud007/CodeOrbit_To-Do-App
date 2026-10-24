
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const completedCount = document.getElementById("completed-count");
const emptyMessage = document.getElementById("empty-message");

// Load saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("codeorbit-tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("codeorbit-tasks", JSON.stringify(tasks));
}

// Display tasks on the page
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as completed");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Task text
        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        // Action buttons
        const actions = document.createElement("div");
        actions.className = "task-actions";

        // Edit button
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            const updatedText = prompt("Edit your task:", task.text);

            if (updatedText !== null && updatedText.trim() !== "") {
                task.text = updatedText.trim();
                saveTasks();
                renderTasks();
            } else if (updatedText !== null) {
                alert("Task cannot be empty.");
            }
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            const confirmed = confirm("Are you sure you want to delete this task?");

            if (confirmed) {
                tasks = tasks.filter(function (item) {
                    return item.id !== task.id;
                });

                saveTasks();
                renderTasks();
            }
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    // Update task counters
    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    taskCount.textContent =
        tasks.length + (tasks.length === 1 ? " task" : " tasks");

    completedCount.textContent = completedTasks + " completed";

    // Show or hide the empty message
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    const newTask = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Display saved tasks when the page opens
renderTasks();
