// Load sidebar and header
document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
    initializeButtons();
});

function loadComponents() {
    fetch('components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
        });

    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        });
}

function initializeButtons() {
    // Approve buttons
    document.querySelectorAll('.btn-approve').forEach(button => {
        button.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            const id = row.querySelector('td:first-child').textContent;
            const name = row.querySelector('td:nth-child(2)').textContent;
            showApprovalModal(id, name);
        });
    });

    // Download buttons
    document.querySelectorAll('.btn-download').forEach(button => {
        button.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            const id = row.querySelector('td:first-child').textContent;
            handleDownload(id);
        });
    });

    // View buttons
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            const id = row.querySelector('td:first-child').textContent;
            showDetailsModal(id);
        });
    });
}

function showApprovalModal(id, name) {
    const modalHtml = `
        <div class="modal fade" id="approvalModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Approve Request</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to approve the request from ${name} (${id})?</p>
                        <form id="approvalForm">
                            <div class="mb-3">
                                <label class="form-label">Comments</label>
                                <textarea class="form-control" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="handleApproval('${id}')">Confirm Approval</button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('approvalModal'));
    modal.show();

    // Clean up modal after hiding
    document.getElementById('approvalModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function showDetailsModal(id) {
    const modalHtml = `
        <div class="modal fade" id="detailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Details for ${id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Basic Information</h6>
                                <p><strong>ID:</strong> ${id}</p>
                                <p><strong>Status:</strong> <span class="status-badge pending">Pending</span></p>
                            </div>
                            <div class="col-md-6">
                                <h6>Additional Information</h6>
                                <p><strong>Created Date:</strong> 2024-02-28</p>
                                <p><strong>Last Updated:</strong> 2024-02-28</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();

    // Clean up modal after hiding
    document.getElementById('detailsModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function handleApproval(id) {
    // Simulate API call
    console.log(`Approving request ${id}`);
    const modal = bootstrap.Modal.getInstance(document.getElementById('approvalModal'));
    modal.hide();
    
    // Show success message
    showNotification('Success', `Request ${id} has been approved successfully.`, 'success');
}

function handleDownload(id) {
    // Simulate download
    console.log(`Downloading ${id}`);
    showNotification('Success', `Download started for ${id}`, 'info');
}

function showNotification(title, message, type = 'info') {
    const toastHtml = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast" role="alert">
                <div class="toast-header">
                    <strong class="me-auto">${title}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.querySelector('.toast:last-child');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Clean up toast after hiding
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.parentElement.remove();
    });
} 