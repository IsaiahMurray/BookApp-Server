function parseNumberString(inputString) {
    // Replace spaces with commas and split the string into an array
    const numberArray = inputString.replace(/\s/g, ',').split(',');
  
    // Convert each element to a number
    const resultArray = numberArray.map(Number);
  
    // Filter out NaN values (non-numeric entries)
    return resultArray.filter(number => !isNaN(number));
  };

  module.exports = parseNumberString;