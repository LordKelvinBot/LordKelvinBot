/**
 * Image Sender Utility
 * @module utils/imageSender
 */

'use strict';

const fs = require('fs');
const path = require('path');

/** @type {string} Base directory for images */
const IMAGES_DIR = path.resolve(__dirname, '../images/m');

/**
 * Send an image file from the ./images/m/ directory based on name
 * Tries jpg first, then png
 * @param {import('discord.js').Message} message - The Discord message object
 * @param {string} name - The image name (without extension)
 * @returns {Promise<import('discord.js').Message>} The sent message
 */
async function sendImage(message, name) {
  if (!name || typeof name !== 'string') {
    return message.channel.send('Please provide a valid image name.');
  }

  const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '');
  const jpgPath = path.join(IMAGES_DIR, `${sanitizedName}.jpg`);
  const pngPath = path.join(IMAGES_DIR, `${sanitizedName}.png`);

  // Try jpg first
  if (fs.existsSync(jpgPath)) {
    return message.channel.send({ files: [jpgPath] });
  }

  // Then try png
  if (fs.existsSync(pngPath)) {
    return message.channel.send({ files: [pngPath] });
  }

  // Image not found
  return message.channel.send(`Image "${name}" not found.`);
}

/**
 * Send a JPG image
 * @param {import('discord.js').Message} message - The Discord message object
 * @param {string} name - The image name (without extension)
 * @returns {Promise<import('discord.js').Message>}
 */
async function sendJpg(message, name) {
  const imagePath = path.join(IMAGES_DIR, `${name}.jpg`);
  if (!fs.existsSync(imagePath)) {
    return message.channel.send(`Image "${name}.jpg" not found.`);
  }
  return message.channel.send({ files: [imagePath] });
}

/**
 * Send a PNG image
 * @param {import('discord.js').Message} message - The Discord message object
 * @param {string} name - The image name (without extension)
 * @returns {Promise<import('discord.js').Message>}
 */
async function sendPng(message, name) {
  const imagePath = path.join(IMAGES_DIR, `${name}.png`);
  if (!fs.existsSync(imagePath)) {
    return message.channel.send(`Image "${name}.png" not found.`);
  }
  return message.channel.send({ files: [imagePath] });
}

/**
 * Get all available image names
 * @returns {string[]} Array of image names (without extensions)
 */
function getAvailableImages() {
  if (!fs.existsSync(IMAGES_DIR)) {
    return [];
  }

  const files = fs.readdirSync(IMAGES_DIR);
  const imageNames = new Set();

  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      imageNames.add(file.replace(/\.(jpg|png)$/, ''));
    }
  }

  return Array.from(imageNames).sort();
}

module.exports = {
  sendImage,
  sendJpg,
  sendPng,
  getAvailableImages,
  IMAGES_DIR,
};
