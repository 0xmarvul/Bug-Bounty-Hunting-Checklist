document.addEventListener('DOMContentLoaded', () => {
    // Get all DOM elements
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
    
    // Theme toggle elements
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const htmlElement = document.documentElement;

    const totalTasks = checkboxes.length;

    // ========== THEME MANAGEMENT ==========
    
    // Initialize theme - Dark mode by default
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        // Default to dark mode if no preference is saved
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

    // Toggle theme function
    function toggleTheme() {
        if (htmlElement.classList.contains('dark')) {
            // Switch to light mode
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            // Switch to dark mode
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
    }

    // Theme toggle button event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize theme on page load
    initializeTheme();

    // ========== PROGRESS TRACKING ==========
    
    function updateProgress() {
        const checkedTasks = document.querySelectorAll('.checklist input[type="checkbox"]:checked').length;
        const percentage = totalTasks > 0 ? Math.round((checkedTasks / totalTasks) * 100) : 0;
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        if (progressText) {
            progressText.textContent = percentage + '%';
        }

        // Save each checkbox state
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

    // ========== CHECKBOX HANDLING ==========
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateProgress();
        });
    });

    // ========== PHASE SECTION TOGGLE ==========
    
    phaseSections.forEach(section => {
        const toggleButton = section.querySelector('.toggle-button');
        const tasksContainer = section.querySelector('.tasks-container');
        const sectionId = section.id;

        // Load expanded state from localStorage
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

        // Toggle section on button click
        if (toggleButton && tasksContainer) {
            toggleButton.addEventListener('click', () => {
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

    // ========== EXPAND/COLLAPSE ALL BUTTONS ==========
    
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

    // ========== RESET FUNCTIONALITY ==========
    
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
            updateProgress();
            if (resetModal) resetModal.style.display = 'none';
        });
    }

    // Close modal on background click
    if (resetModal) {
        resetModal.addEventListener('click', (event) => {
            if (event.target === resetModal) {
                resetModal.style.display = 'none';
            }
        });
    }

    // ========== INITIALIZE ==========
    
    loadProgress();
});
