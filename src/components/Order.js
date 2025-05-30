import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000/api/v1/user';

// Get axios config with auth headers
const getAuthConfig = () => ({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('accessToken')}`
    }
});

// API functions
const getRestaurantOrders = async () => {
    const res = await axios.get(
        `${API_BASE_URL}/order/restaurant`,
        getAuthConfig()
    );
    return res.data.data;
};

const updateOrderStatus = async (orderId, status) => {
    const res = await axios.put(
        `${API_BASE_URL}/order/status`,
        { orderId, status },
        getAuthConfig()
    );
    return res.data.data;
};

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrder, setUpdatingOrder] = useState(null);
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [orderTypeFilter, setOrderTypeFilter] = useState('all');
    
    const { restaurant } = useSelector((state) => state.restaurant);

    const validStatuses = ["pending", "approved", "preparing", "ready", "completed", "rejected", "cancelled"];
    const orderTypes = ["dine-in", "takeaway", "delivery"];
    
    // Status colors for UI
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            preparing: 'bg-orange-100 text-orange-800',
            ready: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            rejected: 'bg-red-100 text-red-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    // Get order type color
    const getOrderTypeColor = (orderType) => {
        const colors = {
            'dine-in': 'bg-purple-100 text-purple-800',
            'takeaway': 'bg-indigo-100 text-indigo-800',
            'delivery': 'bg-cyan-100 text-cyan-800'
        };
        return colors[orderType] || 'bg-gray-100 text-gray-800';
    };

    // Get valid next statuses based on current status
    const getNextStatuses = (currentStatus) => {
        const transitions = {
            pending: ["approved", "rejected", "cancelled"],
            approved: ["preparing", "cancelled"],
            preparing: ["ready", "cancelled"],
            ready: ["completed"],
            rejected: [],
            cancelled: [],
            completed: []
        };
        return transitions[currentStatus] || [];
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter orders whenever filters change
    useEffect(() => {
        filterOrders();
    }, [orders, statusFilter, orderTypeFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const ordersData = await getRestaurantOrders();
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Filter by order type
        if (orderTypeFilter !== 'all') {
            filtered = filtered.filter(order => order.orderType === orderTypeFilter);
        }

        setFilteredOrders(filtered);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setUpdatingOrder(orderId);
            const updatedOrder = await updateOrderStatus(orderId, newStatus);
            
            // Update the order in the local state
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id === orderId ? updatedOrder : order
                )
            );
            
            toast.success('Order status updated successfully');
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error(error.response?.data?.message || 'Failed to update order status');
        } finally {
            setUpdatingOrder(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateTotal = (order) => {
        return order.total ? order.total.toFixed(2) : 
               order.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // Get counts for filter badges
    const getFilterCounts = () => {
        const counts = {
            all: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            completed: orders.filter(o => o.status === 'completed').length,
        };
        
        orderTypes.forEach(type => {
            counts[type] = orders.filter(o => o.orderType === type).length;
        });
        
        return counts;
    };

    const filterCounts = getFilterCounts();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-infinity loading-xl"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Restaurant Orders</h2>
                <button
                    onClick={fetchOrders}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Refresh Orders
                </button>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Filter */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    statusFilter === 'all' 
                                        ? 'bg-gray-800 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All ({filterCounts.all})
                            </button>
                            <button
                                onClick={() => setStatusFilter('pending')}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    statusFilter === 'pending' 
                                        ? 'bg-yellow-600 text-white' 
                                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                }`}
                            >
                                Pending ({filterCounts.pending})
                            </button>
                            <button
                                onClick={() => setStatusFilter('completed')}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    statusFilter === 'completed' 
                                        ? 'bg-gray-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Completed ({filterCounts.completed})
                            </button>
                            {validStatuses.filter(s => !['pending', 'completed'].includes(s)).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                        statusFilter === status 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)} 
                                    ({orders.filter(o => o.status === status).length})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Order Type Filter */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Order Type</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setOrderTypeFilter('all')}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    orderTypeFilter === 'all' 
                                        ? 'bg-gray-800 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All Types ({filterCounts.all})
                            </button>
                            {orderTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setOrderTypeFilter(type)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                        orderTypeFilter === type 
                                            ? 'bg-purple-600 text-white' 
                                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                    }`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)} ({filterCounts[type]})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active Filters Summary */}
                {(statusFilter !== 'all' || orderTypeFilter !== 'all') && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Active filters:</span>
                            {statusFilter !== 'all' && (
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                    Status: {statusFilter}
                                </span>
                            )}
                            {orderTypeFilter !== 'all' && (
                                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                    Type: {orderTypeFilter}
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setStatusFilter('all');
                                    setOrderTypeFilter('all');
                                }}
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                Clear all
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Orders Display */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-3">📋</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-1">
                        {orders.length === 0 ? 'No Orders Yet' : 'No Orders Match Your Filters'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {orders.length === 0 
                            ? 'Orders will appear here when customers place them'
                            : 'Try adjusting your filters to see more orders'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                            {/* Order Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-base font-semibold text-gray-800">
                                            #{order._id.slice(-6)}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getOrderTypeColor(order.orderType)}`}>
                                            {order.orderType === 'dine-in' ? 'DINE' : order.orderType.toUpperCase()}
                                        </span>
                                        {order.tableNumber && (
                                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                T{order.tableNumber}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-700 font-medium">{order.customer?.fullname || 'Unknown'}</p>
                                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                    <p className="text-lg font-bold text-gray-800 mt-1">
                                        ₹{calculateTotal(order)}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items - Compact */}
                            <div className="mb-3">
                                <div className="space-y-1">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-1">
                                            <div className="flex items-center space-x-2 flex-1">
                                                {item.image && (
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name}
                                                        className="w-8 h-8 rounded object-cover"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-500">× {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 ml-2">
                                                ₹{(item.price * item.quantity).toFixed(0)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Info - Compact */}
                            <div className="space-y-1 mb-3">
                                {order.orderType === 'delivery' && order.deliveryAddress && (
                                    <div className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
                                        📍 {order.deliveryAddress.length > 40 ? order.deliveryAddress.substring(0, 40) + '...' : order.deliveryAddress}
                                    </div>
                                )}
                                
                                {order.specialInstructions && (
                                    <div className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                        💬 {order.specialInstructions.length > 50 ? order.specialInstructions.substring(0, 50) + '...' : order.specialInstructions}
                                    </div>
                                )}
                                
                                {order.paymentMethod && (
                                    <div className="text-xs text-green-700">
                                        💳 {order.paymentMethod.toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Status Actions - Compact */}
                            <div className="flex flex-wrap gap-1">
                                {getNextStatuses(order.status).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(order._id, status)}
                                        disabled={updatingOrder === order._id}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                                            status === 'approved' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                                            status === 'preparing' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                                            status === 'ready' ? 'bg-green-600 hover:bg-green-700 text-white' :
                                            status === 'completed' ? 'bg-gray-600 hover:bg-gray-700 text-white' :
                                            status === 'rejected' ? 'bg-red-600 hover:bg-red-700 text-white' :
                                            status === 'cancelled' ? 'bg-red-600 hover:bg-red-700 text-white' :
                                            'bg-gray-600 hover:bg-gray-700 text-white'
                                        }`}
                                    >
                                        {updatingOrder === order._id ? '...' : 
                                         status === 'approved' ? 'APPROVE' :
                                         status === 'preparing' ? 'PREPARE' :
                                         status === 'ready' ? 'READY' :
                                         status === 'completed' ? 'COMPLETE' :
                                         status === 'rejected' ? 'REJECT' :
                                         status === 'cancelled' ? 'CANCEL' :
                                         status.toUpperCase()
                                        }
                                    </button>
                                ))}
                            </div>

                            {/* Collapsible Status History */}
                            {order.statusHistory && order.statusHistory.length > 0 && (
                                <details className="mt-2 pt-2 border-t border-gray-100">
                                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                        View History ({order.statusHistory.length})
                                    </summary>
                                    <div className="mt-1 space-y-0.5">
                                        {order.statusHistory.slice(-3).map((history, index) => (
                                            <div key={index} className="flex justify-between text-xs text-gray-500">
                                                <span>{history.status.toUpperCase()}</span>
                                                <span>{new Date(history.changedAt).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Order;