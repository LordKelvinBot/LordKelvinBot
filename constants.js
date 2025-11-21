/**
 * Bot Constants and Static Data
 * @module constants
 */

'use strict';

/**
 * Random response answers for "who" questions
 * @type {readonly string[]}
 */
const answerlist = Object.freeze([
  'The twin towers',
  'The peasants of casterly rock',
  'Fallout 4',
  'The dragonborn',
  'Six and a half american dollars',
  'The Chosen One',
  'Link',
  'The Hero of time',
  'The Hero of Rhyme',
  'Edwin Vancleef',
  'Ezio',
  'Some fuckin edgy guy',
  'Chell',
  'Shell',
  'GlaD0s',
  'Deckard',
  'A Fast food worker',
  'Gordon Freeman',
  'Talion',
  'Stanley',
  'Iron Chancellor Otto von Bismarck',
  'Doom Guy',
  'Mario',
  'Luigi',
  'That guy',
  'Kirby',
  'The Kazoo Kid',
  'Kratos',
  'KratOS',
  'Scorpion',
  'Johnny Cage',
  'Sub-Zero',
  'The man himself',
  'Han Solo',
  'Harrison Ford',
  'Lord Revan',
  'A Marine',
  'Iron Man',
  'Tony Stark',
  'Robert Downey Jr.',
  'Captain America',
  'The Econonmy',
  'Black Widow',
  'A Spider',
  'Spider man',
  'Spider-man',
  'Spiderman',
  'Thor',
  'Chris Hemsworth',
  'Loki',
  'Legolas',
  'Bilbo Baggins',
  'Frodo',
  'Falcon',
  'Hawkeye',
  'Ant Man',
  'Paul Rudd',
  'Thanos',
  'Galactus',
  'The Silver Surfer',
  'Stan Lee',
  'Mr. Bean',
  'My neighbor steve',
  "A mysterious man you've never seen in your life",
  'Jake Paul',
  'Pewdiepie',
  'Bilbo Baggins',
  'A ninja that was hiding in a corner',
  'Kim Jung Un',
  'Kim Jung OOF',
  'Kim Jung-Possible',
  'Franklin Deleanor Roosevelt',
  'Donald Trump',
  'Bill Gates',
  'Steven Hawking',
  'The creator of the Note 5',
  'Heman',
  'Actual Cannibal Shia LeBouf',
  'Shia LeBouf',
  'Mia Khalifa',
  'National Geographic',
  'Percy Jackson',
  'a boosted monkey',
  'someone who is clearly cheating',
  'Barry B. Benson',
  'Jerry Seinfeild',
  'Bill Clinton',
  'Bane',
  'Danny DeVito',
]);

/**
 * Yes/No/Maybe responses for 8-ball style questions
 * @type {readonly string[]}
 */
const yesnomabyeso = Object.freeze([
  'yep',
  'yeahhhhh',
  'nope',
  'fuck no',
  'maybe',
  'sure why not',
  'probably not',
  'yeah probably',
  "It doesn't matter",
  "i don't think so",
]);

/**
 * Time-related responses
 * @type {readonly string[]}
 */
const timeArray = Object.freeze([
  'tommorow',
  'yesterday',
  'in ten years',
  '65 million years ago',
  'when the sun goes out',
  'In the next seven seconds',
  'In 0.0000000000000000001 years',
  'now',
  'immediately ',
  'in just about a minute',
  'in about an hour',
  'In like a day',
  'In one week exactly',
  'In one week',
  'After several years of torment',
  'After you donate ten thousand dollarydoos to mars',
  'In 9 seconds',
]);

/**
 * Time unit types
 * @type {readonly string[]}
 */
const timeTypes = Object.freeze([
  'hours',
  'seconds',
  'years',
  'milliseconds',
  'solar rotations',
  'months',
  'weeks',
  'days',
  'planetary rotations',
]);

/**
 * User-added subreddits array (mutable)
 * @type {string[]}
 */
const goodArray = [];

/**
 * Dab image filenames
 * @type {readonly string[]}
 */
const dabArray = Object.freeze([
  'dab.PNG',
  'dabderful.jpg',
  'dabtastic.jpg',
  'clamdab.jpg',
  'dabeet.jpg',
  'halfdab.jpg',
  'headless-dab.jpg',
  'whoadab.jpg',
  'dapper.jpg',
  'dinosaur.jpg',
  'dabbrown.jpg',
  'selfdab.jpg',
]);

/**
 * Random sentence words
 * @type {readonly string[]}
 */
const sentenceArray = Object.freeze([
  'no',
  'stop',
  'dude',
  'literally',
  'like',
  'seriously',
  'fuck',
]);

/**
 * Server state for voice queues (guild.id -> server data)
 * @type {Object.<string, {queue: string[]}>}
 */
const servers = {};

/**
 * Slot machine emoji symbols
 * @type {readonly string[]}
 */
const slotMachine = Object.freeze([
  ':tongue:',
  ':sweat_drops:',
  ':tophat:',
  ':fire:',
  ':eggplant:',
]);

/**
 * Default time settings
 * @type {Readonly<{hour: string, minute: string, hour12: boolean}>}
 */
const wsettings = Object.freeze({
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});

/**
 * Default time chance percentage
 * @type {number}
 */
const DEFAULT_TIME_CHANCE = 45;

module.exports = {
  answerlist,
  yesnomabyeso,
  timeArray,
  timeTypes,
  goodArray,
  dabArray,
  sentenceArray,
  servers,
  slotMachine,
  wsettings,
  DEFAULT_TIME_CHANCE,
};
