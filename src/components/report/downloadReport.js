
// Import jsPDF at the top of the file
import jsPDF from 'jspdf';
require('jspdf-autotable');

export const downloadReport = (dailyReport) => {
    const reportData = generateReportData(dailyReport);
    
    // Create CSV content
    const csvContent = convertToCSV(reportData);
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `daily-income-report-${dailyReport.date}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Generate structured report data
const generateReportData = (dailyReport) => {
    const reportDate = new Date(dailyReport.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return {
        summary: {
            reportDate,
            totalOrders: dailyReport.totalOrders,
            totalIncome: dailyReport.totalIncome,
            totalSubtotal: dailyReport.totalSubtotal,
            totalTax: dailyReport.totalTax
        },
        ordersByType: dailyReport.ordersByType,
        paymentMethods: dailyReport.paymentMethods,
        orders: dailyReport.orders.map(order => ({
            orderId: order._id.slice(-6),
            customer: order.customer?.fullname || 'Guest',
            orderType: order.orderType,
            tableNumber: order.tableNumber || 'N/A',
            items: order.items.map(item => `${item.name} × ${item.quantity}`).join('; '),
            paymentMethod: order.paymentMethod,
            time: new Date(order.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            subtotal: order.subtotal || 0,
            tax: order.tax || 0,
            total: order.total || 0
        }))
    };
};

// Convert data to CSV format
const convertToCSV = (reportData) => {
    let csv = '';
    
    // Report Header
    csv += `Daily Income Report\n`;
    csv += `Date: ${reportData.summary.reportDate}\n`;
    csv += `Generated on: ${new Date().toLocaleString()}\n`;
    csv += `\n`;
    
    // Summary Section
    csv += `SUMMARY\n`;
    csv += `Total Orders,${reportData.summary.totalOrders}\n`;
    csv += `Total Income,₹${reportData.summary.totalIncome.toFixed(2)}\n`;
    csv += `Total Subtotal,₹${reportData.summary.totalSubtotal.toFixed(2)}\n`;
    csv += `Total Tax,₹${reportData.summary.totalTax.toFixed(2)}\n`;
    csv += `\n`;
    
    // Orders by Type Section
    csv += `ORDERS BY TYPE\n`;
    Object.entries(reportData.ordersByType).forEach(([type, count]) => {
        csv += `${type.charAt(0).toUpperCase() + type.slice(1)},${count}\n`;
    });
    csv += `\n`;
    
    // Payment Methods Section
    csv += `PAYMENT METHODS\n`;
    Object.entries(reportData.paymentMethods).forEach(([method, count]) => {
        csv += `${method.toUpperCase()},${count}\n`;
    });
    csv += `\n`;
    
    // Detailed Orders Section
    csv += `DETAILED ORDERS\n`;
    csv += `Order ID,Customer,Type,Table,Items,Payment,Time,Subtotal,Tax,Total\n`;
    
    reportData.orders.forEach(order => {
        csv += `#${order.orderId},"${order.customer}","${order.orderType}","${order.tableNumber}","${order.items}","${order.paymentMethod}","${order.time}",₹${order.subtotal.toFixed(2)},₹${order.tax.toFixed(2)},₹${order.total.toFixed(2)}\n`;
    });
    
    return csv;
};

// Download as PDF (Manual table creation)
export const downloadReportAsPDF = (dailyReport) => {
    const doc = new jsPDF();
    const reportDate = new Date(dailyReport.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Header with colored background
    doc.setFillColor(34, 197, 94); // Green color
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('DAILY INCOME REPORT', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(reportDate, 105, 28, { align: 'center' });
    
    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    
    // Summary Section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY', 20, 55);
    
    // Summary content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Orders: ${dailyReport.totalOrders}`, 20, 70);
    doc.text(`Total Income: ₹${dailyReport.totalIncome.toFixed(2)}`, 20, 80);
    doc.text(`Subtotal: ₹${dailyReport.totalSubtotal.toFixed(2)}`, 20, 90);
    doc.text(`Tax Collected: ₹${dailyReport.totalTax.toFixed(2)}`, 20, 100);
    
    // Orders by Type Section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDERS BY TYPE', 20, 120);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let yPos = 135;
    Object.entries(dailyReport.ordersByType).forEach(([type, count]) => {
        doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`, 20, yPos);
        yPos += 10;
    });
    
    // Payment Methods Section
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT METHODS', 20, yPos);
    
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    Object.entries(dailyReport.paymentMethods).forEach(([method, count]) => {
        doc.text(`${method.toUpperCase()}: ${count}`, 20, yPos);
        yPos += 10;
    });
    
    // Detailed Orders Section
    if (dailyReport.orders.length > 0) {
        // Add new page if needed
        if (yPos > 220) {
            doc.addPage();
            yPos = 20;
        } else {
            yPos += 20;
        }
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('DETAILED ORDERS', 20, yPos);
        
        yPos += 15;
        
        // Table headers
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Order ID', 20, yPos);
        doc.text('Customer', 50, yPos);
        doc.text('Type', 90, yPos);
        doc.text('Payment', 120, yPos);
        doc.text('Time', 150, yPos);
        doc.text('Total', 180, yPos);
        
        // Draw header line
        doc.line(20, yPos + 2, 200, yPos + 2);
        yPos += 10;
        
        // Table rows
        doc.setFont('helvetica', 'normal');
        dailyReport.orders.forEach((order, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
                
                // Repeat headers on new page
                doc.setFont('helvetica', 'bold');
                doc.text('Order ID', 20, yPos);
                doc.text('Customer', 50, yPos);
                doc.text('Type', 90, yPos);
                doc.text('Payment', 120, yPos);
                doc.text('Time', 150, yPos);
                doc.text('Total', 180, yPos);
                doc.line(20, yPos + 2, 200, yPos + 2);
                yPos += 10;
                doc.setFont('helvetica', 'normal');
            }
            
            const orderId = `#${order._id.slice(-6)}`;
            const customer = (order.customer?.fullname || 'Guest').substring(0, 15);
            const orderType = order.orderType.toUpperCase();
            const payment = (order.paymentMethod?.toUpperCase() || 'N/A').substring(0, 8);
            const time = new Date(order.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const total = `₹${order.total.toFixed(2)}`;
            
            doc.text(orderId, 20, yPos);
            doc.text(customer, 50, yPos);
            doc.text(orderType, 90, yPos);
            doc.text(payment, 120, yPos);
            doc.text(time, 150, yPos);
            doc.text(total, 180, yPos);
            
            yPos += 8;
        });
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `Generated on ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
            105,
            290,
            { align: 'center' }
        );
    }
    
    // Save PDF
    doc.save(`daily-income-report-${dailyReport.date}.pdf`);
};

// Download Collection Summary as PDF (Manual version)
export const downloadCollectionSummaryAsPDF = (orders) => {
    const summaryData = generateCollectionSummary(orders);
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('COLLECTION SUMMARY', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Period: ${summaryData.length > 0 ? `${summaryData[summaryData.length - 1].date} to ${summaryData[0].date}` : 'No data'}`, 105, 28, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    
    // Overall Summary
    const totalOrders = summaryData.reduce((sum, day) => sum + day.totalOrders, 0);
    const totalIncome = summaryData.reduce((sum, day) => sum + day.totalIncome, 0);
    const totalSubtotal = summaryData.reduce((sum, day) => sum + day.totalSubtotal, 0);
    const totalTax = summaryData.reduce((sum, day) => sum + day.totalTax, 0);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('OVERALL SUMMARY', 20, 55);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Days: ${summaryData.length}`, 20, 70);
    doc.text(`Total Orders: ${totalOrders}`, 20, 80);
    doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`, 20, 90);
    doc.text(`Total Subtotal: ₹${totalSubtotal.toFixed(2)}`, 20, 100);
    doc.text(`Total Tax: ₹${totalTax.toFixed(2)}`, 20, 110);
    doc.text(`Average Daily Income: ₹${summaryData.length > 0 ? (totalIncome / summaryData.length).toFixed(2) : '0.00'}`, 20, 120);
    
    // Daily Breakdown
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DAILY BREAKDOWN', 20, 140);
    
    let yPos = 155;
    
    // Table headers
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 20, yPos);
    doc.text('Day', 50, yPos);
    doc.text('Orders', 80, yPos);
    doc.text('Income', 110, yPos);
    doc.text('Dine-in', 140, yPos);
    doc.text('Takeaway', 165, yPos);
    doc.text('Delivery', 185, yPos);
    
    // Draw header line
    doc.line(20, yPos + 2, 200, yPos + 2);
    yPos += 10;
    
    // Table rows
    doc.setFont('helvetica', 'normal');
    summaryData.forEach((day, index) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
            
            // Repeat headers
            doc.setFont('helvetica', 'bold');
            doc.text('Date', 20, yPos);
            doc.text('Day', 50, yPos);
            doc.text('Orders', 80, yPos);
            doc.text('Income', 110, yPos);
            doc.text('Dine-in', 140, yPos);
            doc.text('Takeaway', 165, yPos);
            doc.text('Delivery', 185, yPos);
            doc.line(20, yPos + 2, 200, yPos + 2);
            yPos += 10;
            doc.setFont('helvetica', 'normal');
        }
        
        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const formattedDate = new Date(day.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        doc.text(formattedDate, 20, yPos);
        doc.text(dayName, 50, yPos);
        doc.text(day.totalOrders.toString(), 80, yPos);
        doc.text(`₹${day.totalIncome.toFixed(0)}`, 110, yPos);
        doc.text(day.orderTypes['dine-in'].toString(), 140, yPos);
        doc.text(day.orderTypes['takeaway'].toString(), 165, yPos);
        doc.text(day.orderTypes['delivery'].toString(), 185, yPos);
        
        yPos += 8;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `Generated on ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
            105,
            290,
            { align: 'center' }
        );
    }
    
    doc.save(`collection-summary-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export monthly/weekly collection summary
export const downloadCollectionSummary = (orders) => {
    const summaryData = generateCollectionSummary(orders);
    const csvContent = convertSummaryToCSV(summaryData);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `collection-summary-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Generate collection summary by date
const generateCollectionSummary = (orders) => {
    const completedOrders = orders.filter(order => order.status === 'completed');
    
    // Group by date
    const dateWiseCollection = completedOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        
        if (!acc[date]) {
            acc[date] = {
                date,
                totalOrders: 0,
                totalIncome: 0,
                totalSubtotal: 0,
                totalTax: 0,
                orderTypes: { 'dine-in': 0, 'takeaway': 0, 'delivery': 0 },
                paymentMethods: {}
            };
        }
        
        acc[date].totalOrders++;
        acc[date].totalIncome += order.total || 0;
        acc[date].totalSubtotal += order.subtotal || 0;
        acc[date].totalTax += order.tax || 0;
        acc[date].orderTypes[order.orderType] = (acc[date].orderTypes[order.orderType] || 0) + 1;
        acc[date].paymentMethods[order.paymentMethod] = (acc[date].paymentMethods[order.paymentMethod] || 0) + 1;
        
        return acc;
    }, {});
    
    // Convert to array and sort by date
    return Object.values(dateWiseCollection).sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Convert summary to CSV
const convertSummaryToCSV = (summaryData) => {
    let csv = '';
    
    // Header
    csv += `Collection Summary Report\n`;
    csv += `Generated on: ${new Date().toLocaleString()}\n`;
    csv += `Period: ${summaryData.length > 0 ? `${summaryData[summaryData.length - 1].date} to ${summaryData[0].date}` : 'No data'}\n`;
    csv += `\n`;
    
    // Summary totals
    const totalOrders = summaryData.reduce((sum, day) => sum + day.totalOrders, 0);
    const totalIncome = summaryData.reduce((sum, day) => sum + day.totalIncome, 0);
    const totalSubtotal = summaryData.reduce((sum, day) => sum + day.totalSubtotal, 0);
    const totalTax = summaryData.reduce((sum, day) => sum + day.totalTax, 0);
    
    csv += `OVERALL SUMMARY\n`;
    csv += `Total Days,${summaryData.length}\n`;
    csv += `Total Orders,${totalOrders}\n`;
    csv += `Total Income,₹${totalIncome.toFixed(2)}\n`;
    csv += `Total Subtotal,₹${totalSubtotal.toFixed(2)}\n`;
    csv += `Total Tax,₹${totalTax.toFixed(2)}\n`;
    csv += `Average Daily Income,₹${summaryData.length > 0 ? (totalIncome / summaryData.length).toFixed(2) : '0.00'}\n`;
    csv += `\n`;
    
    // Date-wise breakdown
    csv += `DAILY BREAKDOWN\n`;
    csv += `Date,Day,Orders,Income,Subtotal,Tax,Dine-in,Takeaway,Delivery\n`;
    
    summaryData.forEach(day => {
        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const formattedDate = new Date(day.date).toLocaleDateString('en-US');
        
        csv += `"${formattedDate}","${dayName}",${day.totalOrders},₹${day.totalIncome.toFixed(2)},₹${day.totalSubtotal.toFixed(2)},₹${day.totalTax.toFixed(2)},${day.orderTypes['dine-in']},${day.orderTypes['takeaway']},${day.orderTypes['delivery']}\n`;
    });
    
    return csv;
};

// Export individual functions if needed
export { generateReportData, convertToCSV, generateCollectionSummary, convertSummaryToCSV };