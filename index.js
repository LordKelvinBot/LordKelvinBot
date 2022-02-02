/*
You're gonna have a bad time.
v2
  - Added weather & time commands

v1.2
  - fixed issue where the bot would log the messages sent in the admin channel
  - fixed issue where the bot would not remove mentions in the console log when sending more than one mention
  - removed the "accesschangelog" and "denychangelog" commands and replaced them with a simple "changelog" command
  - added a response to whenever someone joins the server
  Changes to code (aka things that don't really matter)
  - added live version reading to changelog
  - got rid of all old commented out lines and gambling commands to a new file named old.js
  - added a new file named resources.js, meant to be used to redo all gambling commands in a more closed system. Will it work? No.


To Do List:
    json stuff finally works, but convert can take some time to work fully and idk if it really completly works yet
    finish the gambling Commands
    handle the case if you bet like a billion copper  but dont have that many

Some links to some stuff
    https://stackoverflow.com/questions/50667507/how-to-delete-specific-messages/51333614#51333614
        > How to bulkdelete certain messages



Consts/Libraries Installed:
    Discord API stuff (js)
    6 different libraries to fetch subreddit images:
        superagent
        fetch
        randomPuppy
        snoowrap
        {fetchSubreddit}
    urban dictionary (urban)
    the bot itself (bot)
    Login token that the bot uses to verify with discord or something (TOKEN)
*/

global.config = require('./config.json');
global.servers = {};

//requires
'use strict';
const { Discord , Intents , Client , MessageEmbed} = require("discord.js");
const superagent = require("superagent");
const fetch = require('node-fetch');
const randomPuppy = require('random-puppy');
const {fetchSubreddit} = require('fetch-subreddit');
const api = "https://jsonplaceholder.typicode.com/posts";
const pics = "https://www.reddit.com/r/pics.json";
const snoowrap = require('snoowrap');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS]});
const Jimp = require('jimp');
const snekfetch = require("snekfetch");
const fs = require('fs');
const urban = module.require("urban");
const ytdl = require('ytdl-core');
const dt = require('date-fns/toDate');
const wt = require('weather-js');
const moment = require("moment");
require("moment-duration-format");
//var ytpl = require('ytpl');

//other Consts
const TOKEN = config.token;
const PREFIX = config.prefix;
var answerlist = ["The twin towers", "The peasants of casterly rock", "Fallout 4", "The dragonborn", "Six and a half american dollars", "The Chosen One", "Link", "The Hero of time", "The Hero of Rhyme", "Edwin Vancleef", "Ezio", "Some fuckin edgy guy", "Chell", "Shell", "GlaD0s", "Deckard", "A Fast food worker", "Gordon Freeman", "Talion", "Stanley", "Iron Chancellor Otto von Bismarck", "Doom Guy", "Mario", "Luigi", "That guy", "Kirby", "The Kazoo Kid", "Kratos", "KratOS", "Scorpion", "Johnny Cage", "Sub-Zero", "The man himself", "Han Solo", "Harrison Ford", "Lord Revan", "A Marine", "Iron Man", "Tony Stark", "Robert Downey Jr.", "Captain America", "The Econonmy", "Black Widow", "A Spider", "Spider man", "Spider-man", "Spiderman", "Thor", "Chris Hemsworth", "Loki", "Legolas", "Bilbo Baggins", "Frodo", "Falcon", "Hawkeye", "Ant Man", "Paul Rudd", "Thanos", "Galactus", "The Silver Surfer", "Stan Lee", "Mr. Bean", "My neighbor steve", "A mysterious man you've never seen in your life", "Jake Paul", "Pewdiepie", "Bilbo Baggins", "A ninja that was hiding in a corner", "Kim Jung Un", "Kim Jung OOF", "Kim Jung-Possible", "Franklin Deleanor Roosevelt", "Donald Trump", "Bill Gates", "Steven Hawking", "The creator of the Note 5", "Heman", "Actual Cannibal Shia LeBouf", "Shia LeBouf", "Mia Khalifa", "National Geographic", "Percy Jackson", "a boosted monkey", "someone who is clearly cheating", "Barry B. Benson", "Jerry Seinfeild", "Bill Clinton", "Bane", "Danny DeVito"];
var yesnomabyeso = ["yep", "yeahhhhh", "nope", "fuck no", "maybe", "sure why not", "probably not", "yeah probably", "It doesn't matter", "i don't think so"];
var timeArray = ["tommorow", "yesterday", "in ten years", "65 million years ago", "when the sun goes out", "In the next seven seconds", "In 0.0000000000000000001 years", "now", "immediately ", "in just about a minute", "in about an hour", "In like a day", "In one week exactly", "In one week", "After several years of torment", "After you donate ten thousand dollarydoos to mars", "In 9 seconds"];
var timeTypes = ["hours", "seconds", "years", "milliseconds", "solar rotations", "months", "weeks", "days", "planetary rotations"];
var goodArray = [];
var dabArray = ["dab.PNG", "dabderful.jpg", "dabtastic.jpg", "clamdab.jpg", "dabeet.jpg", "halfdab.jpg", "headless-dab.jpg", "whoadab.jpg", "dapper.jpg", "dinosaur.jpg", "dabbrown.jpg", "selfdab.jpg"];
var sentenceArray = ["no", "stop", "dude", "literally", "like", "seriously", "fuck"];
var servers = {};
var slotMachine = [":tongue:", ":sweat_drops:", ":tophat:", ":fire:", ":eggplant:"];
var thing = 1;
var timeChancer = 45;
forceFetchUsers: true

var wsettings = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
};

function generateHex() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function russianActive(input) {
  gameData = "./rdata/" + input + '.json';
  fs.readFile(gameData, (err, data) => {
    if (err) {
      console.log("Game does not exist");
      return false;
    }
    else {
      console.log("Game exists, player joining");
      return true;
    }
  });
}

