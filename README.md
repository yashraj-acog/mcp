# MCP (Model Context Protocol) Project

A simple JavaScript project demonstrating a client-server architecture with mathematical tools.

## Project Structure

```
mcp/
├── server/
│   ├── server.js       # Express server with tool endpoints
│   ├── package.json    # Server dependencies
│   └── Dockerfile      # Docker configuration
├── client/
│   ├── mcp-client.js   # Interactive client application
│   └── package.json    # Client dependencies
└── README.md           # This file
```

## Available Tools

- **increment**: Adds 1 to the input number
- **double**: Multiplies the input number by 2
- **square**: Returns the square of the input number

## Quick Start

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Start the Server

```bash
cd server
npm start
```

The server will run on `http://localhost:3000`

### 3. Run the Client

In a new terminal:

```bash
cd client
npm start
```

Follow the interactive prompts to use the tools!

## Docker Usage

To run the server in Docker:

```bash
cd server
docker build -t mcp-server .
docker run -p 3000:3000 mcp-server
```

## API Usage

You can also call the server directly:

```bash
curl -X POST http://localhost:3000/call-tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "increment", "number": 5}'
```

Response: `{"result": 6}`
