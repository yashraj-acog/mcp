const express = require('express');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

const fs = require('fs');
const path = require('path');

// Available tools - dynamically loaded
const tools = {};

// Load tools from the 'tools' directory
const toolsDir = path.join(__dirname, 'tools');
fs.readdirSync(toolsDir).forEach(file => {
  if (file.endsWith('.js')) {
    const toolModule = require(path.join(toolsDir, file));
    tools[toolModule.name] = toolModule.execute;
  }
});

// POST endpoint to call tools
app.post('/call-tool', (req, res) => {
  try {
    const { tool, number } = req.body;

    // Validate tool name
    if (!tool || !tools[tool]) {
      return res.status(400).json({
        error: 'Invalid tool name',
        message: `Tool '${tool}' not found. Available tools: ${Object.keys(tools).join(', ')}`
      });
    }

    // Validate input based on tool type
    if (tool === 'reversestring' || tool === 'subtract') {
      if (typeof number !== 'string') {
        return res.status(400).json({
          error: 'Invalid input',
          message: 'Please provide a valid string for reverseString tool.'
        });
      }
    } else if (typeof number !== 'number' || isNaN(number)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Please provide a valid number'
      });
    }

    // Execute the tool and return result
    const result = tools[tool](number);
    res.json({ result });

  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MCP Server is running',
    availableTools: Object.keys(tools),
    endpoint: '/call-tool'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 MCP Server running on http://localhost:${PORT}`);
  console.log(`📋 Available tools: ${Object.keys(tools).join(', ')}`);
  console.log(`🔗 POST to /call-tool with { "tool": "toolName", "number": 123 }`);
});

module.exports = app;
