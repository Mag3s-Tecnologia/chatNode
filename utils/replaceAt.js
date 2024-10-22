const replaceAt = function (str, startIndex, endIndex, replacement) {
  return str.substring(0, startIndex) + replacement + str.substring(endIndex, str.length);
};

module.exports = {
  replaceAt
}