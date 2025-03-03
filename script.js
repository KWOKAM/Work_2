const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

addButton.addEventListener('click', addTask);

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${taskText}</span>
      <button class="delete-button">Supprimer</button>
    `;

    li.addEventListener('click', () => {
      li.classList.toggle('completed');
    });

    li.querySelector('.delete-button').addEventListener('click', (event) => {
      event.stopPropagation(); // Empêche le déclenchement de l'événement de clic sur la tâche
      taskList.removeChild(li);
    });

    taskList.appendChild(li);
    taskInput.value = '';
  }
}