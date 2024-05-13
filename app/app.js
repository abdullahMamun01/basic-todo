import { generateCompleteTodoItemUI, generateTodoItemUI } from "./utils.js";

const initialTodo = [
  {
      "id": 4,
      "task": "Call plumber",
      "description": "Fix the leaking pipe in the bathroom.",
      "date": "2024-05-14",
      "finishedDate": null,
      "complete": false
  },
  {
      "id": 5,
      "task": "Exercise",
      "description": "Go for a 30-minute jog in the park.",
      "date": "2024-05-15",
      "finishedDate": null,
      "complete": false
  },
  {
      "id": 6,
      "task": "Read book",
      "description": "Read the first three chapters of 'The Great Gatsby'.",
      "date": "2024-05-16",
      "finishedDate": null,
      "complete": false
  },
  {
      "id": 7,
      "task": "Pay bills",
      "description": "Pay electricity, water, and internet bills.",
      "date": "2024-05-17",
      "finishedDate": null,
      "complete": false
  },
  {
      "id": 8,
      "task": "Attend meeting",
      "description": "Participate in the weekly team meeting at work.",
      "date": "2024-05-18",
      "finishedDate": null,
      "complete": false
  },
  {
      "id": 9,
      "task": "Write report",
      "description": "Prepare a progress report for the project.",
      "date": "2024-05-19",
      "finishedDate": null,
      "complete": false
  },
  {
      "id": 10,
      "task": "Clean the house",
      "description": "Vacuum, dust, and mop all rooms.",
      "date": "2024-05-20",
      "finishedDate": null,
      "complete": false
  }
]

//finding todo list from the local storage
let todoList = JSON.parse(localStorage.getItem("todos"))
  ? JSON.parse(localStorage.getItem("todos"))
  : [];

let editId = null;
let searchTodo = null

const completeList = handleDocumentById("complete-list");
const container = handleDocumentById("main");
const authenticateBtn = handleDocumentById("auth");
const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
const form = handleDocumentById("todo-form");
const searchInput = handleDocumentById('search')

function updateTotalTasksCount(domId, taskList) {
  const element = handleDocumentById(domId);
  element.innerText = taskList.length;
}

function handleDocumentById(id) {
  return document.getElementById(id);
}

function handleSearch(e){
  searchTodo = e.target.value
  displayTodoList()

}


//

//sort with date
function sortByDate(e){
  const ascOrDesc = e.target.value
  const sortTodo = ascOrDesc === 'asc' ? todoList.sort(sortAsc) : todoList.sort(sortDesc)
  displayTodoList()
}

function sortAsc(a, b) {
  if (a.finishedDate === b.finishedDate) {
      return a.task.localeCompare(b.task);
  }
  return a.finishedDate.localeCompare(b.finishedDate);
}

function sortDesc(a, b) {
  if (a.finishedDate === b.finishedDate) {
      return b.task.localeCompare(a.task);
  }
  return b.finishedDate.localeCompare(a.finishedDate);
}




//show the empty todo message
function updateEmptyTodoMessage(todoList) {
  const emptyTodos = handleDocumentById("empty-todos");
  const todos = todoList.filter((todo) => !todo.complete);
  const emptyTodoMessage = handleDocumentById("empty-todo-text");

  if (todos.length === 0 && !emptyTodoMessage) {
    const h1 = document.createElement("h1");
    h1.innerText = "Todo is empty now!";
    h1.className = "text-gray-100 text-center";
    h1.id = "empty-todo-text";

    emptyTodos.appendChild(h1);
  } else if (todos.length && emptyTodoMessage) {
    emptyTodoMessage.parentNode.removeChild(emptyTodoMessage);
  } else return;
}




//update todo and ui
function enterEditMode(todoId) {
  editId = todoId;
  const findTodo = findTodoById(todoId);
  const title = handleDocumentById("todo-title");
  title.value = findTodo.task;
  title.focus();
  handleDocumentById("todo-description").value = findTodo.description;
  handleDocumentById("finished-date").value = findTodo.finishedDate;
  handleDocumentById("submit").innerText = "update task";
}



//render list of todo already complete
function displayCompleteList() {
  completeList.innerHTML = "";
  const completeTodoList = todoList.filter((todo) => todo.complete);

  completeTodoList.forEach((todo) => {
    generateCompleteTodoItemUI(todo.task, todo.id);
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  //delete todo listener
  attachEventListenerToButtons(deleteButtons, deleteTodoById);
  updateTotalTasksCount("totalCompletedTasks", completeTodoList);
}

//attach event listener buttons
function attachEventListenerToButtons(buttons, callback) {
  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const todoId = button.id;
      callback(todoId);
    });
  });
}


