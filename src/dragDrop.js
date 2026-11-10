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

        //trova task più vicino al cursore
        const bottomTask = insertAboveTask(zone, e.clientY);
        const currentTask = document.querySelector('.is-dragging');

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