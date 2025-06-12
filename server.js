const express = require('express');
  const fs = require('fs').promises;
  const path = require('path');
  const cors = require('cors');
  
  const app = express();
  const PORT = 3000;
  const DATA_FILE = path.join(__dirname, 'shop-data.json');
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.static(__dirname));
  
  // Initialize data file if it doesn't exist
  async function initializeDataFile() {
      try {
          await fs.access(DATA_FILE);
      } catch (error) {
          // File doesn't exist, create it with initial data
          const initialData = {
              inventory: [],
              sales: [],
              lastUpdated: new Date().toISOString()
          };
          await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
          console.log('Created initial data file: shop-data.json');
      }
  }
  
  // Read data from JSON file
  async function readData() {
      try {
          const data = await fs.readFile(DATA_FILE, 'utf8');
          return JSON.parse(data);
      } catch (error) {
          console.error('Error reading data:', error);
          return { inventory: [], sales: [], lastUpdated: new Date().toISOString() };
      }
  }
  
  // Write data to JSON file
  async function writeData(data) {
      try {
          data.lastUpdated = new Date().toISOString();
          await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
          return true;
      } catch (error) {
          console.error('Error writing data:', error);
          return false;
      }
  }
  
  // API Routes
  
  // Get all data
  app.get('/api/data', async (req, res) => {
      try {
          const data = await readData();
          res.json(data);
      } catch (error) {
          res.status(500).json({ error: 'Failed to read data' });
      }
  });
  
  // Get inventory only
  app.get('/api/inventory', async (req, res) => {
      try {
          const data = await readData();
          res.json(data.inventory);
      } catch (error) {
          res.status(500).json({ error: 'Failed to read inventory' });
      }
  });
  
  // Get sales only
  app.get('/api/sales', async (req, res) => {
      try {
          const data = await readData();
          res.json(data.sales);
      } catch (error) {
          res.status(500).json({ error: 'Failed to read sales' });
      }
  });
  
  // Add inventory item
  app.post('/api/inventory', async (req, res) => {
      try {
          const data = await readData();
          const newItem = {
              id: Date.now(),
              ...req.body,
              dateAdded: new Date().toISOString().split('T')[0]
          };
          
          data.inventory.push(newItem);
          const success = await writeData(data);
          
          if (success) {
              res.json({ success: true, item: newItem });
          } else {
              res.status(500).json({ error: 'Failed to save item' });
          }
      } catch (error) {
          res.status(500).json({ error: 'Failed to add inventory item' });
      }
  });
  
  // Update inventory item
  app.put('/api/inventory/:id', async (req, res) => {
      try {
          const data = await readData();
          const itemId = parseInt(req.params.id);
          const itemIndex = data.inventory.findIndex(item => item.id === itemId);
          
          if (itemIndex === -1) {
              return res.status(404).json({ error: 'Item not found' });
          }
          
          data.inventory[itemIndex] = { ...data.inventory[itemIndex], ...req.body };
          const success = await writeData(data);
          
          if (success) {
              res.json({ success: true, item: data.inventory[itemIndex] });
          } else {
              res.status(500).json({ error: 'Failed to update item' });
          }
      } catch (error) {
          res.status(500).json({ error: 'Failed to update inventory item' });
      }
  });
  
  // Delete inventory item
  app.delete('/api/inventory/:id', async (req, res) => {
      try {
          const data = await readData();
          const itemId = parseInt(req.params.id);
          const initialLength = data.inventory.length;
          
          data.inventory = data.inventory.filter(item => item.id !== itemId);
          
          if (data.inventory.length === initialLength) {
              return res.status(404).json({ error: 'Item not found' });
          }
          
          const success = await writeData(data);
          
          if (success) {
              res.json({ success: true, message: 'Item deleted successfully' });
          } else {
              res.status(500).json({ error: 'Failed to delete item' });
          }
      } catch (error) {
          res.status(500).json({ error: 'Failed to delete inventory item' });
      }
  });
  
  // Add sale
  app.post('/api/sales', async (req, res) => {
      try {
          const data = await readData();
          const saleData = req.body;
          
          // Find the inventory item
          const itemIndex = data.inventory.findIndex(item => item.id == saleData.itemId);
          if (itemIndex === -1) {
              return res.status(404).json({ error: 'Item not found in inventory' });
          }
          
          const item = data.inventory[itemIndex];
          
          // Check stock availability
          if (saleData.quantity > item.quantity) {
              return res.status(400).json({ error: 'Insufficient stock' });
          }
          
          // Create sale record
          const newSale = {
              id: Date.now(),
              itemId: item.id,
              itemName: item.name,
              quantity: saleData.quantity,
              salePrice: saleData.salePrice,
              totalAmount: saleData.quantity * saleData.salePrice,
              costPrice: item.costPrice,
              profit: (saleData.salePrice - item.costPrice) * saleData.quantity,
              customerName: saleData.customerName,
              saleDate: saleData.saleDate,
              warehouse: item.warehouse
          };
          
          // Update inventory quantity
          data.inventory[itemIndex].quantity -= saleData.quantity;
          
          // Add sale record
          data.sales.push(newSale);
          
          const success = await writeData(data);
          
          if (success) {
              res.json({ success: true, sale: newSale });
          } else {
              res.status(500).json({ error: 'Failed to save sale' });
          }
      } catch (error) {
          res.status(500).json({ error: 'Failed to record sale' });
      }
  });
  
  // Delete sale (and restore inventory)
  app.delete('/api/sales/:id', async (req, res) => {
      try {
          const data = await readData();
          const saleId = parseInt(req.params.id);
          const sale = data.sales.find(s => s.id === saleId);
          
          if (!sale) {
              return res.status(404).json({ error: 'Sale not found' });
          }
          
          // Restore inventory
          const itemIndex = data.inventory.findIndex(item => item.id == sale.itemId);
          if (itemIndex !== -1) {
              data.inventory[itemIndex].quantity += sale.quantity;
          }
          
          // Remove sale
          data.sales = data.sales.filter(s => s.id !== saleId);
          
          const success = await writeData(data);
          
          if (success) {
              res.json({ success: true, message: 'Sale deleted and inventory restored' });
          } else {
              res.status(500).json({ error: 'Failed to delete sale' });
          }
      } catch (error) {
          res.status(500).json({ error: 'Failed to delete sale' });
      }
  });
  
  // Backup data
  app.get('/api/backup', async (req, res) => {
      try {
          const data = await readData();
          const backupName = `backup-${new Date().toISOString().split('T')[0]}-${Date.now()}.json`;
          
          res.setHeader('Content-Disposition', `attachment; filename=${backupName}`);
          res.setHeader('Content-Type', 'application/json');
          res.json(data);
      } catch (error) {
          res.status(500).json({ error: 'Failed to create backup' });
      }
  });
  
  // Restore data from backup
  app.post('/api/restore', async (req, res) => {
      try {
          const backupData = req.body;
          
          // Validate backup data structure
          if (!backupData.inventory || !backupData.sales) {
              return res.status(400).json({ error: 'Invalid backup data format' });
          }
          
          const success = await writeData(backupData);
          
          if (success) {
              res.json({ success: true, message: 'Data restored successfully' });
          } else {
              res.status(500).json({ error: 'Failed to restore data' });
          }
      } catch (error) {
          res.status(500).json({ error: 'Failed to restore data' });
      }
  });
  
  // Serve the main HTML file
  app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'plastic-shop-manager.html'));
  });
  
  // Start server
  async function startServer() {
      await initializeDataFile();
      app.listen(PORT, () => {
          console.log(`🏪 Plastic Shop Management Server running on http://localhost:${PORT}`);
          console.log(`📁 Data file: ${DATA_FILE}`);
          console.log('🚀 Server ready to handle requests!');
      });
  }
  
  startServer().catch(console.error); 