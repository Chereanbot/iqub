// Support Dashboard JavaScript

// Initialize Charts
function initializeCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart')?.getContext('2d');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Resolved', 'In Progress', 'Open', 'Pending'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#10b981', '#2563eb', '#f59e0b', '#ef4444'],
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

// Handle Ticket Management
function handleTickets() {
    // Create Ticket Form
    const createTicketForm = document.getElementById('createTicketForm');
    if (createTicketForm) {
        createTicketForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(createTicketForm);
                const response = await fetch('/api/tickets', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Failed to create ticket');

                showNotification('success', 'Ticket created successfully');
                createTicketForm.reset();
                
                // Refresh ticket list
                if (typeof loadTickets === 'function') {
                    loadTickets();
                }
            } catch (error) {
                console.error('Error creating ticket:', error);
                showNotification('error', 'Failed to create ticket. Please try again.');
            }
        });
    }

    // Update Ticket Status
    const ticketStatusSelects = document.querySelectorAll('.ticket-status-select');
    ticketStatusSelects.forEach(select => {
        select.addEventListener('change', async (e) => {
            const ticketId = select.getAttribute('data-ticket-id');
            const newStatus = e.target.value;
            
            try {
                const response = await fetch(`/api/tickets/${ticketId}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) throw new Error('Status update failed');

                showNotification('success', 'Ticket status updated successfully');
            } catch (error) {
                console.error('Error updating ticket status:', error);
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

// Handle Live Chat
function handleLiveChat() {
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');

    if (chatContainer && messageInput && sendButton) {
        // Send Message
        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                appendMessage('outgoing', message);
                messageInput.value = '';
                
                // Simulate response (replace with actual API call)
                setTimeout(() => {
                    appendMessage('incoming', 'Thank you for your message. How can I help you today?');
                }, 1000);
            }
        });

        // Handle Enter key
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButton.click();
            }
        });
    }
}

// Append Message to Chat
function appendMessage(type, content) {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
                <small class="text-muted">${new Date().toLocaleTimeString()}</small>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Handle Knowledge Base
function handleKnowledgeBase() {
    // Article Search
    const articleSearch = document.getElementById('articleSearch');
    if (articleSearch) {
        articleSearch.addEventListener('input', debounce(async (e) => {
            const searchTerm = e.target.value;
            try {
                const response = await fetch(`/api/kb/search?q=${searchTerm}`);
                if (!response.ok) throw new Error('Search failed');

                const results = await response.json();
                updateArticleList(results);
            } catch (error) {
                console.error('Error searching articles:', error);
            }
        }, 300));
    }

    // Article Editor
    const articleEditor = document.getElementById('articleEditor');
    if (articleEditor) {
        const editor = new SimpleMDE({
            element: articleEditor,
            spellChecker: true,
            autosave: {
                enabled: true,
                delay: 1000,
                uniqueId: 'article-draft'
            }
        });

        // Handle article submission
        const articleForm = document.getElementById('articleForm');
        if (articleForm) {
            articleForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                try {
                    const formData = new FormData(articleForm);
                    formData.append('content', editor.value());
                    
                    const response = await fetch('/api/kb/articles', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) throw new Error('Failed to save article');

                    showNotification('success', 'Article saved successfully');
                    editor.value('');
                    articleForm.reset();
                } catch (error) {
                    console.error('Error saving article:', error);
                    showNotification('error', 'Failed to save article. Please try again.');
                }
            });
        }
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

// Support Team Sidebar Functionality
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
    // Load support overview
    loadSupportOverview();
    // Initialize ticket metrics
    initializeTicketMetrics();
    // Load recent activities
    loadRecentActivities();
}

// Tickets Page
function initializeTickets() {
    const ticketTable = new DataTable('#ticketTable', {
        pageLength: 10,
        order: [[6, 'desc']], // Sort by created date
        responsive: true,
        dom: '<"ticket-header"<"row"<"col-md-6"l><"col-md-6"f>>>rt<"ticket-footer"<"row"<"col-md-6"i><"col-md-6"p>>>',
        language: {
            search: '<i class="fas fa-search"></i>',
            searchPlaceholder: 'Search tickets...'
        }
    });

    // Initialize ticket filters
    initializeTicketFilters(ticketTable);
}

// Knowledge Base Page
function initializeKnowledgeBase() {
    // Load articles
    loadArticles();
    // Initialize article editor
    initializeArticleEditor();
    // Load categories
    loadCategories();
}

// Live Chat Page
function initializeLiveChat() {
    // Initialize chat interface
    initializeChatInterface();
    // Load chat history
    loadChatHistory();
    // Initialize quick responses
    initializeQuickResponses();
}

// Reports Page
function initializeReports() {
    // Load report templates
    loadReportTemplates();
    // Initialize support metrics
    initializeSupportMetrics();
    // Load satisfaction reports
    loadSatisfactionReports();
}

// Helper Functions
function loadSupportOverview() {
    fetch('/api/support/overview')
        .then(response => response.json())
        .then(data => {
            updateDashboardMetrics(data);
            updateCharts(data);
        })
        .catch(error => showNotification('Failed to load support overview', 'error'));
}

function initializeTicketFilters(table) {
    const filters = document.querySelectorAll('.ticket-filter');
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            const filterValues = Array.from(filters).reduce((acc, curr) => {
                acc[curr.name] = curr.value;
                return acc;
            }, {});
            
            applyTicketFilters(table, filterValues);
        });
    });
}

function applyTicketFilters(table, filters) {
    table.columns().every(function() {
        const column = this;
        const filterValue = filters[column.header().textContent.toLowerCase()];
        
        if (filterValue) {
            column.search(filterValue).draw();
        }
    });
}

function handleTicketResponse(ticketId, response) {
    fetch(`/api/support/tickets/${ticketId}/respond`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response })
    })
    .then(response => response.json())
    .then(data => {
        showNotification('Response sent successfully', 'success');
        updateTicketStatus(ticketId, data.status);
    })
    .catch(error => showNotification('Failed to send response', 'error'));
}

function initializeChatInterface() {
    const chatContainer = document.querySelector('.chat-container');
    const messageInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.chat-send');

    if (chatContainer && messageInput && sendButton) {
        // Handle message sending
        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                sendChatMessage(message);
                messageInput.value = '';
            }
        });

        // Handle Enter key
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButton.click();
            }
        });

        // Auto-scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function sendChatMessage(message) {
    // Add message to UI
    appendMessage('outgoing', message);

    // Send to server
    fetch('/api/support/chat/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.autoResponse) {
            appendMessage('incoming', data.autoResponse);
        }
    })
    .catch(error => showNotification('Failed to send message', 'error'));
}

function trackNavigation(path) {
    // Analytics tracking
    if (window.analytics) {
        window.analytics.track('Page View', {
            path: path,
            role: 'support',
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
window.SupportModule = {
    initializeDashboard,
    initializeTickets,
    initializeKnowledgeBase,
    initializeLiveChat,
    initializeReports,
    handleTicketResponse,
    showNotification
};

// Initialize Support Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeCharts();
    initializeDataTables();
    handleTickets();
    handleLiveChat();
    handleKnowledgeBase();

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