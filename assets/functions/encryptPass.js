// Encrypt Password Function
// This function Encrypt password using jssha^2.3.1
// Import Jssha
const jssha = require('jssha');
//Set The Rounds
const saltRounds = 10;
function encryptPass(pass) {
  var shaObj = new jssha("SHA-512" /*Hash Type*/, "TEXT");
  shaObj.update(pass);
  var hash = shaObj.getHash("HEX");
  return hash;
}

export default encryptPass;