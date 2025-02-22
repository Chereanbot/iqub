// Management Dashboard JavaScript

// Initialize Charts
function initializeCharts() {
    // Member Growth Chart
    const memberGrowthCtx = document.getElementById('memberGrowthChart')?.getContext('2d');
    if (memberGrowthCtx) {
        new Chart(memberGrowthCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Members',
                    data: [45, 58, 65, 60, 72, 85],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Loan Distribution Chart
    const loanDistributionCtx = document.getElementById('loanDistributionChart')?.getContext('2d');
    if (loanDistributionCtx) {
        new Chart(loanDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Personal', 'Business', 'Education', 'Emergency'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                cutout: '75%'
            }
        });
    }
}

// Initialize DataTables
function initializeDataTables() {
    const tables = document.querySelectorAll('.datatable');
    tables.forEach(table => {
        new DataTable(table, {
            pageLength: 10,
            responsive: true,
            dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
            language: {
                search: '<span class="me-3">Search:</span>',
                searchPlaceholder: 'Type to filter...',
                lengthMenu: '<span class="me-3">Show:</span> _MENU_',
                paginate: {
                    first: '<i class="fas fa-angle-double-left"></i>',
                    last: '<i class="fas fa-angle-double-right"></i>',
                    next: '<i class="fas fa-angle-right"></i>',
                    previous: '<i class="fas fa-angle-left"></i>'
                }
            }
        });
    });
}

// Handle Member Management
function handleMemberManagement() {
    // Add New Member Form
    const addMemberForm = document.getElementById('addMemberForm');
    if (addMemberForm) {
        addMemberForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(addMemberForm);
                const response = await fetch('/api/members', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Failed to add member');

                showNotification('success', 'Member added successfully');
                addMemberForm.reset();
                
                // Refresh member list
                if (typeof loadMembers === 'function') {
                    loadMembers();
                }
            } catch (error) {
                console.error('Error adding member:', error);
                showNotification('error', 'Failed to add member. Please try again.');
            }
        });
    }

    // Member Search
    const memberSearch = document.getElementById('memberSearch');
    if (memberSearch) {
        memberSearch.addEventListener('input', debounce(async (e) => {
            const searchTerm = e.target.value;
            try {
                const response = await fetch(`/api/members/search?q=${searchTerm}`);
                if (!response.ok) throw new Error('Search failed');

                const results = await response.json();
                updateMemberList(results);
            } catch (error) {
                console.error('Error searching members:', error);
            }
        }, 300));
    }
}

// Handle Loan Management
function handleLoanManagement() {
    // Loan Application Review
    const loanReviewForms = document.querySelectorAll('.loan-review-form');
    loanReviewForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(form);
                const loanId = form.getAttribute('data-loan-id');
                
                const response = await fetch(`/api/loans/${loanId}/review`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Review submission failed');

                showNotification('success', 'Loan review submitted successfully');
                
                // Refresh loan list
                if (typeof loadLoans === 'function') {
                    loadLoans();
                }
            } catch (error) {
                console.error('Error submitting loan review:', error);
                showNotification('error', 'Failed to submit review. Please try again.');
            }
        });
    });

    // Loan Status Update
    const loanStatusSelects = document.querySelectorAll('.loan-status-select');
    loanStatusSelects.forEach(select => {
        select.addEventListener('change', async (e) => {
            const loanId = select.getAttribute('data-loan-id');
            const newStatus = e.target.value;
            
            try {
                const response = await fetch(`/api/loans/${loanId}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) throw new Error('Status update failed');

                showNotification('success', 'Loan status updated successfully');
            } catch (error) {
                console.error('Error updating loan status:', error);
                showNotification('error', 'Failed to update status. Please try again.');
                // Revert select to previous value
                select.value = select.getAttribute('data-previous-value');
            }
        });

        // Store previous value before change
        select.addEventListener('focus', (e) => {
            e.target.setAttribute('data-previous-value', e.target.value);
        });
    });
}

// Handle Report Generation
function handleReportGeneration() {
    const reportForms = document.querySelectorAll('.report-form');
    reportForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';
            
            try {
                const formData = new FormData(form);
                const response = await fetch('/api/reports/generate', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Report generation failed');

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report-${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                showNotification('success', 'Report generated successfully');
            } catch (error) {
                console.error('Error generating report:', error);
                showNotification('error', 'Failed to generate report. Please try again.');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Generate Report';
            }
        });
    });
}

// Handle Task Management
function handleTaskManagement() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', async (e) => {
            const taskId = checkbox.getAttribute('data-task-id');
            const completed = e.target.checked;
            
            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ completed })
                });

                if (!response.ok) throw new Error('Task update failed');

                const taskElement = checkbox.closest('.task-item');
                if (completed) {
                    taskElement.classList.add('completed');
                } else {
                    taskElement.classList.remove('completed');
                }
            } catch (error) {
                console.error('Error updating task:', error);
                showNotification('error', 'Failed to update task. Please try again.');
                // Revert checkbox state
                e.target.checked = !completed;
            }
        });
    });
}

// Show Notification
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} fade-in`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Handle close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Management Team Sidebar Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Sidebar
    initializeSidebar();
    // Initialize Charts
    initializeCharts();
    // Initialize DataTables
    initializeDataTables();
});

function initializeSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update breadcrumb
            if (breadcrumbCurrent) {
                breadcrumbCurrent.textContent = link.querySelector('span').textContent;
            }

            // Handle mobile sidebar
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('show');
            }

            // Track navigation
            trackNavigation(link.getAttribute('href'));
        });
    });
}

