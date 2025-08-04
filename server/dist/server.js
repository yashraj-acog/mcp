"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// Create Express app
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware to parse JSON requests
app.use(body_parser_1.default.json());
// Available tools - each takes a number and returns a result
const tools = {
    increment: (number) => number + 1,
    double: (number) => number * 2,
    square: (number) => number * number
};
/**
 * POST endpoint to call mathematical tools
 * Expects JSON body: { tool: 'increment'|'double'|'square', number: number }
 * Returns: { result: number }
 */
app.post('/call-tool', (req, res) => {
    try {
        const { tool, number } = req.body;
        // Validate tool name
        if (!tool || !(tool in tools)) {
            return res.status(400).json({
                error: 'Invalid tool name',
                message: `Tool '${tool}' not found. Available tools: ${Object.keys(tools).join(', ')}`
            });
        }
        // Validate number input
        if (typeof number !== 'number' || isNaN(number)) {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Please provide a valid number'
            });
        }
        // Execute the tool and return result
        const result = tools[tool](number);
        const response = { result };
        res.json(response);
    }
    catch (error) {
        // Handle any unexpected errors
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});
/**
 * Health check endpoint for root
 */
app.get('/', (_req, res) => {
    res.json({
        message: 'MCP Server is running',
        availableTools: Object.keys(tools),
        endpoint: '/call-tool',
        usage: 'Send a POST request to /call-tool with { "tool": "toolName", "number": 123 }'
    });
});
/**
 * GET handler for /call-tool to provide helpful information
 */
app.get('/call-tool', (_req, res) => {
    res.status(200).json({
        error: 'Invalid request method',
        message: 'This endpoint only accepts POST requests',
        example: {
            method: 'POST',
            url: '/call-tool',
            body: {
                tool: 'increment|double|square',
                number: 123
            }
        }
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`🚀 MCP Server running on http://localhost:${PORT}`);
    console.log(`📋 Available tools: ${Object.keys(tools).join(', ')}`);
    console.log(`🔗 POST to /call-tool with { \"tool\": \"toolName\", \"number\": 123 }`);
});
exports.default = app;
