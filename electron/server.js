const express = require('express');
const path = require('path');
const { createServer } = require('http');
const next = require('next');

class NextServer {
  constructor() {
    this.app = null;
    this.server = null;
    this.nextApp = null;
    this.nextHandler = null;
  }

  async start() {
    try {
      // Ensure DATABASE_PATH is available
      if (!process.env.DATABASE_PATH) {
        console.error('❌ DATABASE_PATH environment variable is not set');
        throw new Error('DATABASE_PATH environment variable is required');
      }
      
      console.log('📁 Next.js server using database path:', process.env.DATABASE_PATH);
      
      // Initialize Next.js
      const dev = false;
      const dir = path.join(__dirname, '..');
      
      this.nextApp = next({ dev, dir });
      await this.nextApp.prepare();
      this.nextHandler = this.nextApp.getRequestHandler();

      // Create Express app
      this.app = express();
      
      // Add error handling middleware
      this.app.use((err, req, res, next) => {
        console.error('Express error:', err);
        res.status(500).json({ error: 'Internal server error' });
      });
      
      // Handle all requests with Next.js
      this.app.all('*', (req, res) => {
        return this.nextHandler(req, res);
      });

      // Create HTTP server
      this.server = createServer(this.app);
      
      // Start server on port 3000
      return new Promise((resolve, reject) => {
        this.server.listen(3000, 'localhost', (err) => {
          if (err) {
            console.error('Failed to start server:', err);
            reject(err);
          } else {
            console.log('✅ Next.js server started on http://localhost:3000');
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Failed to initialize Next.js server:', error);
      throw error;
    }
  }

  stop() {
    if (this.server) {
      this.server.close();
      console.log('✅ Next.js server stopped');
    }
  }
}

module.exports = NextServer; 