bot.on("message", async message => {
  console.log(message.content);

  var messageContent = message.content;
  var justInCase = 0;
  while (messageContent.indexOf("@") > -1)
  {
    message.content.replace("@", "@ ");
    justInCase++;
    if (justInCase > 15)
    {
      break;
    }
  }
  //if (!(message.author.equals(bot.user)) && !(message.content.startsWith(PREFIX)) && !(message.content.startsWith(".")) && !(message.author.username == "Hime") && !(message.channel.id = 383829771865292801)) message.guild.channels.find("name", "console-log").send(messageContent + "\n    *Sent by " + message.author.username + "*");
  //bot.user.setActivity('Serving ${bot.users.size} people');
  if (message.author.equals(bot.user)) return;
  if (!message.content.startsWith(PREFIX)) return;
  //(today.getMinutes() == 0 && (today.getHours() > 8 && today.getHours() < 21))
  //message.guild.channels.find("name", "general").send("Only " + hoursLeft + " hours and " + minutesLeft + " minutes left!");
  //Can't really do a countdown timer that says something every hour, because this code only runs every time someone sends a message. At least the command works
  var args = message.content.substring(PREFIX.length).split(" ");
  var argString = args.join(" ");
  // let colors = message.guild.roles.filter(role => role.name.startsWith("#"));

  function send(text) {
    message.channel.send(text);
  }
  function balanceCheck(id) {
    let author = './playerdata/' + id + '.json';
    fs.readFile(author, (err, data) => {
      if (err) {
        message.channel.send("You don't exist");
      }
    });
    let rawdata = fs.readFileSync(author);
    let person = JSON.parse(rawdata);
    message.channel.send("Balance: $" + person.money);
  }
  function TimeCheck(user) {
    let author = './playerdata/' + user + '.json';
    let deta = fs.readFileSync(author);
    let person = JSON.parse(deta);
    timeleft = ((parseInt(person.lastreset)+300000) - parseInt(Date.now()));
    if(timeleft <= 0) {
      valid = true;
    } else {
      valid = false;
    }
    return valid;
  }
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  function getIDFromMention(mention) {
  	const matches = mention.match(/^<@!?(\d+)>$/); // Uses RegEx to sort ID
  	if (!matches) return;
  	const id = matches[1];
  	return id;
  }
  function sendMoney(olduser, newuser, amount) {
    if (!newuser || !amount || isNaN(amount)) return message.channel.send("Please mention the user you want to send money to, then add the amount.");
    if (amount < 1) return message.channel.send("Input a valid number more than 0.")
    if (brokeCheck(messageAuthor, amount)) return message.channel.send("You don't have enough money to do that.");
    var newuserid = getIDFromMention(newuser);
    let author = './playerdata/' + olduser + '.json';
    let newuserpath = './playerdata/' + newuserid + '.json';
    fs.readFile(author, (err, data) => {
      if (err) {
        return message.channel.send("You don't exist");
      }
    });
    fs.readFile(newuserpath, (err, data) => {
      if (err) {
        return message.channel.send("The person you're trying to send to doesn't exist");
      }
    });
    let rawdata = fs.readFileSync(author);
    let person = JSON.parse(rawdata);
    person.money = parseInt(person.money) - parseInt(amount);
    fs.writeFileSync(author, JSON.stringify(person));
    let newdata = fs.readFileSync(newuserpath);
    let newperson = JSON.parse(newdata);
    newperson.money = parseInt(newperson.money) + parseInt(amount);
    fs.writeFileSync(newuserpath, JSON.stringify(newperson));
    return message.channel.send(amount + " has successfully been sent to " + "<@" + newuserid + ">");
  }
  function getSubredditImage() { //methods

    fetch('https://www.reddit.com/r/cats.json')
      .then(res => res.json())
      .then(res => res.data.children)
      .then(res => res.map(post => ({
        author: post.data.author,
        link: post.data.url,
        img: post.data.thumbnail,
        title: post.data.title
      })))
      .then(res => res.map(render))
      .then(res => console.log(res))

    const app = document.querySelector('#app');

    const render = post => {

      image1 = new MessageEmbed()
        .setTitle(post.title)
        .addField(post.img);
      message.channel.send(image1);
      message.channel.send(post.link);

    }

  }
  async function getRandomDogImages() {
    let {
      body
    } = await superagent
      .get('https://random.dog/woof.json');
    let dogEmbed = new MessageEmbed()
      .setColor("#ff9900")
      .setTitle("Dog")
      .setImage(body.url);
    message.channel.send(dogEmbed);
    return;
  }
  function isRegistered(m) {
    au = "./playerdata/" + m + ".json";
    fs.access(au,fs.F_OK, (err) => {
      if(err) {
        console.log("file not found, creating one")
        register(m)
        return false
      }
      console.log("file exists")
      return true
    })
  }
  function register(ab) {
    let a = ab + '.json';
    fs.stat('./playerdata/' + a, function(err) {
      if (!err) {
        console.log("file exists");
        return false;
      }
      else if (err.code === 'ENOENT') {
        console.error('file does not exist');
        let newdata = {
          money: 1000,
          lastreset: 0
        };
        let data = JSON.stringify(newdata);
        fs.writeFileSync('./playerdata/' + a, data);
        return true;
      }
    });
  }
  async function getXKCD(comic) { //promises method getXKCD variable(comic)

    if (comic < 0) {
      //let {gettingrandom} = await superagent.get("https://xkcd.com/0/info.0.json");
      comic = Math.floor(Math.random() * 2063 + 1);
    }
    let {
      body
    } = await superagent.get('https://xkcd.com/' + comic + '/info.0.json');
    message.channel.send(body.title + "\n#" + body.num + "\n" + body.img);
    message.channel.send("*" + body.alt + "*");
  }


  function pretty(obj) {
    return JSON.stringify(obj, null, 2);
  }

  function randomNumber(num) {
    return Math.floor(Math.random() * num);
  }

  function log(message) {
    //message.guild.channels.find("name", "console-log").send(message);
    //message.guild.channels.find("name", "super-secret-admin-channel").send("yeet");
    console.log(message);
    //bot.channels.get("497429650054709259").send(message);
  }

  function Play(connection, message) {
    const streamOptions = {
      seek: 0,
      volume: 1
    };

    var server = servers[message.guild.id];
    var voiceChannel = message.member.voiceChannel;
    voiceChannel.join().then(connection => {
      console.log("joined channel");
  //    new String() = String convertedToString;
  //    String convertedToString = Object.toString(server.queue[0]);
      const stream = ytdl(convertedToString, {
        filter: 'audioonly',
        quality: 'highestaudio'
      });
      const dispatcher = connection.playStream(stream, streamOptions);
      dispatcher.on("end", end => {
        console.log("left channel");
        voiceChannel.leave();
        server.queue.shift();
      });
    }).catch(err => console.error(err));
  }

  function piReplace() {
    //var args = message.content.substring(PREFIX.length).split(" "); or something
    for (var i = 0; i < args.length; i++) {
      var num = args[i];
      if (num.toLowerCase().indexOf('pi') > -1) {
        log("Reached Here at least");
        num.replace('pi', '');
        var number = parseFloat(num);
        log("Parsed Float");
        number = number * 3.14159265358979323626;
        args[i] = number;

      }
    }
    return args;
  }

  function plaympeg(song) {
    var VC = message.member.voiceChannel;
    if (!VC)
      return
    VC.join()
      .then(connection => {
        const dispatcher = connection.playFile('G:/mY sTUFF/Audio/' + song);
        dispatcher.on("end", end => {
          VC.leave()
        });
      })
      .catch(console.error);
  }

  function testSpam(messages) {
    if (messages.length > 10) {
      return true;
    }
  }

  function deleteLastMessage() {
    message.channel.messages
      .fetch({
        limit: 1
      })
      .then(messages => {
        message.delete({ timeout: 500 });
        // //Logging the number of messages deleted on both the channel and console.
      })
      .catch(err => {
        log("Error while doing Bulk Delete");
        log(err);
      })
  }
  function exchangeMoney(id, exchangeAmount, name) {
    //message.guild.members.cache.get('181284528793452545')
    bot.users.cache.get('181284528793452545').send(name + " wants to redeem " + exchangeAmount);
  }
  //will/is/are/am/was/does/should/do/can
  async function slots(amount, id) {
    var investment = amount;
    console.log("Investment = " + investment);
    await sleep(100);
    if (amount <= 1) return message.channel.send("Input a valid number more than 0.")
    if (brokeCheck(messageAuthor, investment)) return message.channel.send("You don't have enough money to do that.");
    var slot1 = slotMachine[Math.floor(Math.random() * slotMachine.length)];
    var slot2 = slotMachine[Math.floor(Math.random() * slotMachine.length)];
    var slot3 = slotMachine[Math.floor(Math.random() * slotMachine.length)];
    //message.channel.send("Slot 1: " + slot1 + ", Slot 2: " + slot2 + ", Slot 3: " + slot3);
    message.channel.send(slot1 + " " + slot2 + " " + slot3);
    let mAuthor = './playerdata/' + id + '.json';
    let raw = fs.readFileSync(mAuthor);
    let per = JSON.parse(raw);
    if (slot1 == slot2 && slot2 == slot3 && slot1 == slot3)
    {
      message.channel.send("You won $" + (parseInt(investment) * 50));
      let newdata = {
        money: parseInt(read(messageAuthor).money) + (parseInt(investment) * 50),
        lastreset: parseInt(per.lastreset)
      };
      let writedata = JSON.stringify(newdata);
      fs.writeFileSync(mAuthor, writedata);
    }
    else
    {
      message.channel.send("You lost $" + investment);
      let newdata = {
        money: parseInt(read(messageAuthor).money) - parseInt(investment),
        lastreset: parseInt(per.lastreset)
      };
      let writedata = JSON.stringify(newdata);
      fs.writeFileSync(mAuthor, writedata);
    }
  }
  async function coinflip(amount, id) {
    let path = "./playerdata/" + id + ".json";
    var investment = parseInt(amount);
    console.log("Investment = " + investment);
    await sleep(500);
    let raw = fs.readFileSync(path);
    let per = JSON.parse(raw);
    if (amount <= 1) return message.channel.send("Input a valid number more than 0.")
    if (brokeCheck(messageAuthor, investment)) return message.channel.send("You don't have enough money to do that.");
    if (Math.floor(Math.random() * 2) > 0)
    {
      message.channel.send("You won $" + investment);
      //(author, reputation, copper, silver, gold, platinum, sunset, discord, )
      let newdata = {
        money: parseInt(per.money) + parseInt(investment),
        lastreset: parseInt(per.lastreset)
      };
      let writedata = JSON.stringify(newdata);
      fs.writeFileSync(path, writedata);
    }
    else
    {
      message.channel.send("You lost $" + investment);
      let newdata = {
        money: parseInt(per.money) - parseInt(investment),
        lastreset: parseInt(per.lastreset)
      };
      let writedata = JSON.stringify(newdata);
      fs.writeFileSync(path, writedata);
    }
  }
  function sendM(name) {
    message.channel.send({
      files: ["./images/m/" + name + ".jpg"]
    });
  }

  function sendPNG(name) {
    message.channel.send({
      files: ["./images/m/" + name + ".png"]
    });
  }

  function exit(Msg) {
    Msg = Msg ? '*** ' + Msg : '';
    if (Msg) alert(Msg);
    throw new Error();
  } // exit

  //gambling functions
  let messageAuthor = message.author.id + '.json';
  let messageAuthorPath = './playerdata/' + message.author.id + '.json';
  function read (author)
  {
    var authorDirect = './playerdata/' + author;
    fs.readFile(authorDirect, (err, data) => {
      if (err) log("Does not exist");
    });
    let rawdata = fs.readFileSync(authorDirect);
    let person = JSON.parse(rawdata);
    return person;
  }
  function write (author, reputation, copper)
  {

    log("Pre-stuff Data: " + reputation + copper);
    fs.stat('./playerdata/' + author, function(err) {
      if (!err) {
        log("file exists");
        log ("File author: " + author);
        log("Inside .stat Data (File exists): " + reputation + copper);
        log('Updating existing player JSON file of ' + author + ' With the values copper:' + copper);
        if (copper == null) copper = read(author).copper;
        if (reputation == null) reputation = read(author).reputation;
        log("After if checks Data: " + reputation + copper);
        let newdata = {
          reputation: reputation,
          copper: copper
        };
        let data = JSON.stringify(newdata);
        fs.writeFileSync('./playerdata/' + author, data);
        log("Data written sucessfully");
      }
      else if (err.code === 'ENOENT') {
        log('file does not exist');
        log("Inside .stat Data (File does not exist): " + reputation + copper);
        log('Creating new player JSON file of ' + author + ' With the values copper:' + copper);
        let newdata = {
          reputation: reputation,
          copper: copper
        };
        let data = JSON.stringify(newdata);
        fs.writeFileSync('./playerdata/' + author, data);
        log("Data written sucessfully");
      }
    });

  }
  function repCheck (author)
  {
    let rep = read(author).reputation;
    if (rep >= 10000) return "Abraham Lincoln Himself   :sunglasses:";
    if (rep >= 5000) return "Keanu Reeves";
    if (rep >= 1000) return "Very Good";
    if (rep >= 500) return "Good";
    if (rep >= 50) return ":thumbsup:";
    if (rep >= 10) return "Neutral+";
    if (-9 >= rep >= 0) return "Neutral";
    if (rep <= -10000) return "The Antichrist Himself   :smiling_imp:";
    if (rep <= -5000) return "EA";
    if (rep <= -1000) return "Snake";
    if (rep <= -500) return "Shady";
    if (rep <= -50) return ":thinking:";
    if (rep <= -10) return "Neutral-";
  }
  function brokeCheck (author, bet)
  {
    if (read(author).money < bet) return true;
    return false;
  }
  function quickConvert(amount, type)
  {
    //types: 0 = copper, 1 = silver, etc.
    return amount*(Math.pow(100, type));

  }
  function validType (type)
  {
    switch (type.toLowerCase())
    {
      case "copper":
      case "c":
      case "cop":
      case "gold":
      case "g":
      case "silver":
      case "silv":
      case "s":
      case "platinum":
      case "platnum":
      case "plat":
      case "p":
        return true;
        break;
      default:
        return false;
    }
  }
  function checkMoneyType (type)
  {
    switch (type.toLowerCase())
    {
      case "copper":
      case "c":
      case "cop":
        return 0;
        break;
      case "gold":
      case "g":
        return 2;
        break;
      case "silver":
      case "silv":
      case "s":
        return 1;
        break;
      case "platinum":
      case "platnum":
      case "plat":
      case "p":
        return 3;
        break;
      default:
        return false;
    }
  }
  function convert (author)
  {

    log('CONVERTING');
    fs.stat('./playerdata/' + author, function(err) {
      if (!err) {
        log("file exists");
        let copper = read(author).copper;
        let silver = 0;
        let gold = 0;
        let platinum = 0;

        //Extreme Overflow
        while (copper >= 1000000)
        {
          copper -= 1000000;
          platinum += 1;
        }
        while (copper >= 10000)
        {
          copper -= 10000;
          gold += 1;
        }
        //Overflow
        while (copper >= 100)
        {
          copper -= 100;
          silver += 1;
          console.log("copper = " + copper + "\nsilver = " + silver);
        }
        while (silver >= 100)
        {
          silver -= 100;
          gold += 1;
          console.log("silver = " + silver + "\ngold = " + gold);
        }
        while (gold >= 100)
        {
          gold -= 100;
          platinum += 1;
          console.log("gold = " + gold + "\nplatinum = " + platinum);
        }
        log('Converted Currency values');
        var moneyEmbed = new MessageEmbed()
          .setColor(generateHex())
          .setTitle("Stat Board of " + message.author.id)
          .setDescription("A collection of your stats.")
          .setThumbnail(message.author.avatarURL)
          .addField("Reputation", read(author).reputation + "\nReputation Level: " + repCheck(messageAuthor))
          .addField("Money", "Copper: " + copper + "\nSilver: " + silver + "\nGold: " + gold + "\nPlatinum: " + platinum);
          message.channel.send(moneyEmbed);
      }
      else if (err.code === 'ENOENT') {
        log("Error: File does not exist."); //happens when a user hasn't create a json file in playerdata. Use another write() function?
        message.channel.send('You don\'t have an existing file, so one will be created.');
        write(messageAuthor, 0, 0);
        setTimeout(function(){
          convert(messageAuthor); //recursion, monkaS
        }, 2000);                 //timeout function, in place so the recursion doesn't happen too fast. If something breaks
      }                           //and the file can't be created, this will cause huge delays and stuff
    });
  }
  switch (args[0].toLowerCase()) {
    case "sierrahotelindiatango":
      let roleGod2 = message.guild.roles.find("name", "King");
      let roleGod3 = message.guild.roles.find("name", "Bot Dev");
      if (message.member.roles.cache.has(roleGod2.id)) {
        message.channel.send("Roger that,\nShutting Down...");
        deleteLastMessage();
        process.exit();
        exit();
        break;
      } else if (message.member.roles.cache.has(roleGod3.id)) {
        message.channel.send("Roger that,\nShutting Down...");
        deleteLastMessage();
        process.exit();
        exit();
        break;
      } else {
        message.channel.send("You don't have perms for that");
      }
      break;

    case "that":
      for (var i = sentenceArray.length - 1; i > 0; i--)
      {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = sentenceArray[i];
        sentenceArray[i] = sentenceArray[j];
        sentenceArray[j] = temp;
      }
      var messageToBeSent = "";
      for (var k = 0; k < sentenceArray.length; k++)
      {
        messageToBeSent += sentenceArray[k] + " ";
      }
      message.channel.send(messageToBeSent);
      break;
    case "time":
      var myDate = new Date(Date.now());
      message.channel.send("PST Time: " + myDate.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
      message.channel.send("MST Time: " + myDate.toLocaleString("en-US", {timeZone: "America/Denver"}));
      message.channel.send("CST Time: " + myDate.toLocaleString("en-US", {timeZone: "America/Chicago"}));
      message.channel.send("EST Time: " + myDate.toLocaleString("en-US", {timeZone: "America/New_York"}));
      break;
    case "weather":
      if(args[1]) {
        wt.find({search: args[1], degreeType: 'F'}, function(err, parsed) {
          if(err) console.log(err);
          console.log(JSON.stringify(parsed, null, 2));
          parsed = parsed[0];
          let wsend = new MessageEmbed()
            .setTitle(parsed.location.name)
            .setDescription(parsed.current.date)
            .addField("Current Temperature: ", parsed.current.temperature + " F", true)
            .addField("Sky: ", parsed.current.skytext, true)
            .addField("Humidity: ", parsed.current.humidity + "%")
            .addField("Wind: ", parsed.current.windspeed)
          message.channel.send(wsend);
        });
      } else {
        wt.find({search: 'San Gabriel, CA', degreeType: 'F'}, function(err, parsed) {
          if(err) console.log(err);
          console.log(JSON.stringify(parsed, null, 2));
          parsed = parsed[0];
          let wsend = new MessageEmbed()
            .setTitle(parsed.location.name)
            .setDescription(parsed.current.date)
            .addField("Current Temperature: ", parsed.current.temperature + " F", true)
            .addField("Sky: ", parsed.current.skytext, true)
            .addField("Humidity: ", parsed.current.humidity + "%")
            .addField("Wind: ", parsed.current.windspeed)
          message.channel.send(wsend);
        });
      }
      break;
    case "forecast":
      if(args[1]) {
        wt.find({search: args[1], degreeType: 'F'}, function(err, parsed) {
          if(err) console.log(err);
          console.log(JSON.stringify(parsed, null, 2));
          parsed = parsed[0];
          let wsend = new MessageEmbed()
            .setTitle(parsed.location.name + " 4 Day Forecast")
            .setDescription(parsed.current.date + " " + parsed.current.day)
            .addField(parsed.forecast[1].day, "Low: " + parsed.forecast[1].low + " High: " + parsed.forecast[1].high)
            .addField(parsed.forecast[2].day, "Low: " + parsed.forecast[2].low + " High: " + parsed.forecast[2].high)
            .addField(parsed.forecast[3].day, "Low: " + parsed.forecast[3].low + " High: " + parsed.forecast[3].high)
            .addField(parsed.forecast[4].day, "Low: " + parsed.forecast[4].low + " High: " + parsed.forecast[4].high)
          message.channel.send(wsend);
        });
      } else {
        wt.find({search: "San Gabriel, CA", degreeType: 'F'}, function(err, parsed) {
          if(err) console.log(err);
          console.log(JSON.stringify(parsed, null, 2));
          parsed = parsed[0];
          let wsend = new MessageEmbed()
            .setTitle(parsed.location.name + " 4 Day Forecast")
            .setDescription(parsed.current.date + " " + parsed.current.day)
            .addField(parsed.forecast[1].day, "Low: " + parsed.forecast[1].low + " High: " + parsed.forecast[1].high)
            .addField(parsed.forecast[2].day, "Low: " + parsed.forecast[2].low + " High: " + parsed.forecast[2].high)
            .addField(parsed.forecast[3].day, "Low: " + parsed.forecast[3].low + " High: " + parsed.forecast[3].high)
            .addField(parsed.forecast[4].day, "Low: " + parsed.forecast[4].low + " High: " + parsed.forecast[4].high)
          message.channel.send(wsend);
        });
      }
      break;
    case "uptime":
      let totalSeconds = (bot.uptime / 1000);
      let days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.floor(totalSeconds % 60);
      let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
      message.channel.send(uptime);
      break;
    case "ping":
      const m = await message.channel.send("Ping?");
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`);
      break;

    //gambling commands start here
    case "exchange":
      if (isNaN(args[1]) || !args[1]) return message.channel.send("Current Exchange Rate: 1000000:1")
      var amount = args[1];
      if (amount <= 1000000) return message.channel.send("Input a valid number more than 1000000.")
      if (brokeCheck(messageAuthor, amount)) return message.channel.send("You don't have enough money to do that.");
      exchangeMoney(message.author.id, amount, message.author.username)
      return message.channel.send(amount + " has been redeemed. DM " + '<@181284528793452545>');
      break;
    case "stats":
      convert(messageAuthor);
      break;
    case "reset":
      if(!args[1]) {
        let currenttime = Date.now()
        let resetperson = './playerdata/' + message.author.id + '.json';
        let timercheck = TimeCheck(message.author.id);
        console.log("Timer Check " + timercheck)
        console.log(Date.now());
        if(timercheck) {
          console.log("Balance has been reset for player " + message.author.id);
          let newdata = {
            money: 500,
            lastreset: currenttime
          };
          let data = JSON.stringify(newdata);
          fs.writeFileSync(resetperson, data);
          message.channel.send("Reset money for " + message.author.id);
        } else if (!timercheck){
          let rawdata = fs.readFileSync(resetperson);
          let resetdata = JSON.parse(rawdata);
          message.channel.send("Cooldown of " + ((((resetdata.lastreset + 300000)-Date.now())/1000)/60) + " minutes.");
        }
      }
      break;
    case "addbal":
      if(message.guild.members.cache.get('181284528793452545')) {
        let author = './playerdata/' + message.author.id + '.json';
        let rawdata = fs.readFileSync(author);
        let person = JSON.parse(rawdata);
        fs.readFile(author, (err, data) => {
          if (err) message.channel.send("You don't exist");
          let newbalance = parseInt(args[1]) + parseInt(person.money)
          if(args[1]) {
            let newdata = {
              money: newbalance
            };
            let data = JSON.stringify(newdata);
            fs.writeFileSync(author, data);
            console.log(args[1] + " added to " + author);
          }
          else {
            let newdata = {
              money: 1001
            };
            let data = JSON.stringify(newdata);
            fs.writeFileSync(author, data);
            console.log("Money reset to " + author);
          }
        })
      }
      else {
        message.channel.send("You don't have enough permissions.");
      }
      break;
    case "setbal":
      if(message.guild.members.cache.get('181284528793452545')) {
        let author = './playerdata/' + message.author.id + '.json';
        let rawdata = fs.readFileSync(author);
        let person = JSON.parse(rawdata);
        fs.readFile(author, (err, data) => {
          if (err) message.channel.send("You don't exist");
          let newbalance = parseInt(args[1])
          if(args[1]) {
            let newdata = {
              money: newbalance
            };
            let data = JSON.stringify(newdata);
            fs.writeFileSync(author, data);
            console.log(args[1] + " added to " + author);
          }
          else {
            let newdata = {
              money: 1001
            };
            let data = JSON.stringify(newdata);
            fs.writeFileSync(author, data);
            console.log("Money reset to " + author);
          }
        })
      }
      break;
    case "bal":
    case "balance":
      if (!isRegistered(message.author.id)) {
        await sleep(500);
        balanceCheck(message.author.id);
      } else {
        balanceCheck(message.author.id);
      }
      break;
    case "send":
      if(!isRegistered(message.author.id)) {
        await sleep(500);
        if (!args[1]) return message.channel.send("Please mention the user you want to send money to with the amount of money.");
        if (isNaN(args[2])) return message.channel.send("Please use a number to send money.");
        sendMoney(message.author.id, args[1], args[2]);
      } else {
        if (!args[1]) return message.channel.send("Please mention the user you want to send money to with the amount of money.");
        if (isNaN(args[2])) return message.channel.send("Please use a number to send money.");
        sendMoney(message.author.id, args[1], args[2]);
      }
      break;
    case "coinflip": //Javascript is treating investmetnts as strings, not numbers, so you end up with massive amounts of shit. fix with praseInt()
      if (isNaN(args[1]) || !args[1]) return message.channel.send('Input the amount of money you want to bet on the coinflip.');
      if (!isRegistered(message.author.id) && !args[1]) {
        await sleep(1500);
        coinflip(args[1],message.author.id);
      } else if (args[1]){
        coinflip(args[1],message.author.id);
      } else {
        message.channel.send("Make sure you add an amount!")
      }
      /*let moneyType = "copper";         //these four lines shouldn't work and don't do anything, but they work so...
      if (args[2]) moneyType = args[2];
      if (!validType(moneyType)) return message.channel.send("Not a valid type of currency");
      moneyType = checkMoneyType(moneyType);*/
      break;
    case "slots":
      if (!isRegistered(message.author.id) && !args[1]) {
        await sleep(1500);
        slots(args[1],message.author.id);
      } else if (args[1]){
        slots(args[1],message.author.id);
      }
      else {
        message.channel.send("Make sure you add an amount!  ")
      }
      //add more possibililites for victory, like if you get 3 animals or something
      break;
    case "areg":
    //test command for setting json file values. Use with 'hey areg '
      write(messageAuthor, args[2], args[1]);
      convert(messageAuthor);
      break;
    case "russian":
      if(args[1]) {
        if(russianActive(args[1])) {
          message.channel.send("Game found, joining game.");
        }
        else {
          message.channel.send("Game not found. Do russiancreate to initiate a game.")
        }
      }
      break;
    case "russiancreate":
      if(!args[1]) {
        message.channel.send("WIP. Type in a number after to make a lobby ID.")
      } else if (args[1]) {
        message.channel.send("Game created, you have been added to the game")

      }
      break;
    case "img":
      if (!args[1]) {
        var imgEmbed = new MessageEmbed()
          .setTitle("These are the current images in stock")
          .setColor(generateHex())
          .addField("the fastest spook in the west", "neutron")
          .addField("the slowest spook in the west", "whack")
          .addField("fbi", "wack")
          .addField("whale", "enemy")
          .addField("clippy", "roast")
          .addField("sans", "above")
          .addField("actually", "analysis")
          .addField("hmmm", "disappointment")
          .addField("stop", "hold up")
          .addField("stand", "bold")
          .addField("pp", "scientist")
          .addField("screaming", "surprised")
          .addField("sickened", "thanks satan")
          .addField("thot", "crusade")
          .addField("tom hmm", "yikes")
          .addField("pyrocynical", "pyro no glasses");
        message.channel.send(imgEmbed);
      } else {
        deleteLastMessage();
        args.splice(0, 1);
        var image = args.join(" ");
        switch (image) {
          case "the fastest spook in the west":
          case "fastest spook":
          case "the fastest spook":
            message.channel.send({
              files: ["./images/m/fastest_spook.jpg"]
            });

            break;
          case "the slowest spook in the west":
          case "slowest spook":
          case "the slowest spook":
            message.channel.send({
              files: ["./images/m/slowest_spook.jpg"]
            });
            break;
          case "fbi":
          case "fbi open up":
            message.channel.send({
              files: ["./images/m/fbi_open_up.png"]
            });
            break;
          case "sans":
          case "sans undertale":
          case "snas":
            sendPNG("snas");
            break;
          case "gamer roast":
          case "epic roast":
          case "bucket":
            sendM("a_sad_day");
            break;
          case "i consider myself above the avergae person":
          case "above average":
          case "above":
            sendM("above_the_average_person");
            break;
          case "actually":
          case "actually, quantum mechanics forbids this":
          case "quantum mechanics":
            sendM("actually_quantum");
            break;
          case "analysis":
          case "kowalksi":
            sendM("analysis");
            break;
          case "buzz":
          case "hmmm":
            sendM("buzz_hmm");
            break;
          case "clippy":
            sendM("clippy");
            break;
          case "my disappointment is immeasurable and my day is ruined":
          case "my disappointment is immeasurable":
          case "disappointment":
            sendM("disappointment_is_immeasurable");
            break;
          case "dude stop":
          case "stop":
            sendM("dude_stop");
            break;
          case "hold up":
            sendM("hold_up");
            break;
          case "how dare you stand where he stood":
          case "stand":
          case "stood":
            sendM("how_dare_you_stand");
            break;
          case "bold of you":
          case "bold":
          case "bold of you to assume i fear death":
            sendM("isabelle_bold");
            break;
          case "neutron style":
          case "neutron":
          case "looks like she couldnt handle the neutron style":
          case "looks like she couldn't handle the neutron style":
            sendM("neutron_style");
            break;
          case "pp":
          case "pp very soft":
            sendM("pp_very_soft");
            break;
          case "scientist":
          case "you know":
          case "you know, im a bit of a scientist myself":
            sendM("scientist");
            break;
          case "screaming":
          case "screaming begins again":
            sendPNG("screaming_begins_again");
            break;
          case "whale":
          case "contact":
          case "remove you from my contacts":
          case "whale roast":
            sendM("sick_whale_roast");
            break;
          case "sickened but curious":
          case "im sickened but curious":
          case "im sickened, but curious":
          case "sickened":
          case "curious":
            sendPNG("sickened_but_curious");
            break;
          case "surprised pikachu":
          case "surprised":
          case "pikachu":
            sendM("surprised_pikachu");
            break;
          case "thanks satan":
            sendM("thanks_satan");
            break;
          case "you are the enemy of the people":
          case "the enemy of the people":
          case "enemy of the people":
          case "peoples enemy":
          case "enemy":
            sendM("the_enemy_of_the_people");
            break;
          case "thot":
            sendM("thot");
            break;
          case "time for a crusade":
          case "crusade":
          case "crusader":
            sendM("time_for_a_crusade");
            break;
          case "tom hmm":
          case "quizzical tom":
          case "tom and jerry":
          case "cat hmm":
            sendM("tom_hmm");
            break;
          case "wack":
            sendM("wack");
            break;
          case "yikes":
            sendM("yikes");
            break;
          case "cash money":
          case "that wasn't very cash money of you":
          case "that wasnt very cash money of you":
            sendM("cash money");
            break;
          case "pyrocynical":
          case "pyro":
          case "luke with glasses":
            sendM("luke1");
            break;
          case "pyrocynical no glasses":
          case "pyro no glasses":
          case "luke no glasses":
            sendM("luke2");
            break;
          case "whack":
          case "meaty whack":
          case "meaty whack both chuckle":
            sendPNG("whack");
            break;
          default:
            message.channel.send("No image by that name");
            break;
        }
      }

      break;
    case "this":
      if (argString.indexOf('this is epic') > -1) {
        plaympeg("despacito.mp3");
      }
      break;
    case "will":
    case "is":
    case "are":
    case "am":
    case "was":
    case "does":
    case "should":
    case "do":
    case "may":
    case "can":
    case "8":
      message.channel.send(yesnomabyeso[Math.floor(Math.random() * yesnomabyeso.length)]);
      break;

    case "play":
      if (message.member.voiceChannel) {
        if (!message.guild.voiceConnection) {
          if (!servers[message.guild.id]) {
            servers[message.guild.id] = {
              queue: []
            }
          }

          message.member.voiceChannel.join()
            .then(connection => {
              var server = servers[message.guild.id];
              server.queue.push(args[1]);
              Play(connection, message);
              message.reply("Joined the channel!");
            })
        }
      } else {
        message.channel.send("You must be in a voice channel");
      }
      break;
    case "source":
      args.splice(0, 1);
      var str = args.join(" ");
      plaympeg(str + ".mp3");
      break;
    case "effect":
      args.splice(0, 1);
      var str = args.join(" ");
      plaympeg("/effects/" + str + ".mp3");
      break;
    case "leave":
      if (message.guild.voiceConnection) {
        message.guild.voiceConnection.disconnect();
        server.queue.shift();
      } else {
        message.channel.send("I'm not in a voice channel");
      }
      break;
    case "addtest":
      if (!args[1]) send("DOESNT WORK");
      if (args[2] != "+") {
        send("DOESNT WORK");
        break;
      }
      if (!args[3]) {
        send("DOESNT WORK");
        break;
      }
      if (args[1].isNaN || args[3].isNaN) {

        send("DOESNT WORK");
        break;
      }
      break;
    case "tierlist":
      if (!args[1]) {
        let tierlists = new MessageEmbed()
          .setTitle("The current tierlists")
          .setColor(generateHex())
          .addField("Smash Ultimate", "ultimate")
          .addField("Super Smash Bros. Melee", "melee")
          .addField("Super Smash Bros. Brawl", "brawl")
          .addField("Super Smash Bros. U", "u")
          .addField("Brawlhalla", "brawlhalla");
        message.channel.send(tierlists);
      } else {
        switch (args[1]) {

          case "ultimate":
            message.channel.send({
              files: ["./images/ultimatelist.png"]
            });
            break;
          case "brawlhalla":
            message.channel.send({
              files: ["./images/brawlhallalist.jpg"]
            });
            break;
          case "brawl":
            message.channel.send({
              files: ["./images/brawllist.jpg"]
            });
            break;
          case "melee":
            message.channel.send({
              files: ["./images/meleelist.jpg"]
            });
            break;
          case "u":
            message.channel.send({
              files: ["./images/ulist.jpg"]
            });
            break;
          default:
            message.channel.send("No tierlist by that name.");

        }
      }

      break;
    /*case "colors":
      if (colors.size < 1) return message.channel.send("No colors set up yet");
      log(colors.map(c => c.name));
      var embed999 = new MessageEmbed()
      .addField("Colors",colors.array().join(" | "))
      message.channel.send(embed999);
      break;
    case "setcolor":
      let roleDuke = message.guild.roles.find("name", "Duke");
      if (!(message.member.roles.cache.has(roleDuke.id))) {
        message.channel.send("You don't have enough perms for that.")
          .then(message => message.delete(5000));
        message.channel.fetch({
          limit: 2
        }).then(collected => { //collected is a Collection
          collected.forEach(message => {
            if (message.content.startsWith("hey")) message.delete(5000);
          });
        });
      }
      let rolecolor = colors.find(role => role.name.toLowerCase() === args[1]);
      if (!rolecolor) {
        return message.channel.send("There is no such color");
      }
      try {
        await message.member.removeRoles(colors);
        await message.member.addRole(rolecolor);
        message.channel.send("Your color is now changed");
      } catch (e) {
        message.channel.send(`Operation Failed! ${e.message}`);
      }
      break;
    */
    case "clap":
      args.splice(0, 1);
      message.channel.send(args.join(":clap:"));
      break;
    case "rate":
      args.splice(0, 1);
      var rated = args.join(" ");
      message.channel.send("I rate " + rated + " a good " + Math.floor(Math.random() * 101) + "/100");
      break;
    /*
    case "removecolor":
      try {
        await message.member.removeRoles(colors);
        message.channel.send("Removed your colors");
      } catch (e) {
        message.channel.send(`Operation Failed! ${e.message}`);
      }
      break;
    */
    case "vote":
      args.splice(0, 1);
      deleteLastMessage();
      let votingEmbed = new MessageEmbed()
        .setTitle(args.join(" "))
        .setColor(generateHex());
      //message.channel.send(votingEmbed);
      let msg = await message.channel.send(votingEmbed);
      await msg.react("469353036314312704"); //upvote
      await msg.react("504066665693315072"); //downvote
      const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === "469353036314312704" || reaction.emoji.name === "504066665693315072", {
        time: 1500
      });
      //https://www.youtube.com/watch?v=8o7I69O1RzE
      break;
    case "despair":
      var VC = message.member.voiceChannel;
      if (!VC)
        return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL")
      VC.join()
        .then(connection => {
          const dispatcher = connection.playFile('G:/mY sTUFF/Audio/Initial D - Deja Vu.mp3');
          dispatcher.on("end", end => {
            VC.leave()
          });
        })
        .catch(console.error);
      break;
    case "gay":
      message.channel.send({
        files: ["./images/reverse.png"]
      });
      break;
    case "urbanr":
      urban.random().first(json => {
        let urbanEm = new MessageEmbed()
          .setTitle(json.word)
          .setDescription(json.definition)
          .addField("Upvotes", json.thumbs_up, true)
          .addField("Downvotes", json.thumbs_down, true)
          .addField("Example", json.example);
        message.channel.send(urbanEm);
      });
      break;
    case "urban":
      args = args.join(" ");
      args = args.replace("urban", " ");
      urban(args).first(json => {
        if (!json) return message.channel.send("No definition found.");
        console.log(json);
        let urbanEm = new MessageEmbed()
          .setTitle(json.word)
          .setDescription(json.definition)
          .addField("Upvotes", json.thumbs_up, true)
          .addField("Downvotes", json.thumbs_down, true)
          .addField("Example", json.example);
        message.channel.send(urbanEm);
      });
      break;
      case "dev":
        var embed9 = new MessageEmbed()
        .setTitle("Developers")
        .setDescription("These are the Developers!")
        var embed10 = new MessageEmbed()
          .addField("Role","Original Bot Developer")
          .setAuthor('Eddie Vaughn', 'https://cdn.discordapp.com/attachments/684671474010947609/732567752518271016/DSC05763.png', 'https://eddiedoesntexistyet.com')
        var embed11 = new MessageEmbed()
          .addField("Role","Hoster & Developer")
          .setAuthor('Kyle Chau', 'https://i.imgur.com/9Qs4rex.jpg', 'https://byle.dev')
        var embed12 = new MessageEmbed()
          .addField("Role","Somewhat useful people")
          .setAuthor('Zi Hao Liang & Kenneth Kwan')
        message.channel.send(embed9);
        message.channel.send(embed10);
        message.channel.send(embed11);
        message.channel.send(embed12);
      break;
    case "help":
      if (!args[1]) {
        var embed1 = new MessageEmbed()

          .setColor(generateHex())
          .setDescription("These are the current commands", true)
          .addField("      The prefix is 'hey' but you already know that", "__________________________")
          .addField("will/is/are/am/was/does/should/do", "Basically an eight ball")
          .addField("who", "Who is this? Who is that?")
          .addField("when", "Time is an illusion", true)
          .addField("hello", "What you think it does", true)
          .addField("ping", "Gee, I wonder.", true)
          .addField("botprefixes", "Tells you some of the prefixes of bots")
          .addField("noticeme", "Notices you", true)
          .addField("d20", "Rolls a d20 (1-20)", true)
          .addField("vote", "Calls a vote", true)
          .addField("dev", "List of Devs", true)
          .addField("tierlist [game]", "Sends the tierlist of a game", true)
          .addField("tierlist", "Lists the current tierlists", true)
          .addField("random", "Returns a random number. Use with ' hey random num'")
          .addField("Subreddit Help", "help sub", true)
          .addField("Math Help", "help math", true)
          .addField("Fun Help", "help fun", true)
          .addField("Gambling Help", "help gamble", true)
          .addField("Test Help", "help test", true);

        message.channel.send(embed1);
      } else {
        switch (args[1]) {
          case "sub":
          case "subs":
          case "subhelp":
            var subhelp = new MessageEmbed()
              .setColor(generateHex())
              .setDescription("These are the commands for getting images for reddit.")
              .addField("sub", "Gets a random image from a specified subreddit.")
              .addField("pusharray", "Adds a subreddit to the array")
              .addField("showarray", "Shows the current array")
              .addField("cleararray", "Clears the array")
              .addField("shufflearray", "Uses the 'sub' command with a random entry into the array");
            message.channel.send(subhelp);
            break;
          case "mathhelp":
          case "math":
            var mathembed = new MessageEmbed()
              .setColor(generateHex())
              .setDescription("These are the commands for doing math. Put 'math' before each command. For example, 'hey math sqrt 4' would return 2. NaN means 'Not a Number'. Supports use of pi as 'pi', but if you're using just pi by itself you need to put '1pi'.")
              .addField("dtr", "Convert Degrees to Radians. Use with 'hey dtr num1 num2'")
              .addField("rtd", "Convert Radians to Degrees. Use with 'hey rtd num1 num2'. Supports use of pi")
              .addField("add/subtract/multiply/divide", "Performs basic math functions. Use with 'hey [command] num1 num2")
              .addField("sin/cos/tan/csc/sec/cot", "Trigonometric functions. Use with 'hey [command] num")
              .addField("sqrt", "Square Roots a number. Use with 'hey sqrt num1'")
              .addField("root", "nth root of a number. Use with 'hey root num n'")
              .addField("power", "The first number to the power of the second. Use with 'hey power base exponent'")
              .addField("log", "Logarithms. Use with 'hey log base thingbeinglogged'. Supports use of e");
            message.channel.send(mathembed);
            break;
          case "testhelp":
          case "test":
            var embed2 = new MessageEmbed()
              .setColor(generateHex())
              .setDescription("Test Commands")
              .setFooter("Buncha test stuff that doesn't do anything")
              .addField("embedtest", "Does an embed test.")
              .addField("printstufftest", "Prints Stuff.")
              .addField("accessconsole/denyconsole", "Gives/removes access to the bot console")
              .addField("test[1-11]", "11 different test commands that all do mysterious things")
              .addField("settimechance", "Sets the chance of the 'when' command returning a random time");
            message.channel.send(embed2);
            break;
          case "fun":
          case "funhelp":
            var embed3 = new MessageEmbed()
              .setTitle("Fun Commands")
              .setColor(generateHex())
              .addField("urban", "Gives an entry from urban dictionary", true)
              .addField("urbanr", "Gives a random entry from urban dictionary", true)
              .addField("xkcd", "Gets an xkcd comic", true)
              //.addField("colors", "Lists the current colors", true)
              //.addField("setcolor", "Changes your color (Requires at least Duke")
              //.addField("removecolor", "Removes your color and sets it back to default")
              .addField("source", "Plays an audio file from a folder. Has to be saved on my PC for now")
              .addField("effect", "Same as source, but from a folder full of random audio effects")
              .addField("randomhex", "Returns a random hex code", true)
              .addField("dog", "Sends a random picture of a dog", true)
              .addField("img", "Sends an image. Yay.");

            message.channel.send(embed3);
            break;
          case "gamble":
          case "gambling":
            var embed4 = new MessageEmbed()
              .setTitle("Gambling Commands.")
              .addField("balance", "Shows your current balance", true)
              .addField("exchange", "Kyle will send you $1 for every 1 million redeemed.")
              .addField("reset", "Reset your balance to $500. Can only be used every 5 minutes.",true)
              .addField("coinflip", "Flips a coin. Win 2x. Usage: coinflip (amount)", true)
              .addField("slots", "Slot machine. Win 50x. Usage: slots (amount)", true)
              .addField("roulette", "NOT WORKING. Basic roulette. Use with 'hey roulette [Number Guess] [color] [Betting cash]");
            message.channel.send(embed4);
            break;
          default:
            message.channel.send("No such help menu");
        }
      }

      break;
    case "dab":
      /*var rand = Math.floor(Math.random() * dabArray.length);
      log("*Dab Command Received*\nFile: " + dabArray[rand] + "\nRand: " + rand);
      message.channel.send({
        files: ["./images/" + dabArray[rand]]
      });*/
      message.channel.send("No shot");
      break;
    case "Hello":
      message.channel.send("I'm back");
      break;
    case "math":
      args = piReplace(args);
      switch (args[1].toLowerCase()) {
        case "add":
          var num1 = parseFloat(args[2]);
          var num2 = parseFloat(args[3]);
          message.channel.send(num1 + num2);
          break;
        case "subtract":
          var num1 = parseFloat(args[2]);
          var num2 = parseFloat(args[3]);
          message.channel.send(num1 - num2);
          break;
        case "multiply":
          var num1 = parseFloat(args[2]);
          var num2 = parseFloat(args[3]);
          message.channel.send(num1 * num2);
          break;
        case "divide":
          var num1 = parseFloat(args[2]);
          var num2 = parseFloat(args[3]);
          message.channel.send(num1 / num2);
          break;
        case "sin":
          message.channel.send(Math.sin(args[2]));
          break;
        case "cos":
          message.channel.send(Math.cos(args[2]));
          break;
        case "tan":
          message.channel.send(Math.tan(args[2]));
          break;
        case "sec":
          message.channel.send(1 / Math.cos(args[2]));
          break;
        case "csc":
          message.channel.send(1 / Math.sin(args[2]));
          break;
        case "cot":
          message.channel.send(1 / Math.tan(args[2]));
          break;
        case "root":
          message.channel.send(Math.pow(args[2], 1 / args[3]));
          break;
        case "dtr":
          var num = args[1];
          if (isNaN(num)) {
            return message.channel.send("Use a number dumbass");
          }
          num = num * (Math.PI / 180);
          message.channel.send(num);
          break;
        case "rtd":
          var num = args[1];
          if (isNaN(num)) return message.channel.send("Use a number dumbass, you sent " + args[2]);
          num = num * (180 / Math.PI);
          message.channel.send(num);
          break;
        case "sqrt":
          var num = args[1];
          if (isNaN(num)) return message.channel.send("Use a number dumbass");
          message.channel.send("X = " + Math.sqrt(num));
          break;
        case "power":
          var num = args[1];
          var num2 = args[2];
          if (isNaN(num) || isNaN(num2)) return message.channel.send("Use a number dumbass");
          message.channel.send("X = " + Math.pow(num, num2));
          break;
        case "log":
          var num = args[1];
          var num2 = args[2];
          if (num == 'e') {
            if (num2 == 'e') return message.channel.send("X = 1");
            else {
              return message.channel.send(Math.log(num2));
            }
          }
          if (isNaN(num) || isNaN(num2)) return message.channel.send("Use a number dumbass");
          var logged = Math.log(num2) / Math.log(num);
          message.channel.send("X = " + logged);
          break;
        case "test":
          var mathtestingembed = new MessageEmbed();
          for (var i = 0; i < args.length; i++) {
            mathtestingembed.addField(args[i]);
          }
          message.channel.send(mathtestingembed);
          break;
        default:
          message.channel.send("That's not a math command. Use 'hey mathhelp' if you're confused.");
          break;
      } //Math switch ends here
      break;
    case "random":
    case "d":
      var num = args[1];
      if (isNaN(num)) return message.channel.send("Use a number dumbass");
      message.channel.send(Math.floor(Math.random() * num) + 1);
      break;
    case "randorder":
      var num = args[1];
      if (isNaN(num)) return message.channel.send("Use a number dumbass");
      var array = [];
      var randInt = 0;
      for (var i = 0; i < num; i++) {
        array.push(i);
      }
      for (var j = num; j > 0; j--) {
        randInt = Math.random() * array.length;
        log("J = " + j + ", randInt = " + randInt);
        randInt = Math.floor(randInt);
        log("New randInt = " + randInt);
        message.channel.send(array[randInt]);
        array.splice(randInt);
      }
      break;
    case "d20":
      message.channel.send(Math.floor(Math.random() * args[1]) + 1);
      break;
    case "roll":
      if (!args[2]) message.channel.send(Math.floor(Math.random() * args[1]) + 1);
      else if (!args[2] && !args[1]){
         message.channel.send("Where the hell is the input bucko");
      }
      else
      {
        message.channel.send(Math.floor(Math.random() * args[1]) + 1 + parseInt(args[2]));
      }
      break;
    case "say":
      var sayMessage = args.join(" ");
      sayMessage = sayMessage.replace("say ", "");
      message.delete().catch(O_o => {});
      message.channel.send(sayMessage);
      break;
    case "xkcd":
      if (args[1]) {
        getXKCD(args[1]);
      } else {
        getXKCD(-1);
      }
      break;
    case "purge":
      let roleGod = message.guild.roles.fetch('295777645931790336');
      let roleGod1 = message.guild.roles.fetch('550117111045816320');
      //(message.guild.id == '272582751545196544' && message.member.roles.cache.has(roleGod.id)) ||
      if (message.author.id == '181284528793452545' || message.member.hasPermission("ADMINISTRATOR") || ((message.member.roles.cache.has(roleGod.id) || message.member.roles.cache.has(roleGod1.id)))) {
        let newamount = 2;
        if (args[1]) {
          newamount = args[1];
        }
        let messagecount = newamount.toString();
        message.channel.messages
          .fetch({
            limit: parseInt(messagecount)+1
          })
          .then(messages => {
            message.channel.bulkDelete(messages, true);
            // Logging the number of messages deleted on both the channel and console.
            message.channel
              .send(
                "Deletion of messages successful. \n Total messages deleted including command: " +
                newamount
              )
              .then(message => message.delete({ timeout: 5000 }));
            log(
              "Deletion of messages successful. \n Total messages deleted including command: " +
              newamount
            );
          })
          .catch(err => {
            log("Error while doing Bulk Delete");
            log(err);
          });
      } else {
        message.channel.send("You don't have perms for that");
      }
      break;
    case "pusharray":
      goodArray.push(args[1]);
      message.channel.send("The current array is: ");
      var list = new MessageEmbed()
        .setDescription("Current List of Subs:")
        .setColor(generateHex());
      for (var i = 0; i < goodArray.length; i++) {
        list.addField(goodArray[i], "/r/" + goodArray[i]);
      }
      message.channel.send(list);
      if (goodArray.length > 9) message.channel.send("It's gettin a little big there slugger");
      break;
    case "showarray":
      for (var i = 0; i < goodArray.length; i++) {
        message.channel.send(goodArray[i]);
      }
      break;
    case "accessconsole":
      let role11 = message.guild.roles.find("name", "console.log.perms");
      if (message.member.roles.cache.has(role11.id)) {
        message.channel.send(`You already have access`);
        return;
      }
      message.member.addRole(role11).catch(console.error);
      message.channel.send("You now have access to the console. If you don't want this anymore, use 'denyconsole'");
      break;
    case "denyconsole":
      let role22 = message.guild.roles.find("name", "console.log.perms");
      message.member.removeRole(role22).catch(console.error);
      message.channel.send("You no longer have access to the console.");
      break;
    case "hello":
      message.channel.send("I'm back in black");
      break;
    case "cleararray":
      goodArray = [];
      message.channel.send("List Cleared.");
      break;
    case "shufflearray":
      var link = goodArray[randomNumber(goodArray.length)];
      message.channel.send("From the subreddit /r/" + link);
      randomPuppy(link)
        .then(url => {
          message.channel.send(url);
        })
      break;
    case "sub":
      var sub = args[1];
      if (sub == 'watchpeopledie') return message.channel.send("You sick fuck.");

      randomPuppy(sub)
        .then(url => {
          message.channel.send(url);
        })
      break;

    case "test2":
      fetchSubreddit('worldnews')
        .then((urls) => message.channel.send((pretty(urls)))
          .catch((err) => console.error(err)));
      break;

    case "randomdog":
      randomPuppy()
        .then(url => {
          message.channel.send(url);
        })
      break;
    case "test4":
      randomPuppy('pics')
        .then(url => {
          message.channel.send(url);
        })
      break;
    case "test5":
      log("test");
      break;

    case "test7":
      if (!args[2]) return message.channel.send("No args[2] present");
      message.channel.send(args[2]);
      break;
    case "test8":
      message.channel.send(message.content);
      break;
    case "test9":
      plaympeg("Sands.mp3")
      break;
    case "test10":
      let test10 = new MessageEmbed()
        .addField("test one", "test two", true)
        .addField("test three", "test four", true);
      message.channel.send(test10);
      break;
    case "test11":
      var images = ['images/dab.png', 'images/clamdab.jpg', 'images/dabeet.jpg'];
      var jimps = [];
      for (vari = 0; i < images.length; i++) {
        jimps.push(jimp.read(images[i]));
      }
      Promise.all(jimps).then(function(data) {
        return Promise.all(jimps);
      }).then(function(data) {
        data[0].composite(data[1], 0, 0);
        data[0].composite(data[2], 0, 0);

        data[0].write('final-images/test.png', function() {
          log("wrote the image");
        });
      });
      break;
    case "test12":
      message.channel.send("A: " + message.author.toString());
      message.channel.send("B: " + message.author);
      break;
    case "test13":
      var stringthing = gamblers[0].name;
      for (var i = 1; i < gamblers.length; i++) {
        stringthing = stringthing + gamblers[i].name + ", ";
      }
      message.channel.send(stringthing);
      break;
    case "test14":
      var cities = new String("Paris   Moscow   Tokyo");
      var string2 = "Paris   Moscow   Tokyo";
      if (cities.compareTo(string2) == 0) {
        message.channel.send("Yup");
      } else {
        message.channel.send("Nope");
      }

      break;

    case "dog":
      getRandomDogImages();

      break;
    case "botprefixes":
      var embed = new MessageEmbed()
        .setColor(0x00FFFF)
        .setDescription("These are the current bot prefixes")
        .addField("Gnarbot", "_")
        .addField("Rythmbot", "//")
        .addField("Himebot/Alexa", ".")
        .addField("Dank Memer", "pls")
        .addField("Kawaiibot", "+")
        .addField("IdleRPG", "$")
        .addField("Jukebox", "$$")
        .addField("Pancake Bot", "p!")
        .addField("Fredboat", ";;")
        .addField("Groovy", "--")
        .addField("Wings", "w.");
      message.channel.send(embed);

      break;
      //will/is/are/am/was/does/should/do/can/may



    case "when":
      if (!args[1]) return message.channel.send("Time is an illusion");
      //var count = 1000;
      //var numberList = [];
      //for (var i = 0; i < 1000; i++) {
      //    for (var k = 0; k < Math.floor(count/))
      //}
      if (Math.floor(Math.random() * 100) <= 45) {
        return message.channel.send("In " + Math.floor(Math.random() * 100) + " " + timeTypes[Math.floor(Math.random() * timeTypes.length)]);
      } else {
        message.channel.send(timeArray[Math.floor(Math.random() * timeArray.length)]);
      }
      break;
    case "settimechance":
      timeChancer = args[1];
      break;


    case "are":
      if (args[1]) {
        message.channel.send(yesnomabyeso[Math.floor(Math.random() * yesnomabyeso.length)]);
      } else {
        message.channel.send("wait what");
      }
      break;

    case "who":
      if (args[1]) {
        message.channel.send(answerlist[Math.floor(Math.random() * answerlist.length)]);
      } else {
        message.channel.send("wait what");
      }
      break;

    case "secretadmintest":
      message.channel.send("This is a test command. I'm testing something. It doesn't do much.");
      //message.guild.channels.find("name", "super-secret-admin-channel").send("test sucessful my guy did i spell that right");
      break;
    case "embedtest":
      var embed = new MessageEmbed();
      embed.setDescription("Test embed my guy this is the description i think");
      embed.addField("What is a field what is life what", "HELP ME");
      embed.addField("What is a field what is life what", "HELP ME");
      embed.addField("What is a field what is life what", "HELP ME");
      embed.addField("What is a field what is life what", "HELP ME");
      message.channel.send(embed);
      break;
    case "noticeme":
      message.channel.send("Hey there, " + message.author.toString());
      break;
    case "report":
      //indexOf
      var original = args.join(" ");
      var untilFor = args.indexOf("for") + 1;
      var reported = args.splice(0, untilFor);
      reported.splice(reported.indexOf('foo'), 1);
      reported.splice(reported.indexOf("report"), 1);
      message.channel.send("You reported " + reported.join(" ") + ".");
      //message.guild.channels.find("name", "super-secret-admin-channel").send(message.author.toString() + " reported " + reported.join(" ") + " for " + args.join(" ") + "\n" + findSpacing(original) + "*Reported at " + time + ", on " + month + "/" + day + "/" + year + "*");
      break;

    case "escape":
      message.channel.send("I am escaping");
      return;
      message.channel.send("Didn't work");
      break;
    case "roulette":

      break;
    case "largeembed":
      var i = 1;
      var embed0 = new MessageEmbed();
      embed0.setDescription("Numbers My Guy");
      while (i <= args[1]) {
        if (i > 24) {
          return;
        }
        embed0.addField(i);
        i++;
      }
      message.channel.send(embed0);
      break;
    case "randomhex":
      message.channel.send('#' + Math.floor(Math.random() * 16777215).toString(16));
      break;
    case "version":
      var VERSION = config.version;
      message.channel.send(VERSION);
      break;
    case "changelog":
      var embedlog = new MessageEmbed();
      var CHANGELOG = config.changelog
      embedlog.setTitle("Change Log of Kelvin v2")
              .addField(config.version, CHANGELOG);
      message.channel.send(embedlog);
      break;
    case "skip":
      var server = servers[message.guild.id];
      if (server.dispatcher) server.dispatcher.end();
      server.queue.shift();
      break;
    case "stop":
      var server = servers[message.guild.id];
      if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
      break;

    default:
      message.channel.send("not a command :clown:");
  }


});

bot.login(TOKEN);
