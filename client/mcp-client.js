const axios = require('axios');
const readline = require('readline');

// Server configuration
const SERVER_URL = 'http://localhost:3000/call-tool';
const AVAILABLE_TOOLS = ['increment', 'double', 'square', 'reversestring', 'dividebytwo', 'subtract'];

// Create readline interface for user input
const rl = readline.createInterface({
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
    const response = await axios.post(SERVER_URL, {
      tool: toolName,
      number: number
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    // Handle server errors
    if (error.response) {
      return { success: false, error: error.response.data };
    } else {
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
      const toolChoice = await askQuestion('Which tool would you like to use? (increment/double/square/reverseString/dividebytwo/subtract/exit): ');
      
      // Check if user wants to exit
      if (toolChoice.toLowerCase() === 'exit') {
        console.log('👋 Goodbye!');
        break;
      }

      // Validate tool choice
      if (!AVAILABLE_TOOLS.includes(toolChoice.toLowerCase())) {
        console.log(`❌ Invalid tool. Please choose from: ${AVAILABLE_TOOLS.join(', ')}\n`);
        continue;
      }

      // Ask for input
      let inputPrompt = 'Enter a number: ';
      if (toolChoice.toLowerCase() === 'reversestring') {
        inputPrompt = 'Enter a string to reverse: ';
      } else if (toolChoice.toLowerCase() === 'subtract') {
        inputPrompt = 'Enter two numbers separated by a comma (e.g., 5,3): ';
      }
      const input = await askQuestion(inputPrompt);

      let processedInput;
      const lowerCaseToolChoice = toolChoice.toLowerCase();

      if (lowerCaseToolChoice === 'reversestring' || lowerCaseToolChoice === 'subtract') {
        processedInput = input;
      } else {
        processedInput = parseFloat(input);
        if (isNaN(processedInput)) {
          console.log('❌ Please enter a valid number\n');
          continue;
        }
      }

      // Make API call to server
      console.log(`🔄 Calling ${toolChoice} with input ${processedInput}...`);
      const result = await callTool(toolChoice.toLowerCase(), processedInput);

      // Display result or error
      if (result.success) {
        console.log(`✅ Result: ${result.data.result}\n`);
      } else {
        console.log(`❌ Error: ${result.error.message}\n`);
      }

    } catch (error) {
      console.log(`❌ Unexpected error: ${error.message}\n`);
    }
  }

  // Close readline interface
  rl.close();
}

// Start the client application
main().catch((error) => {
  console.error('❌ Failed to start client:', error.message);
  rl.close();
  process.exit(1);
});
