"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const readline_1 = __importDefault(require("readline"));
// Server configuration
const SERVER_URL = 'http://localhost:3000/call-tool';
const AVAILABLE_TOOLS = ['increment', 'double', 'square'];
// Create readline interface for user input
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Function to ask user for input with a promise
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}
// Function to make API call to the server
async function callTool(toolName, number) {
    try {
        const response = await axios_1.default.post(SERVER_URL, {
            tool: toolName,
            number: number
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        if (error.response) {
            return { success: false, error: error.response.data };
        }
        else {
            return {
                success: false,
                error: {
                    error: 'Connection error',
                    message: 'Could not connect to server. Make sure the server is running on port 3000.'
                }
            };
        }
    }
}
// Main application loop
async function main() {
    console.log('🔧 Welcome to MCP Client!');
    console.log(`📋 Available tools: ${AVAILABLE_TOOLS.join(', ')}`);
    console.log('💡 Type "exit" to quit\n');
    while (true) {
        try {
            // Ask user which tool to use
            const toolChoice = await askQuestion('Which tool would you like to use? (increment/double/square/exit): ');
            if (toolChoice.toLowerCase() === 'exit') {
                console.log('👋 Goodbye!');
                break;
            }
            if (!AVAILABLE_TOOLS.includes(toolChoice.toLowerCase())) {
                console.log(`❌ Invalid tool. Please choose from: ${AVAILABLE_TOOLS.join(', ')}\n`);
                continue;
            }
            const numberInput = await askQuestion('Enter a number: ');
            const number = parseFloat(numberInput);
            if (isNaN(number)) {
                console.log('❌ Please enter a valid number\n');
                continue;
            }
            console.log(`🔄 Calling ${toolChoice} with number ${number}...`);
            const result = await callTool(toolChoice.toLowerCase(), number);
            if (result.success) {
                console.log(`✅ Result: ${result.data.result}\n`);
            }
            else {
                console.log(`❌ Error: ${result.error.message}\n`);
            }
        }
        catch (error) {
            console.log(`❌ Unexpected error: ${error.message}\n`);
        }
    }
    rl.close();
}
main().catch((error) => {
    console.error('❌ Failed to start client:', error.message);
    rl.close();
    process.exit(1);
});
