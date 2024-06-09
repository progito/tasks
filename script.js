// Получаем элементы DOM
const dateElement = document.querySelector('.date');
const prevButton = document.getElementById('prevBtn');
const nextButton = document.getElementById('nextBtn');
const manualSelectIcon = document.getElementById('manualSelect');
const datePickerPanel = document.getElementById('datePickerPanel');
const datePickerClose = document.getElementById('datePickerClose');
const datePicker = document.getElementById('datePicker');
const tasksTab = document.getElementById('tasksTab');
const chatsTab = document.getElementById('chatsTab');
const menuButton = document.getElementById('menuButton');
const taskDatePanel = document.getElementById('taskDatePanel');
const taskDatesList = document.getElementById('taskDatesList');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskOptionsPanel = document.getElementById('taskOptionsPanel');
const taskOptionsClose = document.getElementById('taskOptionsClose');
const markCompleteButton = document.getElementById('markComplete');
const duplicateTaskButton = document.getElementById('duplicateTask');
const moveNextDayButton = document.getElementById('moveNextDay');
const moveToDateButton = document.getElementById('moveToDate');
const deleteTaskButton = document.getElementById('deleteTask');
const taskDateClose = document.getElementById('taskDateClose');
const chatsPanel = document.getElementById('chatsPanel');

let selectedTaskItem = null;
let tasksByDate = JSON.parse(localStorage.getItem('tasksByDate')) || {};

// Массивы с названиями дней недели и месяцев
const weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

// Обработчики событий для кнопок
prevButton.addEventListener('click', () => changeDate(-1));
nextButton.addEventListener('click', () => changeDate(1));
manualSelectIcon.addEventListener('click', () => datePickerPanel.classList.add('active'));
datePickerClose.addEventListener('click', () => datePickerPanel.classList.remove('active'));
datePicker.addEventListener('change', () => {
    dateElement.textContent = formatDate(new Date(datePicker.value));
    datePickerPanel.classList.remove('active');
    displayTasksForDate(new Date(datePicker.value));
});

menuButton.addEventListener('click', () => {
    taskDatePanel.classList.toggle('active');
    updateTaskDatesList();
});

taskDateClose.addEventListener('click', () => taskDatePanel.classList.remove('active'));

// Обработчик события для ввода задач
taskInput.addEventListener('input', () => {
    const inputValue = taskInput.value;
    const timePattern = /\b([01]?[0-9]|2[0-3]):[0-5][0-9]\b/g;
    taskInput.innerHTML = inputValue.replace(timePattern, match => `<span class="time-highlight">${match}</span>`);
});

// Обработчик события для добавления задачи
addTaskButton.addEventListener('click', addTask);

// Обработчики для вкладок
tasksTab.addEventListener('click', () => {
    tasksTab.classList.add('active');
    chatsTab.classList.remove('active');
    taskList.style.display = 'block';
    chatsPanel.style.display = 'none';
});

chatsTab.addEventListener('click', () => {
    chatsTab.classList.add('active');
    tasksTab.classList.remove('active');
    taskList.style.display = 'none';
    chatsPanel.style.display = 'block';
});

// Обработчик для закрытия панели опций задач
taskOptionsClose.addEventListener('click', () => {
    taskOptionsPanel.classList.remove('active');
});

// Функция для изменения даты
function changeDate(daysToAdd) {
    let currentDate = parseDateString(dateElement.textContent);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    dateElement.textContent = formatDate(currentDate);
    displayTasksForDate(currentDate);
}

// Функция для преобразования строки даты в объект Date
function parseDateString(dateString) {
    const parts = dateString.split(', ');
    const dayOfMonth = parseInt(parts[1].split(' ')[0]);
    const month = months.indexOf(parts[1].split(' ')[1]);
    const year = new Date().getFullYear(); // Принимаем текущий год
    return new Date(year, month, dayOfMonth);
}

