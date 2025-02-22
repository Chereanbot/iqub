// Finance Dashboard JavaScript

// Initialize Charts
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [150000, 175000, 165000, 180000, 195000, 210000],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Expenses',
                        data: [90000, 95000, 92000, 98000, 102000, 105000],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
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

    // Loan Status Chart
    const loanStatusCtx = document.getElementById('loanStatusChart')?.getContext('2d');
    if (loanStatusCtx) {
        new Chart(loanStatusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Completed', 'Overdue', 'Default'],
                datasets: [{
                    data: [65, 20, 10, 5],
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

// Handle Transaction Management
function handleTransactions() {
    // Record Payment Form
    const paymentForm = document.getElementById('recordPaymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(paymentForm);
                const response = await fetch('/api/transactions/payments', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Failed to record payment');

                showNotification('success', 'Payment recorded successfully');
                paymentForm.reset();
                
                // Refresh transaction list
                if (typeof loadTransactions === 'function') {
                    loadTransactions();
                }
            } catch (error) {
                console.error('Error recording payment:', error);
                showNotification('error', 'Failed to record payment. Please try again.');
            }
        });
    }

    // Process Disbursement Form
    const disbursementForm = document.getElementById('processDisbursementForm');
    if (disbursementForm) {
        disbursementForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(disbursementForm);
                const response = await fetch('/api/transactions/disbursements', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Failed to process disbursement');

                showNotification('success', 'Disbursement processed successfully');
                disbursementForm.reset();
                
                // Refresh disbursement list
                if (typeof loadDisbursements === 'function') {
                    loadDisbursements();
                }
            } catch (error) {
                console.error('Error processing disbursement:', error);
                showNotification('error', 'Failed to process disbursement. Please try again.');
            }
        });
    }
}

// Handle Loan Account Management
function handleLoanAccounts() {
    // Interest Calculation
    const calculateInterestForm = document.getElementById('calculateInterestForm');
    if (calculateInterestForm) {
        calculateInterestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(calculateInterestForm);
                const response = await fetch('/api/loans/calculate-interest', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Interest calculation failed');

                const result = await response.json();
                updateInterestCalculation(result);
            } catch (error) {
                console.error('Error calculating interest:', error);
                showNotification('error', 'Failed to calculate interest. Please try again.');
            }
        });
    }

    // Payment Schedule Generation
    const generateScheduleForm = document.getElementById('generateScheduleForm');
    if (generateScheduleForm) {
        generateScheduleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(generateScheduleForm);
                const response = await fetch('/api/loans/payment-schedule', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Schedule generation failed');

                const schedule = await response.json();
                displayPaymentSchedule(schedule);
            } catch (error) {
                console.error('Error generating schedule:', error);
                showNotification('error', 'Failed to generate payment schedule. Please try again.');
            }
        });
    }
}

// Handle Report Generation
function handleReports() {
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

// Handle Financial Calculations
function handleCalculations() {
    // Interest Calculator
    const interestCalculator = document.getElementById('interestCalculator');
    if (interestCalculator) {
        const calculateBtn = interestCalculator.querySelector('.calculate-btn');
        const inputs = interestCalculator.querySelectorAll('input');
        
        calculateBtn.addEventListener('click', () => {
            const principal = parseFloat(interestCalculator.querySelector('#principal').value);
            const rate = parseFloat(interestCalculator.querySelector('#rate').value);
            const term = parseFloat(interestCalculator.querySelector('#term').value);
            
            if (isNaN(principal) || isNaN(rate) || isNaN(term)) {
                showNotification('error', 'Please enter valid numbers');
                return;
            }
            
            const interest = (principal * rate * term) / 100;
            const total = principal + interest;
            
            interestCalculator.querySelector('#interest').value = interest.toFixed(2);
            interestCalculator.querySelector('#total').value = total.toFixed(2);
        });
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                interestCalculator.querySelector('#interest').value = '';
                interestCalculator.querySelector('#total').value = '';
            });
        });
    }
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

// Finance Team Sidebar Functionality
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
    // Load financial overview
    loadFinancialOverview();
    // Initialize transaction summary
    initializeTransactionSummary();
    // Load recent activities
    loadRecentActivities();
}

// Transaction Page Initialization
function initializeTransactions() {
    const transactionTable = new DataTable('#transactionTable', {
        pageLength: 10,
        order: [[1, 'desc']], // Sort by date
        responsive: true,
        dom: '<"transaction-header"<"row"<"col-md-6"l><"col-md-6"f>>>rt<"transaction-footer"<"row"<"col-md-6"i><"col-md-6"p>>>',
        language: {
            search: '<i class="fas fa-search"></i>',
            searchPlaceholder: 'Search transactions...'
        }
    });

    // Initialize transaction filters
    initializeTransactionFilters(transactionTable);
}

// Loan Management Page
function initializeLoans() {
    // Load active loans
    loadActiveLoans();
    // Initialize loan calculator
    initializeLoanCalculator();
    // Load payment schedules
    loadPaymentSchedules();
}

// Reports Page
function initializeReports() {
    // Load report templates
    loadReportTemplates();
    // Initialize date ranges
    initializeDateRangePicker();
    // Load saved reports
    loadSavedReports();
}

// Calculator Page
function initializeCalculator() {
    const calculator = new FinanceCalculator({
        loanAmount: document.getElementById('loanAmount'),
        interestRate: document.getElementById('interestRate'),
        term: document.getElementById('term'),
        calculateBtn: document.getElementById('calculateBtn'),
        resultContainer: document.getElementById('calculationResult')
    });

    calculator.initialize();
}

// Helper Functions
function loadFinancialOverview() {
    fetch('/api/finance/overview')
        .then(response => response.json())
        .then(data => {
            updateDashboardMetrics(data);
            updateCharts(data);
        })
        .catch(error => showNotification('Failed to load financial overview', 'error'));
}

function initializeTransactionFilters(table) {
    const filters = document.querySelectorAll('.transaction-filter');
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            const filterValues = Array.from(filters).reduce((acc, curr) => {
                acc[curr.name] = curr.value;
                return acc;
            }, {});
            
            applyTransactionFilters(table, filterValues);
        });
    });
}

function applyTransactionFilters(table, filters) {
    table.columns().every(function() {
        const column = this;
        const filterValue = filters[column.header().textContent.toLowerCase()];
        
        if (filterValue) {
            column.search(filterValue).draw();
        }
    });
}

function trackNavigation(path) {
    // Analytics tracking
    if (window.analytics) {
        window.analytics.track('Page View', {
            path: path,
            role: 'finance',
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
window.FinanceModule = {
    initializeDashboard,
    initializeTransactions,
    initializeLoans,
    initializeReports,
    initializeCalculator,
    showNotification
};

// Initialize Finance Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeCharts();
    initializeDataTables();
    handleTransactions();
    handleLoanAccounts();
    handleReports();
    handleCalculations();

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