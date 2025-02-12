document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const taskCategory = document.getElementById("taskCategory");
  const addTaskButton = document.getElementById("addTask");
  const taskList = document.getElementById("taskList");
  const filterStatus = document.getElementById("filterStatus");
  const filterCategory = document.getElementById("filterCategory");
  const themeToggle = document.getElementById("themeToggle");

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let isDarkMode = localStorage.getItem("darkMode") === "true";

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter((task) => {
      const statusMatch =
        filterStatus.value === "all" ||
        (filterStatus.value === "active" && !task.completed) ||
        (filterStatus.value === "completed" && task.completed);
      const categoryMatch =
        filterCategory.value === "all" ||
        task.category === filterCategory.value;
      return statusMatch && categoryMatch;
    });

    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.innerHTML = `
                  <span class="${task.completed ? "completed" : ""}">
                      ${task.text} - ${task.date} (${task.category})
                  </span>
                  <div class="task-actions">
                    <button class="complete-btn ${
                      task.completed ? "completed" : ""
                    }" title="${
        task.completed ? "Mark as incomplete" : "Mark as complete"
      }">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="edit-btn" title="Edit task"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" title="Delete task"><i class="fas fa-trash"></i></button>
                  </div>
              `;
      li.dataset.index = tasks.indexOf(task);

      const completeBtn = li.querySelector(".complete-btn");
      const editBtn = li.querySelector(".edit-btn");
      const deleteBtn = li.querySelector(".delete-btn");

      completeBtn.addEventListener("click", () =>
        toggleComplete(li.dataset.index)
      );
      editBtn.addEventListener("click", () => editTask(li.dataset.index));
      deleteBtn.addEventListener("click", () => deleteTask(li.dataset.index));

      taskList.appendChild(li);
    });
  }

  function addTask() {
    const text = taskInput.value.trim();
    const date = taskDate.value;
    const category = taskCategory.value;

    if (text !== "" && date !== "" && category !== "") {
      tasks.push({ text, date, category, completed: false });
      saveTasks();
      taskInput.value = "";
      taskDate.value = "";
      taskCategory.value = "";
      renderTasks();
    } else {
      alert("Please fill in all fields before adding a task.");
    }
  }

  function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }

  function editTask(index) {
    const task = tasks[index];
    taskInput.value = task.text;
    taskDate.value = task.date;
    taskCategory.value = task.category;
    deleteTask(index);
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }

  addTaskButton.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  filterStatus.addEventListener("change", renderTasks);
  filterCategory.addEventListener("change", renderTasks);

  themeToggle.addEventListener("click", toggleTheme);

  // Initialize theme
  document.body.classList.toggle("dark-mode", isDarkMode);

  renderTasks();
});
