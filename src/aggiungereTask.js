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

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('modal-title').value.trim();
    const desc = document.getElementById('modal-desc').value.trim();
    const columnId = document.getElementById('modal-column').value;

    if (!title) return;

    const targetColumn = document.getElementById(columnId);

    if (targetColumn) {
        const newTask = document.createElement('div');
        newTask.classList.add('task');
        newTask.setAttribute('draggable', 'true');

        newTask.innerHTML = `
            <strong>${title}</strong>
            ${desc ? `<p>${desc}</p>` : ''}
        `;

        newTask.addEventListener('dragstart', () => {
            newTask.classList.add('is-dragging');
        });
        newTask.addEventListener('dragend', () => {
            newTask.classList.remove('is-dragging');
        });

        targetColumn.appendChild(newTask);
        closeModal();

        newTask.addEventListener('dragend', () => {
            newTask.classList.remove('is-dragging');
            if (typeof updateCounters === 'function') updateCounters();
        });

        targetColumn.appendChild(newTask);
        if (typeof updateCounters === 'function') updateCounters();
        closeModal();
    }
});