// Функция для форматирования объекта Date в строку "Суббота, 8 июня"
function formatDate(date) {
    const dayOfWeek = weekdays[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    return `${dayOfWeek}, ${dayOfMonth} ${month}`;
}

// Функция для форматирования объекта Date в короткий формат "08.06 Суббота"
function formatDateShort(date) {
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // месяцы начинаются с 0
    const dayOfWeek = weekdays[date.getDay()];
    return `${dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth}.${month < 10 ? '0' + month : month} ${dayOfWeek}`;
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskItem = createTaskItem(taskText);
    taskList.appendChild(taskItem);

    const currentDate = parseDateString(dateElement.textContent);
    const formattedDate = formatDateShort(currentDate);

    if (!tasksByDate[formattedDate]) {
        tasksByDate[formattedDate] = [];
    }
    tasksByDate[formattedDate].push(taskText);
    localStorage.setItem('tasksByDate', JSON.stringify(tasksByDate));
    
    taskInput.value = '';
}



// Обработчик для кнопки "Выполнено"
markCompleteButton.addEventListener('click', () => {
    if (selectedTaskItem) {
        selectedTaskItem.classList.add('completed');
        selectedTaskItem.querySelector('.task-checkbox').classList.add('completed');
        taskOptionsPanel.classList.remove('active');
        saveTasksToLocalStorage();
    }
});

// Обработчик для кнопки "Дублировать"
duplicateTaskButton.addEventListener('click', () => {
    if (selectedTaskItem) {
        const duplicateTask = createTaskItem(selectedTaskItem.querySelector('.task-text').textContent);
        taskList.appendChild(duplicateTask);
        taskOptionsPanel.classList.remove('active');
        saveTasksToLocalStorage();
    }
});

// Обработчик для кнопки "На следующий день"
moveNextDayButton.addEventListener('click', () => {
    if (selectedTaskItem) {
        const taskText = selectedTaskItem.querySelector('.task-text').textContent;
        moveToAnotherDay(taskText, 1);
        selectedTaskItem.remove();
        taskOptionsPanel.classList.remove('active');
        saveTasksToLocalStorage();
    }
});

// Обработчик для кнопки "На другую дату"
moveToDateButton.addEventListener('click', () => {
    if (selectedTaskItem) {
        const newDate = prompt("Введите новую дату в формате ГГГГ-ММ-ДД:");
        if (newDate) {
            const taskText = selectedTaskItem.querySelector('.task-text').textContent;
            moveToAnotherDate(taskText, newDate);
            selectedTaskItem.remove();
        }
        taskOptionsPanel.classList.remove('active');
        saveTasksToLocalStorage();
    }
});

// Обработчик для кнопки "Удалить задачу"
deleteTaskButton.addEventListener('click', () => {
    if (selectedTaskItem) {
        selectedTaskItem.remove();
        taskOptionsPanel.classList.remove('active');
        saveTasksToLocalStorage();
    }
});

// Функция для перемещения задачи на следующий день или другую дату
function moveToAnotherDay(taskText, daysToAdd) {
    const currentDate = parseDateString(dateElement.textContent);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    const formattedDate = formatDateShort(currentDate);

    if (!tasksByDate[formattedDate]) {
        tasksByDate[formattedDate] = [];
    }
    tasksByDate[formattedDate].push(taskText);
    localStorage.setItem('tasksByDate', JSON.stringify(tasksByDate));
}

function moveToAnotherDate(taskText, newDate) {
    const targetDate = new Date(newDate);
    const formattedDate = formatDateShort(targetDate);

    if (!tasksByDate[formattedDate]) {
        tasksByDate[formattedDate] = [];
    }
    tasksByDate[formattedDate].push(taskText);
    localStorage.setItem('tasksByDate', JSON.stringify(tasksByDate));
}

// Функция для создания элемента задачи
function createTaskItem(taskText) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
        <div class="task-checkbox"></div>
        <span class="task-text" contenteditable="false">${taskText}</span>
        <div class="task-options"><i class="fas fa-ellipsis-h"></i></div>
    `;

    const checkbox = taskItem.querySelector('.task-checkbox');
    const taskTextElement = taskItem.querySelector('.task-text');
    const taskOptions = taskItem.querySelector('.task-options');

    checkbox.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
        checkbox.classList.toggle('completed');
        saveTasksToLocalStorage();
    });

    taskTextElement.addEventListener('click', () => {
        taskTextElement.contentEditable = true;
        taskTextElement.focus();
    });

    taskTextElement.addEventListener('blur', () => {
        taskTextElement.contentEditable = false;
        saveTasksToLocalStorage();
    });

    taskOptions.addEventListener('click', () => {
        selectedTaskItem = taskItem;
        taskOptionsPanel.classList.add('active');
    });

    return taskItem;
}

// Функция для сохранения задач в LocalStorage
function saveTasksToLocalStorage() {
    const currentDate = parseDateString(dateElement.textContent);
    const formattedDate = formatDateShort(currentDate);
    tasksByDate[formattedDate] = [];

    document.querySelectorAll('.task-item').forEach(taskItem => {
        tasksByDate[formattedDate].push(taskItem.querySelector('.task-text').textContent);
    });

    localStorage.setItem('tasksByDate', JSON.stringify(tasksByDate));
}

// Функция для отображения задач по выбранной дате
function displayTasksForDate(date) {
    const formattedDate = formatDateShort(date);
    taskList.innerHTML = '';

    if (tasksByDate[formattedDate]) {
        tasksByDate[formattedDate].forEach(taskText => {
            const taskItem = createTaskItem(taskText);
            taskList.appendChild(taskItem);
        });
    }
}

// Функция для обновления списка дат в меню
function updateTaskDatesList() {
    taskDatesList.innerHTML = '';
    for (const date in tasksByDate) {
        if (tasksByDate[date].length > 0) {
            const dateItem = document.createElement('li');
            dateItem.classList.add('task-date-item');
            dateItem.textContent = date;
            dateItem.addEventListener('click', () => {
                const [day, month] = date.split(' ')[0].split('.');
                const currentDate = new Date(new Date().getFullYear(), month - 1, day);
                dateElement.textContent = formatDate(currentDate);
                displayTasksForDate(currentDate);
                taskDatePanel.classList.remove('active');
            });
            taskDatesList.appendChild(dateItem);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    dateElement.textContent = formatDate(currentDate);
    displayTasksForDate(currentDate);
    updateTaskDatesList();
    renderGroups();
});

