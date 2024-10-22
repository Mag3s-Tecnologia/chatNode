const PT = require("./PT.json");
const EN = require("./EN.json");
const ES = require("./ES.json");
const GLOBALS = require("./GLOBALS.json");

const blackListWords = [
  ...PT,
  ...EN,
  ...ES,
  ...GLOBALS,
  // ...SITE_NAMES,
];

function uniqueArrayItems(a) {
  return Array.from(new Set(a));
}

module.exports = {
  blackListWords,
  uniqueArrayItems,
};
