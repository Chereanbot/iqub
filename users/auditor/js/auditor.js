// Initialize Charts
function initializeCharts() {
    // Compliance Overview Chart is already initialized in dashboard.html
}

// Initialize DataTables
function initializeDataTables() {
    const auditTable = document.querySelector('.table');
    if (auditTable) {
        new DataTable(auditTable, {
            pageLength: 10,
            order: [[5, 'desc']], // Sort by date column
            responsive: true
        });
    }
}

// Handle New Audit
function handleNewAudit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Validate form data
    if (!formData.get('auditType') || !formData.get('department')) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Simulate API call
    setTimeout(() => {
        showNotification('New audit created successfully', 'success');
        // Reset form and refresh table
        event.target.reset();
        // Refresh audit list
    }, 1000);
}

// Handle Finding Report
function handleFindingReport(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Validate form data
    if (!formData.get('findingType') || !formData.get('description')) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Simulate API call
    setTimeout(() => {
        showNotification('Finding reported successfully', 'success');
        // Reset form and refresh findings
        event.target.reset();
        // Refresh findings list
    }, 1000);
}

// Handle Report Generation
function handleReportGeneration(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Validate form data
    if (!formData.get('reportType') || !formData.get('dateRange')) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Simulate API call
    setTimeout(() => {
        showNotification('Report generated successfully', 'success');
        // Trigger report download
        downloadReport(formData.get('reportType'));
    }, 1500);
}

