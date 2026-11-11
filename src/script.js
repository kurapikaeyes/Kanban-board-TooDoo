import { initClearBoard } from './clearBoard.js';

const modal = document.getElementById('task-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const taskForm = document.getElementById('task-form');

function closeModal() {
    modal.style.display = 'none';
    taskForm.reset();
}

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function safeUpdateCounters() {
    if (typeof updateCounters === 'function') {
        updateCounters();
        return;
    }
    const totalCountSpan = document.getElementById('total-tasks-count');
    if (totalCountSpan) {
        const allTasks = document.querySelectorAll('.task');
        totalCountSpan.textContent = allTasks.length;
    }
}

function saveTasksToStorage() {
    const columnIds = ['da-fare', 'in-corso', 'fatto'];
    const boardData = {};

    columnIds.forEach(columnId => {
        const column = document.getElementById(columnId);
        if (!column) return;

        const tasks = [];

        const taskCards = column.querySelectorAll('.task');

        taskCards.forEach(task => {
            const strong = task.querySelector('strong');
            const p = task.querySelector('p');

            if (!strong && !p) {
                tasks.push({
                    title: task.textContent.trim(),
                    desc: ''
                });
            } else {
                tasks.push({
                    title: strong ? strong.textContent : '',
                    desc: p ? p.textContent : ''
                });
            }
        });

        boardData[columnId] = tasks;
    });

    localStorage.setItem('kanban_board', JSON.stringify(boardData));
}

function createTaskElement(title, desc) {
    const newTask = document.createElement('div');
    newTask.classList.add('task');
    newTask.setAttribute('draggable', 'true');

    const strong = document.createElement('strong');
    strong.textContent = title;
    newTask.appendChild(strong);

    if (desc) {
        const p = document.createElement('p');
        p.textContent = desc;
        newTask.appendChild(p);
    }

    newTask.addEventListener('dragstart', () => {
        newTask.classList.add('is-dragging');
    });

    newTask.addEventListener('dragend', () => {
        newTask.classList.remove('is-dragging');
        safeUpdateCounters();
        saveTasksToStorage();
    });

    return newTask;
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('modal-title').value.trim();
    const desc = document.getElementById('modal-desc').value.trim();
    const columnId = document.getElementById('modal-column').value;

    if (!title) return;

    const targetColumn = document.getElementById(columnId);

    if (targetColumn) {
        const newTask = createTaskElement(title, desc);
        targetColumn.appendChild(newTask);

        safeUpdateCounters();
        saveTasksToStorage();
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initClearBoard();

    const savedData = localStorage.getItem('kanban_board');

    if (savedData) {
        try {
            const boardData = JSON.parse(savedData);

            ['da-fare', 'in-corso', 'fatto'].forEach(columnId => {
                const col = document.getElementById(columnId);
                if (col) {
                    const existingTasks = col.querySelectorAll('.task');
                    existingTasks.forEach(t => t.remove());
                }
            });

            for (const [columnId, tasks] of Object.entries(boardData)) {
                const column = document.getElementById(columnId);
                if (column) {
                    tasks.forEach(taskData => {
                        const taskElement = createTaskElement(taskData.title, taskData.desc);
                        column.appendChild(taskElement);
                    });
                }
            }
        } catch (e) {
            console.error('Errore loading tasks da localStorage:', e);
        }
    } else {
        saveTasksToStorage();
    }

    safeUpdateCounters();
});