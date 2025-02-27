document.addEventListener("DOMContentLoaded", fetchTasks);

function fetchTasks() {
    fetch("/tasks")
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById("taskList");
            taskList.innerHTML = "";
            data.tasks.forEach(task => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    <span>${task.title} <span class="badge bg-${task.done ? 'success' : 'warning'}">${task.done ? 'Done' : 'Pending'}</span></span>
                    <div>
                        <button class="btn btn-sm btn-${task.done ? 'secondary' : 'success'}" onclick="markTaskDone(${task.id}, ${!task.done})">
                            ${task.done ? 'Undo' : 'Mark as Done'}
                        </button>
                        <button class="btn btn-sm btn-danger ms-2" onclick="deleteTask(${task.id})">
                            Delete
                        </button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching tasks:", error));
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskTitle = taskInput.value.trim();
    if (!taskTitle) return;

    fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskTitle, done: false })
    })
    .then(response => response.json())
    .then(() => {
        taskInput.value = "";
        fetchTasks();
    })
    .catch(error => console.error("Error adding task:", error));
}

function markTaskDone(taskId, newStatus) {
    fetch(`/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newStatus })
    })
    .then(response => response.json())
    .then(() => {
        fetchTasks();  // Refresh task list
    })
    .catch(error => console.error("Error updating task:", error));
}
function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    fetch(`/tasks/${taskId}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(() => {
        fetchTasks();  // Refresh task list
    })
    .catch(error => console.error("Error deleting task:", error));
}