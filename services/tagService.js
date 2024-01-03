const tests = async () => {
  try {
    console.log("This is a test");
    return;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  tests,
};
