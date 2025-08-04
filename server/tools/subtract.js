module.exports = {
  name: 'subtract',
  description: 'Subtracts two numbers (input format: "num1,num2")',
  execute: (input) => {
    const parts = input.split(',').map(Number);
    if (parts.length !== 2 || parts.some(isNaN)) {
      throw new Error('Invalid input for subtract tool. Please provide two numbers separated by a comma (e.g., "5,3").');
    }
    return parts[0] - parts[1];
  }
};
