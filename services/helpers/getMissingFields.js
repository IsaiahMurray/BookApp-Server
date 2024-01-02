const getMissingFields = obj => {
    const missingObject = {};
    for (const key in obj) {
      if (!obj[key]) {
        missingObject[key] = obj[key];
      }
    }
  
    return missingObject;
  };
  
  module.exports = getMissingFields;
  