// Dashboard Page Initialization
function initializeDashboard() {
    // Load system overview
    loadSystemOverview();
    // Initialize member statistics
    initializeMemberStats();
    // Load team performance
    loadTeamPerformance();
}

// Member Management Page
function initializeMemberManagement() {
    const memberTable = new DataTable('#memberTable', {
        pageLength: 10,
        order: [[4, 'desc']], // Sort by join date
        responsive: true,
        dom: '<"member-header"<"row"<"col-md-6"l><"col-md-6"f>>>rt<"member-footer"<"row"<"col-md-6"i><"col-md-6"p>>>',
        language: {
            search: '<i class="fas fa-search"></i>',
            searchPlaceholder: 'Search members...'
        }
    });

    // Initialize member filters
    initializeMemberFilters(memberTable);
}

// Team Management Page
function initializeTeamManagement() {
    // Load team members
    loadTeamMembers();
    // Initialize role management
    initializeRoleManagement();
    // Load performance metrics
    loadPerformanceMetrics();
}

// Reports Page
function initializeReports() {
    // Load report templates
    loadReportTemplates();
    // Initialize analytics dashboard
    initializeAnalytics();
    // Load saved reports
    loadSavedReports();
}

// Settings Page
function initializeSettings() {
    // Load system settings
    loadSystemSettings();
    // Initialize permission management
    initializePermissions();
    // Load notification settings
    loadNotificationSettings();
}

// Helper Functions
function loadSystemOverview() {
    fetch('/api/management/overview')
        .then(response => response.json())
        .then(data => {
            updateDashboardMetrics(data);
            updateCharts(data);
        })
        .catch(error => showNotification('Failed to load system overview', 'error'));
}

function initializeMemberFilters(table) {
    const filters = document.querySelectorAll('.member-filter');
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            const filterValues = Array.from(filters).reduce((acc, curr) => {
                acc[curr.name] = curr.value;
                return acc;
            }, {});
            
            applyMemberFilters(table, filterValues);
        });
    });
}

function applyMemberFilters(table, filters) {
    table.columns().every(function() {
        const column = this;
        const filterValue = filters[column.header().textContent.toLowerCase()];
        
        if (filterValue) {
            column.search(filterValue).draw();
        }
    });
}

function handleMemberApproval(memberId, status) {
    fetch(`/api/management/members/${memberId}/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(data => {
        showNotification(`Member ${status} successfully`, 'success');
        updateMemberStatus(memberId, status);
    })
    .catch(error => showNotification('Failed to update member status', 'error'));
}

function trackNavigation(path) {
    // Analytics tracking
    if (window.analytics) {
        window.analytics.track('Page View', {
            path: path,
            role: 'management',
            timestamp: new Date()
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} fade-in`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('fade-in');
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export functions for use in other modules
window.ManagementModule = {
    initializeDashboard,
    initializeMemberManagement,
    initializeTeamManagement,
    initializeReports,
    initializeSettings,
    handleMemberApproval,
    showNotification
};

// Initialize Management Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeCharts();
    initializeDataTables();
    handleMemberManagement();
    handleLoanManagement();
    handleReportGeneration();
    handleTaskManagement();

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Initialize popovers
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach(popover => new bootstrap.Popover(popover));

    // Add animation to stats cards
    const statsCards = document.querySelectorAll('.stats-card');
    statsCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });
}); 