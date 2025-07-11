// orders.js - Order Management Page
let ordersData = [];

// Main rendering function
const renderOrders = async () => {
  try {
    await activeLoading();
    
    const container = document.getElementById('container');
    container.innerHTML = `
      <div class="container-fluid py-4">
        <h1 class="mb-4">Incoming Orders</h1>
        
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Orders List</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="ordersTableBody">
                  <tr>
                    <td colspan="6" class="text-center py-4">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      <p class="mt-2">Loading orders...</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">Order Details</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <h5>Customer Information</h5>
                  <hr>
                  <div class="mb-3">
                    <p><strong>Name:</strong> <span id="customerName"></span></p>
                    <p><strong>Phone:</strong> <span id="customerPhone"></span></p>
                    <p><strong>Address:</strong> <span id="customerAddress"></span></p>
                    <p><strong>City:</strong> <span id="customerCity"></span></p>
                  </div>
                </div>
                <div class="col-md-6">
                  <h5>Order Information</h5>
                  <hr>
                  <div class="mb-3">
                    <p><strong>Order ID:</strong> <span id="orderId"></span></p>
                    <p><strong>Date:</strong> <span id="orderDate"></span></p>
                    <p><strong>Status:</strong> <span id="orderStatus" class="order-status"></span></p>
                  </div>
                </div>
              </div>
              
              <h5 class="mt-4">Product Details</h5>
              <hr>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody id="productDetailsBody"></tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" id="deleteOrderBtn" style="display: none;">
                <i class="fas fa-trash me-2"></i>Delete
              </button>
              <button type="button" class="btn btn-danger" id="rejectOrderBtn" style="display: none;">
                <i class="fas fa-times-circle me-2"></i>Reject
              </button>
              <button type="button" class="btn btn-success" id="acceptOrderBtn" style="display: none;">
                <i class="fas fa-check-circle me-2"></i>Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    setupEventListeners();
    await fetchOrders();
    
  } catch (error) {
    console.error("Error rendering Orders page:", error);
    document.getElementById('container').innerHTML = `
      <div class="alert alert-danger" role="alert">
        Failed to load orders. ${error.message}
      </div>
      <button class="btn btn-primary" onclick="renderOrders()">Try Again</button>
    `;
  } finally {
    disableLoading();
  }
};

// Set up event listeners
function setupEventListeners() {
  document.getElementById('acceptOrderBtn')?.addEventListener('click', handleAcceptOrder);
  document.getElementById('rejectOrderBtn')?.addEventListener('click', handleRejectOrder);
  document.getElementById('deleteOrderBtn')?.addEventListener('click', handleDeleteOrder);
}

// Fetch orders from API
const fetchOrders = async () => {
  try {
    const response = await fetch(`http://localhost:5501/api/orders/getsellerorders/${userData.id}`);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch orders');
    
    ordersData = data.orders;
    renderOrdersTable(data.orders || []);
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    document.getElementById('ordersTableBody').innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4 text-danger">
          <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <p>${error.message}</p>
          <button class="btn btn-sm btn-outline-primary" onclick="fetchOrders()">
            <i class="fas fa-sync-alt me-2"></i>Try Again
          </button>
        </td>
      </tr>
    `;
  }
};

// Render orders table
const renderOrdersTable = (orders) => {
  const tbody = document.getElementById('ordersTableBody');
  
  if (!orders || orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          <i class="fas fa-box-open fa-2x mb-3 text-muted"></i>
          <p class="text-muted">You don't have any orders yet</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = orders.map(order => `
    <tr class="order-row" data-order-id="${order._id}">
      <td>${order._id.substring(0, 8)}...</td>
      <td>${formatDate(order.createdAt)}</td>
      <td>${order.items.length} item(s)</td>
      <td>$${order.totalPrice.toFixed(2)}</td>
      <td><span class="order-status ${getStatusClass(order.status)}">${order.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary view-details-btn" data-order-id="${order._id}">
          <i class="fas fa-eye"></i> Details
        </button>
      </td>
    </tr>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.order-row, .view-details-btn').forEach(element => {
    element.addEventListener('click', (e) => {
      const orderId = element.getAttribute('data-order-id') || 
                     element.closest('.order-row')?.getAttribute('data-order-id');
      if (orderId) showOrderDetails(orderId);
    });
  });
};

