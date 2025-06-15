import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { downloadReportAsPDF } from './downloadReport';
const DailyIncomeReport = ({ isOpen, onClose }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:8000/api/v1/user';

    // Get axios config with auth headers
    const getAuthConfig = () => ({
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('accessToken')}`
        }
    });

    // API function to get restaurant orders
    const getRestaurantOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(
                `${API_BASE_URL}/order/restaurant`,
                getAuthConfig()
            );
            setOrders(res.data.data || []);
        } catch (err) {
            setError('Failed to fetch orders');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders when component opens
    useEffect(() => {
        if (isOpen) {
            getRestaurantOrders();
        }
    }, [isOpen]);

    // Filter and group orders by date
    const dailyReport = useMemo(() => {
        // Filter orders for selected date and completed status
        const selectedDateOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
            return orderDate === selectedDate && order.status === 'completed';
        });

        // Group orders by date and calculate totals
        const report = {
            date: selectedDate,
            orders: selectedDateOrders,
            totalOrders: selectedDateOrders.length,
            totalIncome: selectedDateOrders.reduce((sum, order) => sum + (order.total || 0), 0),
            totalSubtotal: selectedDateOrders.reduce((sum, order) => sum + (order.subtotal || 0), 0),
            totalTax: selectedDateOrders.reduce((sum, order) => sum + (order.tax || 0), 0),
            ordersByType: {
                'dine-in': selectedDateOrders.filter(o => o.orderType === 'dine-in').length,
                'takeaway': selectedDateOrders.filter(o => o.orderType === 'takeaway').length,
                'delivery': selectedDateOrders.filter(o => o.orderType === 'delivery').length,
            },
            paymentMethods: selectedDateOrders.reduce((acc, order) => {
                acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
                return acc;
            }, {})
        };

        return report;
    }, [orders, selectedDate]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOrderTypeColor = (orderType) => {
        const colors = {
            'dine-in': 'bg-purple-100 text-purple-800',
            'takeaway': 'bg-indigo-100 text-indigo-800',
            'delivery': 'bg-cyan-100 text-cyan-800'
        };
        return colors[orderType] || 'bg-gray-100 text-gray-800';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Daily Income Report</h2>
                            <p className="text-green-100 mt-1">Track your daily earnings and orders</p>


                            {/* PDF Download */}
                            <button
                                onClick={() => downloadReportAsPDF(dailyReport)}
                                disabled={loading || dailyReport.orders.length === 0}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                            >
                                📑 Download PDF
                            </button>
                        </div>


                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-800 transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {/* Date Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                            onClick={getRestaurantOrders}
                            disabled={loading}
                            className="ml-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading orders...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="text-red-400 text-xl mr-3">⚠️</div>
                                <div>
                                    <h3 className="text-red-800 font-medium">Error Loading Data</h3>
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="text-blue-600 text-sm font-medium">Total Orders</div>
                                    <div className="text-3xl font-bold text-blue-800">{dailyReport.totalOrders}</div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="text-green-600 text-sm font-medium">Total Income</div>
                                    <div className="text-3xl font-bold text-green-800">₹{dailyReport.totalIncome.toFixed(2)}</div>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <div className="text-purple-600 text-sm font-medium">Subtotal</div>
                                    <div className="text-3xl font-bold text-purple-800">₹{dailyReport.totalSubtotal.toFixed(2)}</div>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <div className="text-orange-600 text-sm font-medium">Tax Collected</div>
                                    <div className="text-3xl font-bold text-orange-800">₹{dailyReport.totalTax.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Order Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Order Types */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Orders by Type</h3>
                                    <div className="space-y-2">
                                        {Object.entries(dailyReport.ordersByType).map(([type, count]) => (
                                            <div key={type} className="flex justify-between items-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderTypeColor(type)}`}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </span>
                                                <span className="font-semibold">{count} orders</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Methods</h3>
                                    <div className="space-y-2">
                                        {Object.entries(dailyReport.paymentMethods).map(([method, count]) => (
                                            <div key={method} className="flex justify-between items-center">
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    {method.toUpperCase()}
                                                </span>
                                                <span className="font-semibold">{count} orders</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Orders Table */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Detailed Orders for {new Date(selectedDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </h3>
                                </div>

                                {dailyReport.orders.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 text-4xl mb-3">📊</div>
                                        <h3 className="text-lg font-semibold text-gray-600 mb-1">No Completed Orders</h3>
                                        <p className="text-sm text-gray-500">
                                            No completed orders found for {new Date(selectedDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Note: Only orders with "completed" status are included in the report
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {dailyReport.orders.map((order) => (
                                                    <tr key={order._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            #{order._id.slice(-6)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {order.customer?.fullname || 'Guest'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderTypeColor(order.orderType)}`}>
                                                                {order.orderType === 'dine-in' ? 'DINE' : order.orderType.toUpperCase()}
                                                            </span>
                                                            {order.tableNumber && (
                                                                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                                    T{order.tableNumber}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            <div className="max-w-xs">
                                                                {order.items.map((item, idx) => (
                                                                    <div key={idx} className="text-xs">
                                                                        {item.name} × {item.quantity}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                                {order.paymentMethod?.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(order.createdAt).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                            ₹{order.total.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Total Summary */}
                            {dailyReport.orders.length > 0 && (
                                <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <div className="text-sm text-gray-600">Subtotal</div>
                                            <div className="text-xl font-bold text-gray-800">₹{dailyReport.totalSubtotal.toFixed(2)}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-gray-600">Tax</div>
                                            <div className="text-xl font-bold text-gray-800">₹{dailyReport.totalTax.toFixed(2)}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-green-600 font-medium">Total Income</div>
                                            <div className="text-3xl font-bold text-green-800">₹{dailyReport.totalIncome.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Debug Info */}
                            <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
                                <p>Total orders loaded: {orders.length}</p>
                                <p>Completed orders for selected date: {dailyReport.orders.length}</p>
                                <p>Orders by status: {orders.reduce((acc, order) => {
                                    acc[order.status] = (acc[order.status] || 0) + 1;
                                    return acc;
                                }, {}) && Object.entries(orders.reduce((acc, order) => {
                                    acc[order.status] = (acc[order.status] || 0) + 1;
                                    return acc;
                                }, {})).map(([status, count]) => `${status}: ${count}`).join(', ')}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyIncomeReport;