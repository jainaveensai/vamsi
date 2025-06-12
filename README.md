# 🏪 Plastic Shop Management System

A comprehensive Excel-like management system for plastic shops with inventory tracking, sales management, and analytics.

## ✨ Features

### 📦 **Inventory Management**
- Add, edit, and delete inventory items
- Multiple warehouse support (A, B, C, Main Storage)
- Low stock alerts and monitoring
- Supplier tracking
- Category-based organization

### 💰 **Sales Tracking**
- Record daily sales with automatic inventory updates
- Profit calculation and analysis
- Customer information tracking
- Sales history with detailed reports
- Prevent overselling with stock validation

### 📊 **Analytics & Reports**
- Real-time dashboard with key metrics
- Interactive charts and graphs
- Monthly sales trends
- Category performance analysis
- Warehouse distribution visualization

### 💾 **Data Management**
- JSON file-based storage
- Automatic backup and restore functionality
- Data export/import capabilities
- Persistent data storage

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone or download the project files**
   ```bash
   # Make sure you have all these files:
   # - server.js
   # - plastic-shop-manager.html
   # - package.json
   # - README.md
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 File Structure

```
plastic-shop-management/
├── server.js                    # Node.js server with API endpoints
├── plastic-shop-manager.html    # Main application interface
├── package.json                 # Node.js dependencies
├── shop-data.json              # Data storage (auto-created)
└── README.md                   # This file
```

## 🔧 API Endpoints

The system provides RESTful API endpoints:

- `GET /api/data` - Get all data (inventory + sales)
- `GET /api/inventory` - Get inventory items
- `GET /api/sales` - Get sales records
- `POST /api/inventory` - Add new inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item
- `POST /api/sales` - Record new sale
- `DELETE /api/sales/:id` - Delete sale (restores inventory)
- `GET /api/backup` - Download data backup
- `POST /api/restore` - Restore data from backup

## 💡 Usage Guide

### Adding Inventory Items
1. Go to the **Inventory** tab
2. Fill in all required fields:
   - Item Name
   - Category
   - Warehouse
   - Quantity
   - Cost Price
   - Selling Price
   - Supplier
   - Minimum Stock Alert Level
3. Click **Add Item**

### Recording Sales
1. Go to the **Sales** tab
2. Select an item from the dropdown
3. Enter quantity and customer details
4. The system will automatically:
   - Update inventory quantities
   - Calculate profit/loss
   - Prevent overselling

### Viewing Reports
1. Go to the **Dashboard** for quick overview
2. Go to the **Reports** tab for detailed analytics
3. View charts for:
   - Sales trends
   - Warehouse distribution
   - Category performance
   - Low stock alerts

### Data Backup & Restore
1. Go to the **Reports** tab
2. Click **Download Backup** to save your data
3. Use **Restore from Backup** to import data
4. Backups are in JSON format and include all inventory and sales data

## 🛠️ Technical Details

### Data Storage
- Uses JSON file (`shop-data.json`) for persistent storage
- Automatic file creation on first run
- Real-time data synchronization
- Backup and restore functionality

### Server Configuration
- Port: 3000 (configurable in server.js)
- CORS enabled for cross-origin requests
- Express.js framework
- RESTful API design

### Frontend Features
- Responsive design (works on mobile/tablet/desktop)
- Modern UI with animations
- Chart.js for interactive graphs
- Real-time search and filtering
- Excel-like table interface

## 🔒 Security Notes

- The system runs locally on your machine
- Data is stored in local JSON files
- No external database required
- All data remains on your system

## 🐛 Troubleshooting

### Server won't start
- Check if Node.js is installed: `node --version`
- Check if port 3000 is available
- Run `npm install` to ensure dependencies are installed

### Data not saving
- Check file permissions in the project directory
- Ensure the server is running
- Check browser console for error messages

### Charts not displaying
- Ensure internet connection (Chart.js loads from CDN)
- Check browser compatibility (modern browsers required)

## 📈 Future Enhancements

- Multi-user support with authentication
- Advanced reporting with date ranges
- Email notifications for low stock
- Barcode scanning integration
- Mobile app version
- Cloud storage options

## 🤝 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all files are in the correct location
3. Ensure Node.js and npm are properly installed
4. Check that the server is running on port 3000

## 📄 License

This project is licensed under the MIT License - see the package.json file for details.

---

**Happy Managing! 🎉** 