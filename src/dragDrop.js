const draggables = document.querySelectorAll('.task');
const droppables = document.querySelectorAll('.colonna');

draggables.forEach((task) => {
    task.addEventListener('dragstart', () => {
        task.classList.add('is-dragging');
    });
    task.addEventListener('dragend', () => {
        task.classList.remove('is-dragging');
    });
});

droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();

        const bottomTask = insertAboveTask(zone, e.clientY);
        const currentTask = document.querySelector('.is-dragging');

        if (!currentTask) return;

        if (!bottomTask) {
            zone.appendChild(currentTask);
        } else {
            zone.insertBefore(currentTask, bottomTask);
        }
    });
});

const insertAboveTask = (zone, mouseY) => {
    const els = zone.querySelectorAll('.task:not(.is-dragging)');
    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
        const { top } = task.getBoundingClientRect();
        const offset = mouseY - top;
        if (offset > closestOffset && offset < 0) {
            closestOffset = offset;
            closestTask = task;
        }
    });
    return closestTask;
};

function updateCounters() {
    const columns = document.querySelectorAll('.colonna');
    let totalTasks = 0;

    columns.forEach((col) => {
        const heading = col.querySelector('.heading');
        const tasksCount = col.querySelectorAll('.task').length;
        totalTasks += tasksCount;

        if (!heading.dataset.baseTitle) {
            heading.dataset.baseTitle = heading.textContent.trim();
        }

        heading.textContent = `${heading.dataset.baseTitle} (${tasksCount})`;
    });

    const totalEl = document.getElementById('total-tasks-count');
    if (totalEl) {
        totalEl.textContent = totalTasks;
    }
}

updateCounters();

draggables.forEach((task) => {
    task.addEventListener('dragend', updateCounters);
});