document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const phaseSections = document.querySelectorAll('.phase-section');
    const expandAllBtn = document.getElementById('expandAllBtn');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resetModal = document.getElementById('resetConfirmationModal');
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    const cancelResetBtn = document.getElementById('cancelResetBtn');
    
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const htmlElement = document.documentElement;

    const totalTasks = checkboxes.length;

    const timers = {};

    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (!savedTheme || savedTheme === 'dark') {
            htmlElement.classList.add('dark');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    function toggleTheme() {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    initializeTheme();

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function initializeTimer(phase) {
        const savedTime = parseInt(localStorage.getItem(`timer_${phase}`) || '0');
        
        timers[phase] = {
            seconds: savedTime,
            interval: null,
            running: false
        };

        updateTimerDisplay(phase);
    }

    function startTimer(phase) {
        if (timers[phase].running) return;
        
        timers[phase].running = true;
        localStorage.setItem(`timer_${phase}_running`, 'true');
        
        const section = document.querySelector(`#${phase}`);
        const startBtn = section.querySelector('.start-btn');
        const pauseBtn = section.querySelector('.pause-btn');
        
        if (startBtn) startBtn.classList.add('hidden');
        if (pauseBtn) pauseBtn.classList.remove('hidden');
        
        timers[phase].interval = setInterval(() => {
            timers[phase].seconds++;
            localStorage.setItem(`timer_${phase}`, timers[phase].seconds);
            updateTimerDisplay(phase);
        }, 1000);
    }

    function pauseTimer(phase) {
        if (!timers[phase].running) return;
        
        timers[phase].running = false;
        localStorage.setItem(`timer_${phase}_running`, 'false');
        clearInterval(timers[phase].interval);
        
        const section = document.querySelector(`#${phase}`);
        const startBtn = section.querySelector('.start-btn');
        const pauseBtn = section.querySelector('.pause-btn');
        
        if (startBtn) startBtn.classList.remove('hidden');
        if (pauseBtn) pauseBtn.classList.add('hidden');
    }

    function resetTimer(phase) {
        pauseTimer(phase);
        timers[phase].seconds = 0;
        localStorage.setItem(`timer_${phase}`, '0');
        localStorage.removeItem(`timer_${phase}_running`);
        updateTimerDisplay(phase);
    }

    function updateTimerDisplay(phase) {
        const display = document.querySelector(`[data-phase="${phase}"].timer-display`);
        if (display) {
            display.textContent = formatTime(timers[phase].seconds);
        }
    }

    phaseSections.forEach(section => {
        const phase = section.id;
        initializeTimer(phase);
        
        const startBtn = section.querySelector(`.start-btn[data-phase="${phase}"]`);
        const pauseBtn = section.querySelector(`.pause-btn[data-phase="${phase}"]`);
        const resetTimerBtn = section.querySelector(`.reset-btn[data-phase="${phase}"]`);
        
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                startTimer(phase);
            });
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                pauseTimer(phase);
            });
        }
        
        if (resetTimerBtn) {
            resetTimerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (confirm('Reset timer for this phase?')) {
                    resetTimer(phase);
                }
            });
        }
    });

    document.querySelectorAll('.notes-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const textarea = btn.parentElement.querySelector('.phase-notes-textarea');
            if (textarea) {
                if (textarea.classList.contains('hidden')) {
                    textarea.classList.remove('hidden');
                    textarea.classList.add('show');
                    textarea.focus();
                } else {
                    textarea.classList.add('hidden');
                    textarea.classList.remove('show');
                }
            }
        });
    });

    document.querySelectorAll('.phase-notes-textarea').forEach(textarea => {
        const phase = textarea.dataset.phase;
        const savedNotes = localStorage.getItem(`notes_${phase}`);
        if (savedNotes) {
            textarea.value = savedNotes;
        }
        
        textarea.addEventListener('input', () => {
            localStorage.setItem(`notes_${phase}`, textarea.value);
        });
    });

    function updateProgress() {
        const checkedTasks = document.querySelectorAll('.checklist input[type="checkbox"]:checked').length;
        const percentage = totalTasks > 0 ? Math.round((checkedTasks / totalTasks) * 100) : 0;
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        if (progressText) {
            progressText.textContent = percentage + '%';
        }

        checkboxes.forEach(checkbox => {
            localStorage.setItem(checkbox.dataset.taskId, checkbox.checked);
        });
    }

    function loadProgress() {
        checkboxes.forEach(checkbox => {
            const isChecked = localStorage.getItem(checkbox.dataset.taskId) === 'true';
            checkbox.checked = isChecked;
        });
        updateProgress();
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateProgress();
        });
    });

    phaseSections.forEach(section => {
        const toggleButton = section.querySelector('.toggle-button');
        const tasksContainer = section.querySelector('.tasks-container');
        const sectionId = section.id;

        const isExpanded = localStorage.getItem(`expanded_${sectionId}`) === 'true';
        if (isExpanded) {
            section.classList.add('expanded');
            if (tasksContainer) {
                tasksContainer.style.display = 'block';
                requestAnimationFrame(() => {
                    if (tasksContainer) {
                        tasksContainer.style.maxHeight = tasksContainer.scrollHeight + 'px';
                        tasksContainer.style.opacity = '1';
                    }
                });
            }
        } else {
            if (tasksContainer) {
                tasksContainer.style.display = 'none';
                tasksContainer.style.maxHeight = '0px';
                tasksContainer.style.opacity = '0';
            }
        }

        if (toggleButton && tasksContainer) {
            toggleButton.addEventListener('click', (e) => {
                if (e.target.closest('.timer-btn')) {
                    return;
                }
                
                section.classList.toggle('expanded');
                if (section.classList.contains('expanded')) {
                    tasksContainer.style.display = 'block';
                    requestAnimationFrame(() => {
                        tasksContainer.style.maxHeight = tasksContainer.scrollHeight + 'px';
                        tasksContainer.style.opacity = '1';
                        localStorage.setItem(`expanded_${sectionId}`, 'true');
                    });
                } else {
                    tasksContainer.style.maxHeight = '0px';
                    tasksContainer.style.opacity = '0';
                    tasksContainer.addEventListener('transitionend', () => {
                        if (!section.classList.contains('expanded')) {
                            tasksContainer.style.display = 'none';
                        }
                    }, { once: true });
                    localStorage.setItem(`expanded_${sectionId}`, 'false');
                }
            });
        }
    });

    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', () => {
            phaseSections.forEach(section => {
                const tasksContainer = section.querySelector('.tasks-container');
                if (!section.classList.contains('expanded') && tasksContainer) {
                    section.classList.add('expanded');
                    tasksContainer.style.display = 'block';
                    requestAnimationFrame(() => {
                        tasksContainer.style.maxHeight = tasksContainer.scrollHeight + 'px';
                        tasksContainer.style.opacity = '1';
                        localStorage.setItem(`expanded_${section.id}`, 'true');
                    });
                }
            });
        });
    }

    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', () => {
            phaseSections.forEach(section => {
                const tasksContainer = section.querySelector('.tasks-container');
                if (section.classList.contains('expanded') && tasksContainer) {
                    section.classList.remove('expanded');
                    tasksContainer.style.maxHeight = '0px';
                    tasksContainer.style.opacity = '0';
                    tasksContainer.addEventListener('transitionend', () => {
                        if (!section.classList.contains('expanded')) {
                            tasksContainer.style.display = 'none';
                        }
                    }, { once: true });
                    localStorage.setItem(`expanded_${section.id}`, 'false');
                }
            });
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (resetModal) resetModal.style.display = 'flex';
        });
    }

    if (cancelResetBtn) {
        cancelResetBtn.addEventListener('click', () => {
            if (resetModal) resetModal.style.display = 'none';
        });
    }

    if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', () => {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                localStorage.removeItem(checkbox.dataset.taskId);
            });
            
            phaseSections.forEach(section => {
                const phase = section.id;
                resetTimer(phase);
                const textarea = section.querySelector('.phase-notes-textarea');
                if (textarea) {
                    textarea.value = '';
                    localStorage.removeItem(`notes_${phase}`);
                }
            });
            
            updateProgress();
            if (resetModal) resetModal.style.display = 'none';
        });
    }

    if (resetModal) {
        resetModal.addEventListener('click', (event) => {
            if (event.target === resetModal) {
                resetModal.style.display = 'none';
            }
        });
    }

    loadProgress();
});
