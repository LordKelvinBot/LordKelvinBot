const path = require('path');

/**
 * Send an image file from the ./images/m/ directory based on name
 */
function sendImage(message, name) {
  const jpgPath = path.resolve(__dirname, '../images/m', `${name}.jpg`);
  const pngPath = path.resolve(__dirname, '../images/m', `${name}.png`);
  // Try jpg first, then png
  return message.channel.send({ files: [jpgPath, pngPath] });
}

module.exports = { sendImage };
