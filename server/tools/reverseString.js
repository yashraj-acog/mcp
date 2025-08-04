module.exports = {
  name: 'reversestring',
  description: 'Reverses a given string',
  execute: (input) => {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string for reverseString tool.');
    }
    return input.split('').reverse().join('');
  }
};
