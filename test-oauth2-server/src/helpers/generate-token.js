const crypto = require('crypto');
const util = require('util');

const randomBytesAsync = util.promisify(crypto.randomBytes);
const generateToken = async (len = 32) => {
  const buf = await randomBytesAsync(len);
  return buf.toString('hex');
};

module.exports = generateToken;
