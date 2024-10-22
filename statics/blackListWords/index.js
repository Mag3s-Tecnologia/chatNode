const PT = require("./PT.json");
const EN = require("./EN.json");
const ES = require("./ES.json");
const SITE_NAMES = require("./SITE_NAMES.json");


const blackListWords = [
  ...PT,
  ...EN,
  ...ES,
  // ...SITE_NAMES,
];

function uniqueArrayItems(a) {
  return Array.from(new Set(a));
}

module.exports = {
  blackListWords, uniqueArrayItems
};
