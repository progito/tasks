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
// const helpIcon = document.getElementById('helpIcon');
const helpPanel = document.getElementById('helpPanel');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskOptionsPanel = document.getElementById('taskOptionsPanel');
const markCompleteButton = document.getElementById('markComplete');
const duplicateTaskButton = document.getElementById('duplicateTask');
const moveNextDayButton = document.getElementById('moveNextDay');
const moveToDateButton = document.getElementById('moveToDate');
const deleteTaskButton = document.getElementById('deleteTask');

let selectedTaskItem = null;

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
});

// Обработчик события для значка помощи
// helpIcon.addEventListener('click', () => helpPanel.classList.toggle('active'));

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
});

chatsTab.addEventListener('click', () => {
    chatsTab.classList.add('active');
    tasksTab.classList.remove('active');
});

// Функция для изменения даты
function changeDate(daysToAdd) {
    let currentDate = parseDateString(dateElement.textContent);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    dateElement.textContent = formatDate(currentDate);
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

// Функция для добавления задачи
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
        <div class="task-checkbox"></div>
        <span class="task-text">${taskText}</span>
        <div class="task-options"><i class="fas fa-ellipsis-h"></i></div>
    `;
    taskList.appendChild(taskItem);
    taskInput.value = '';

    const checkbox = taskItem.querySelector('.task-checkbox');
    const taskOptions = taskItem.querySelector('.task-options');

    checkbox.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
        checkbox.classList.toggle('completed');
    });

    taskOptions.addEventListener('click', () => {
        selectedTaskItem = taskItem;
        taskOptionsPanel.classList.add('active');
    });
}

// Обработчик для кнопки "Выполнено"
markCompleteButton.addEventListener('click', () => {
    if (selectedTaskItem) {
        selectedTaskItem.classList.add('completed');
        selectedTaskItem.querySelector('.task-checkbox').classList.add('completed');
        taskOptionsPanel.classList.remove('active');
    }
});

// Обработчик для кнопки "Дублировать"
duplicateTaskButton.addEventListener('click', () => {
    if (selectedTaskItem) {
        const duplicateTask = selectedTaskItem.cloneNode(true);
        taskList.appendChild(duplicateTask);
        taskOptionsPanel.classList.remove('active');
        bindTaskEvents(duplicateTask);
    }
});

// Обработчик для кнопки "На следующий день"
moveNextDayButton.addEventListener('click', () => {
    if (selectedTaskItem) {
        // Здесь добавьте логику для перемещения задачи на следующий день
        taskOptionsPanel.classList.remove('active');
    }
});

// Обработчик для кнопки "На другую дату"
moveToDateButton.addEventListener('click', () => {
    if (selectedTaskItem) {
        // Здесь добавьте логику для перемещения задачи на другую дату
        taskOptionsPanel.classList.remove('active');
    }
});

// Обработчик для кнопки "Удалить задачу"
deleteTaskButton.addEventListener('click', () => {
    if (selectedTaskItem) {
        selectedTaskItem.remove();
        taskOptionsPanel.classList.remove('active');
    }
});

// Функция для привязки событий к задачам
function bindTaskEvents(taskItem) {
    const checkbox = taskItem.querySelector('.task-checkbox');
    const taskOptions = taskItem.querySelector('.task-options');

    checkbox.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
        checkbox.classList.toggle('completed');
    });

    taskOptions.addEventListener('click', () => {
        selectedTaskItem = taskItem;
        taskOptionsPanel.classList.add('active');
    });
}