// Download Report
function downloadReport(reportType) {
    // Simulate report download
    const link = document.createElement('a');
    link.href = `reports/${reportType.toLowerCase()}_report.pdf`;
    link.download = `${reportType}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Update Audit Status
function updateAuditStatus(auditId, newStatus) {
    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
        showNotification('Invalid audit status', 'error');
        return;
    }

    // Simulate API call
    setTimeout(() => {
        showNotification(`Audit status updated to ${newStatus}`, 'success');
        // Update UI
        updateAuditStatusUI(auditId, newStatus);
    }, 800);
}

// Update Audit Status UI
function updateAuditStatusUI(auditId, status) {
    const statusBadge = document.querySelector(`[data-audit-id="${auditId}"] .status-badge`);
    if (statusBadge) {
        // Remove existing status classes
        statusBadge.classList.remove('bg-warning', 'bg-success', 'bg-danger', 'bg-info');
        
        // Add new status class and update text
        switch (status) {
            case 'pending':
                statusBadge.classList.add('bg-warning');
                statusBadge.textContent = 'Pending';
                break;
            case 'in-progress':
                statusBadge.classList.add('bg-info');
                statusBadge.textContent = 'In Progress';
                break;
            case 'completed':
                statusBadge.classList.add('bg-success');
                statusBadge.textContent = 'Completed';
                break;
            case 'cancelled':
                statusBadge.classList.add('bg-danger');
                statusBadge.textContent = 'Cancelled';
                break;
        }
    }
}

// Handle Finding Resolution
function handleFindingResolution(findingId, resolution) {
    // Validate resolution
    if (!resolution.trim()) {
        showNotification('Please provide resolution details', 'error');
        return;
    }

    // Simulate API call
    setTimeout(() => {
        showNotification('Finding resolved successfully', 'success');
        // Update UI
        updateFindingUI(findingId, 'resolved');
    }, 800);
}

// Update Finding UI
function updateFindingUI(findingId, status) {
    const findingElement = document.querySelector(`[data-finding-id="${findingId}"]`);
    if (findingElement) {
        if (status === 'resolved') {
            findingElement.classList.add('resolved');
            const badge = findingElement.querySelector('.badge');
            if (badge) {
                badge.classList.remove('bg-danger', 'bg-warning');
                badge.classList.add('bg-success');
                badge.textContent = 'Resolved';
            }
        }
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = document.createElement('i');
    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    notification.appendChild(icon);
    notification.appendChild(document.createTextNode(` ${message}`));
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Search Functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        // Get all searchable elements
        const searchableElements = document.querySelectorAll('[data-searchable]');
        
        searchableElements.forEach(element => {
            const searchableText = element.textContent.toLowerCase();
            const searchableData = element.dataset.searchable.toLowerCase();
            
            if (searchableText.includes(searchTerm) || searchableData.includes(searchTerm)) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    }, 300));
}

// Debounce Function
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

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeDataTables();
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
    
    // Initialize popovers
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach(popover => new bootstrap.Popover(popover));
    
    // Add form submit event listeners
    const newAuditForm = document.getElementById('newAuditForm');
    if (newAuditForm) {
        newAuditForm.addEventListener('submit', handleNewAudit);
    }
    
    const findingForm = document.getElementById('findingForm');
    if (findingForm) {
        findingForm.addEventListener('submit', handleFindingReport);
    }
    
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportGeneration);
    }
    
    // Add animation to stats cards
    const statsCards = document.querySelectorAll('.stats-card');
    statsCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });
});

// Audit Team Sidebar Functionality
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
    // Load audit overview
    loadAuditOverview();
    // Initialize compliance metrics
    initializeComplianceMetrics();
    // Load recent findings
    loadRecentFindings();
}

// Audits Page
function initializeAudits() {
    const auditTable = new DataTable('#auditTable', {
        pageLength: 10,
        order: [[2, 'desc']], // Sort by start date
        responsive: true,
        dom: '<"audit-header"<"row"<"col-md-6"l><"col-md-6"f>>>rt<"audit-footer"<"row"<"col-md-6"i><"col-md-6"p>>>',
        language: {
            search: '<i class="fas fa-search"></i>',
            searchPlaceholder: 'Search audits...'
        }
    });

    // Initialize audit filters
    initializeAuditFilters(auditTable);
}

// Compliance Page
function initializeCompliance() {
    // Load compliance checks
    loadComplianceChecks();
    // Initialize policy reviews
    initializePolicyReviews();
    // Load regulation tracking
    loadRegulationTracking();
}

// Reports Page
function initializeReports() {
    // Load report templates
    loadReportTemplates();
    // Initialize findings summary
    initializeFindingsSummary();
    // Load audit reports
    loadAuditReports();
}

// Logs Page
function initializeLogs() {
    // Load system logs
    loadSystemLogs();
    // Initialize log filters
    initializeLogFilters();
    // Load activity timeline
    loadActivityTimeline();
}

// Helper Functions
function loadAuditOverview() {
    fetch('/api/audit/overview')
        .then(response => response.json())
        .then(data => {
            updateDashboardMetrics(data);
            updateCharts(data);
        })
        .catch(error => showNotification('Failed to load audit overview', 'error'));
}

function initializeAuditFilters(table) {
    const filters = document.querySelectorAll('.audit-filter');
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            const filterValues = Array.from(filters).reduce((acc, curr) => {
                acc[curr.name] = curr.value;
                return acc;
            }, {});
            
            applyAuditFilters(table, filterValues);
        });
    });
}

function applyAuditFilters(table, filters) {
    table.columns().every(function() {
        const column = this;
        const filterValue = filters[column.header().textContent.toLowerCase()];
        
        if (filterValue) {
            column.search(filterValue).draw();
        }
    });
}

function handleFindingSubmission(findingData) {
    fetch('/api/audit/findings/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(findingData)
    })
    .then(response => response.json())
    .then(data => {
        showNotification('Finding submitted successfully', 'success');
        updateFindingsList(data);
    })
    .catch(error => showNotification('Failed to submit finding', 'error'));
}

function trackNavigation(path) {
    // Analytics tracking
    if (window.analytics) {
        window.analytics.track('Page View', {
            path: path,
            role: 'auditor',
            timestamp: new Date()
        });
    }
}

// Export functions for use in other modules
window.AuditorModule = {
    initializeDashboard,
    initializeAudits,
    initializeCompliance,
    initializeReports,
    initializeLogs,
    handleFindingSubmission,
    showNotification
}; 