// Show order details
const showOrderDetails = async (orderId) => {
  try {
    const order = ordersData.find(o => o._id === orderId);
    if (!order) throw new Error('Order not found');

    // Set customer info
    document.getElementById('customerName').textContent = 
      `${order.contactInfo.firstName} ${order.contactInfo.middleName || ''} ${order.contactInfo.lastName}`.trim();
    document.getElementById('customerPhone').textContent = order.contactInfo.phoneNumber || 'N/A';
    document.getElementById('customerAddress').textContent = order.contactInfo.address || 'N/A';
    document.getElementById('customerCity').textContent = order.contactInfo.city || 'N/A';

    // Set order info
    document.getElementById('orderId').textContent = order._id;
    document.getElementById('orderDate').textContent = formatDate(order.createdAt);
    const statusElement = document.getElementById('orderStatus');
    statusElement.textContent = order.status;
    statusElement.className = `order-status ${getStatusClass(order.status)}`;

    // Set product details
    const productDetailsBody = document.getElementById('productDetailsBody');
    productDetailsBody.innerHTML = order.items.map(item => `
      <tr>
        <td>${item.productName || 'Product ' + item.productId.substring(0, 6)}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    // Show/hide action buttons based on status
    const acceptBtn = document.getElementById('acceptOrderBtn');
    const rejectBtn = document.getElementById('rejectOrderBtn');
    const deleteBtn = document.getElementById('deleteOrderBtn');
    
    const status = order.status.toLowerCase();
    const showActions = ['pending', 'binding'].includes(status);
    
    acceptBtn.style.display = showActions ? 'inline-block' : 'none';
    rejectBtn.style.display = showActions ? 'inline-block' : 'none';
    deleteBtn.style.display = showActions ? 'inline-block' : 'none';

    // Store current order ID
    window.currentOrderId = order._id;
    
    // Initialize and show modal
    const modalElement = document.getElementById('orderDetailsModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Clean up when modal is closed
    const handleModalClose = () => {
      modal.hide();
      modal.dispose();
      modalElement.remove();
      document.querySelector('.modal-backdrop')?.remove();
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
    };

    modalElement.addEventListener('hidden.bs.modal', handleModalClose);
    
  } catch (error) {
    console.error('Error showing order details:', error);
    showNotification('error', error.message || 'Failed to load order details');
  }
};

// Handle accept order
const handleAcceptOrder = async () => {
  if (!window.currentOrderId) return;
  
  try {
    // Show confirmation message
    const confirmation = confirm('Are you sure you want to confirm this order?');
    if (!confirmation) return;
    
    // Show processing message
    showNotification('info', 'Processing order confirmation...');
    
    const response = await fetch(`http://localhost:5501/api/orders/accept/${window.currentOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    showNotification('success', 'Order has been successfully confirmed!');
    
    // Close modal properly
    const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
    modal.hide();
    
    await fetchOrders();
    
  } catch (error) {
    console.error('Error accepting order:', error);
    showNotification('error', error.message || 'Failed to confirm order');
  }
};

// Handle reject order
const handleRejectOrder = async () => {
  if (!window.currentOrderId) return;
  
  try {
    // Show confirmation message
    const confirmation = confirm('Are you sure you want to reject this order?');
    if (!confirmation) return;
    
    // Show processing message
    showNotification('info', 'Processing order rejection...');
    
    const response = await fetch(`http://localhost:5501/api/orders/reject/${window.currentOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    showNotification('success', 'Order has been successfully rejected!');
    
    // Close modal properly
    const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
    modal.hide();
    
    await fetchOrders();
    
  } catch (error) {
    console.error('Error rejecting order:', error);
    showNotification('error', error.message || 'Failed to reject order');
  }
};

// Handle delete order
const handleDeleteOrder = async () => {
  if (!window.currentOrderId) return;
  
  try {
    // Show confirmation message
    const confirmation = confirm('Are you sure you want to permanently delete this order? This action cannot be undone.');
    if (!confirmation) return;
    
    // Show processing message
    showNotification('info', 'Processing order deletion...');
    
    const response = await fetch(`http://localhost:5501/api/orders/delete/${window.currentOrderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    showNotification('success', 'Order has been successfully deleted!');
    
    // Close modal properly
    const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
    modal.hide();
    
    await fetchOrders();
    
  } catch (error) {
    console.error('Error deleting order:', error);
    showNotification('error', error.message || 'Failed to delete order');
  }
};

// Helper functions
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'accepted': return 'status-accepted';
    case 'rejected': return 'status-rejected';
    case 'binding': return 'status-binding';
    case 'pending': return 'status-pending';
    default: return 'status-default';
  }
}

// Make render function available globally
window.renderOrders = renderOrders;