document.addEventListener("DOMContentLoaded", () => {
  const addTaskButton = document.getElementById("add-task-cta");
  const modal = document.getElementById("set-task-overlay");
  const closeModalButton = modal.querySelector(".close-button");
  const addTaskForm = document.getElementById("add-task-form");
  const tasksContainer = document.getElementById("tasks-container");
  const searchInput = document.getElementById("search-input");
  const sortByDateButton = document.getElementById("sort-by-date");
  const sortByAZButton = document.getElementById("sort-by-az");

  let editingTaskIndex = null;

  const getTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const renderTasks = (searchQuery = "", sortType = "none") => {
    tasksContainer.innerHTML = "";
    let tasks = getTasks();

    if (searchQuery) {
      tasks = tasks.filter(task => task.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (sortType === "date") {
      tasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortType === "az") {
      tasks = tasks.sort((a, b) => a.name.localeCompare(b.name));
    }

    const incompleteTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    tasks = [...incompleteTasks, ...completedTasks];

    tasks.forEach((task, index) => {
      const taskItem = document.createElement("div");
      taskItem.classList.add("list-container", "pink");
      if (task.completed) taskItem.classList.add("completed");

      taskItem.innerHTML = `
        <h2 class="list-header">
          <span class="circle pink-background"></span>
          <span class="text task-name">${task.name}</span>
        </h2>
        <p class="task-due-date">Due on ${task.dueDate}</p>
        <p class="task-description">${task.description}</p>
        <div class="task-actions">
          <button class="button green-background complete-task">Complete</button>
          <button class="button blue-background edit-task">Edit</button>
          <button class="button pink-background delete-task">Delete</button>
        </div>
        <ul class="subtasks-list">
          ${task.subtasks
            .map(
              (subtask) => `<li class="subtask-item">${subtask}</li>`
            )
            .join("")}
        </ul>
        <form class="add-subtask-form">
          <input
            type="text"
            class="input white-background subtask-input"
            placeholder="Add a subtask..."
            required
          />
          <button class="button green-background add-subtask">Add</button>
        </form>
      `;

      taskItem.querySelector(".complete-task").addEventListener("click", () => {
        task.completed = !task.completed;
        taskItem.classList.toggle("completed");

        const taskActions = taskItem.querySelector(".task-actions");
        if (task.completed) {
          taskActions.style.display = "none"; 
        } else {
          taskActions.style.display = "block"; 
        }

        saveTasks(tasks);
        renderTasks(searchInput.value, "none");
      });

      taskItem.querySelector(".edit-task").addEventListener("click", () => {
        editingTaskIndex = index;
        const taskToEdit = tasks[editingTaskIndex];
        document.getElementById("name").value = taskToEdit.name;
        document.getElementById("description").value = taskToEdit.description;
        document.getElementById("due-date").value = taskToEdit.dueDate;
        modal.classList.remove("hide");
      });

      taskItem.querySelector(".delete-task").addEventListener("click", () => {
        tasks.splice(index, 1); 
        saveTasks(tasks);
        renderTasks(searchInput.value, "none");
      });

      taskItem.querySelector(".add-subtask").addEventListener("click", (e) => {
        e.preventDefault();
        const subtaskInput = taskItem.querySelector(".subtask-input");
        const newSubtask = subtaskInput.value.trim();
        if (newSubtask) {
          task.subtasks.push(newSubtask);
          saveTasks(tasks);
          renderTasks(searchInput.value, "none"); 
        }
      });

      tasksContainer.appendChild(taskItem);
    });
  };

  addTaskButton.addEventListener("click", () => {
    modal.classList.remove("hide");
    addTaskForm.reset();
    editingTaskIndex = null; 
  });
  closeModalButton.addEventListener("click", () => {
    modal.classList.add("hide");
    addTaskForm.reset();
  });
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const dueDate = document.getElementById("due-date").value;

    const tasks = getTasks();

    if (editingTaskIndex !== null) {
      tasks[editingTaskIndex] = {
        ...tasks[editingTaskIndex],
        name,
        description,
        dueDate,
      };
      editingTaskIndex = null;
    } else {
      tasks.push({
        name,
        description,
        dueDate,
        completed: false,
        subtasks: [],
      });
    }

    saveTasks(tasks);
    renderTasks();
    modal.classList.add("hide");
    addTaskForm.reset();
  });

  sortByDateButton.addEventListener("click", () => {
    renderTasks(searchInput.value, "date");
  });

  sortByAZButton.addEventListener("click", () => {
    renderTasks(searchInput.value, "az");
  });
  searchInput.addEventListener("input", () => {
    renderTasks(searchInput.value);
  });
  renderTasks();
});
