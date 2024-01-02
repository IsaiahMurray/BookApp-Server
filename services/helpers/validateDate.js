const validateDate = date => {
    isValidDate = Date.parse(date);
  
    return isNaN(isValidDate) ? false : true;
  };
  
  module.exports = validateDate;
  