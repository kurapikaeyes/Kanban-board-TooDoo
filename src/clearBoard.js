export function initClearBoard() {
    const clearBoardBtn = document.getElementById('clear-board-btn');

    if (!clearBoardBtn) return;

    clearBoardBtn.addEventListener('click', () => {
        const allTasks = document.querySelectorAll('.task-card, .task');

        if (allTasks.length === 0) return;

        const isConfirmed = confirm('Sei sicuro di eliminare tutte le attività dalla board?');

        if (isConfirmed) {
            allTasks.forEach(task => task.remove());

            localStorage.removeItem('kanban_board');

            if (typeof updateCounters === 'function') {
                updateCounters();
            }
        }
    });
}