function filterByReduce(todoList, searchTodo) {
  const lowerSearch = searchTodo.toLowerCase();

  return todoList.reduce((acc, todo) => {
    const task = highlightMatches(todo.task , searchTodo)
    if(todo.task.includes(todo.task.toLowerCase())){
      acc.push({...todo , task })
    }
    return acc
  }, []);
}


function highlightMatches(text, searchTerm) {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="">$1</mark>');
}


//render todo list
function displayTodoList() {
  updateEmptyTodoMessage(todoList);
  const todoContainer = handleDocumentById("todo-items");
  todoContainer.innerHTML = ""; // Clear previous list
  const inCompleteTask = searchTodo ? filterByReduce(todoList ,searchTodo)  :  todoList.filter((todo) => !todo.complete);
  inCompleteTask.forEach((todo) => {
    generateTodoItemUI(todo);
  });

  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");
  const checkedBtn = document.querySelectorAll(".complete");
  const selectOption = handleDocumentById('select')
 
  //edit todo listener
  attachEventListenerToButtons(editButtons, enterEditMode);
  //delete todo listener
  attachEventListenerToButtons(deleteButtons, deleteTodoById);
  //handle the complete task
  attachEventListenerToButtons(checkedBtn, completeTodoById);

  updateTotalTasksCount("totalTasks", inCompleteTask);
  //sort listener
  selectOption.addEventListener('change' , sortByDate)
  //save on the local storage
  updateOnLocalStorage();
}

//set the todoList on localStorage when todo data update
function updateOnLocalStorage() {
  const stringifyTodo = JSON.stringify(todoList);
  localStorage.setItem("todos", stringifyTodo);
}

//adding todo list
function addTodoItem(title, description, finishedDate) {
  const todo = {
    id: crypto.randomUUID(),
    description,
    task: title,
    date: new Date(),
    finishedDate,
    complete: false,
  };
  todoList.push(todo);
  displayTodoList();
}

function findTodoById(id) {
  return todoList.find((todo) => todo.id === id);
}

//update todo
function updateTodoById(id, title, description, finishedDate) {
  const findTodo = findTodoById(id);
  if (!findTodo) return;
  findTodo.task = title;
  findTodo.description = description;
  findTodo.finishedDate = finishedDate;
  displayTodoList();
}

//delete todo
function deleteTodoById(id) {
  const findTodoIdx = todoList.findIndex((todo) => todo.id === id);
  if (findTodoIdx === -1) return;

  todoList.splice(findTodoIdx, 1);
  displayTodoList();
  displayCompleteList();
}

function completeTodoById(id) {
  const findTodo = findTodoById(id);
  findTodo.complete = true;
  displayTodoList();
  displayCompleteList();
}

function displayInputError() {
  const todoControl = document.querySelector(".todo-control");
  const errorSpan = handleDocumentById("error");
  const span = document.createElement("span");
  span.id = "error";
  span.innerText = "invalid form data!";
  span.className = "text-red-600 my-2 block text-bold";

  if (!errorSpan) todoControl.appendChild(span);
}

function removeInputError() {
  const errorSpan = handleDocumentById("error");
  if (errorSpan) {
    errorSpan.remove();
  }
}

function removeLoginBtnFromDom() {
  container.classList.remove("hidden");
  authenticateBtn.remove();
}

function handleAuth() {
  localStorage.setItem("isLoggedIn", JSON.stringify(true));
  removeLoginBtnFromDom();
}

//handle form
function handleSubmitForm(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const title = formData.get("title");
  const description = formData.get("description");
  const finishedDate = formData.get("finishedDate");

  if (title === "" || description === "" || finishedDate === "") {
    displayInputError();
    return;
  }

  if (editId) {
    updateTodoById(editId, title, description, finishedDate);
    handleDocumentById('submit').innerText = '+'
    e.target.reset();
    editId = null
    return;
  }

  addTodoItem(title, description, finishedDate);
  removeInputError();
  e.target.reset();
}

//main function
function main() {
  if (isLoggedIn) removeLoginBtnFromDom();
  authenticateBtn.addEventListener("click", handleAuth);
  displayTodoList();
  displayCompleteList();
  //handle button listener
  form.addEventListener("submit", handleSubmitForm);
  searchInput.addEventListener('input' , handleSearch)

}

window.onload = main;
