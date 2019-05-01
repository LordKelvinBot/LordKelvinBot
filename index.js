/*
You're gonna have a bad time.

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
    Discord API stuff (discord.js)
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
const Discord = require("discord.js");
const superagent = require("superagent");
const fetch = require('node-fetch');
const randomPuppy = require('random-puppy');
const {fetchSubreddit} = require('fetch-subreddit');
const api = "https://jsonplaceholder.typicode.com/posts";
const pics = "https://www.reddit.com/r/pics.json";
const snoowrap = require('snoowrap');
const bot = new Discord.Client();
const Jimp = require('jimp');
const snekfetch = require("snekfetch");
const fs = require('fs');
const urban = module.require("urban");
const ytdl = require('ytdl-core');
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
var thing = 1;
var timeChancer = 45;
forceFetchUsers: true

function generateHex() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
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
  let colors = message.guild.roles.filter(role => role.name.startsWith("#"));

  function send(text) {
    message.channel.send(text);
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

      image1 = new Discord.RichEmbed()
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
    let dogEmbed = new Discord.RichEmbed()
      .setColor("#ff9900")
      .setTitle("Dog")
      .setImage(body.url);
    message.channel.send(dogEmbed);
    return;
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
    }).catch(err => console.log(err));
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
    message.channel
      .fetchMessages({
        limit: 1
      })
      .then(messages => {
        message.delete(500);
        // //Logging the number of messages deleted on both the channel and console.
      })
      .catch(err => {
        log("Error while doing Bulk Delete");
        log(err);
      })
  }
  //will/is/are/am/was/does/should/do/can

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
  let messageAuthor = message.author.username.toString() + '.json';
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
        log("Inside .stat Data (File does not exist): " + reputation + copper + silver + gold + platinum);
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
    if (read(author).copper < bet) return true;
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
        var moneyEmbed = new Discord.RichEmbed()
          .setColor(generateHex())
          .setTitle("Stat Board of " + message.author.username.toString())
          .setDescription("A collection of your stats.")
          .setThumbnail(message.author.avatarURL)
          .addField("Reputation", read(author).reputation + "\nReputation Level: " + repCheck(messageAuthor))
          .addField("Money", "Copper: " + copper + "\nSilver: " + silver + "\nGold: " + gold + "\nPlatinum: " + platinum);
          message.channel.send(moneyEmbed);
      }
      else if (err.code === 'ENOENT') {
        log("Error: File does not exist. The doom of worlds is upon us.");
        message.channel.send('ERROR: Check console log');
      }
    });
  }
  switch (args[0].toLowerCase()) {
    case "sierrahotelindiatango":
      let roleGod2 = message.guild.roles.find("name", "King");
      let roleGod3 = message.guild.roles.find("name", "Bot Dev");
      if (message.member.roles.has(roleGod2.id)) {
        message.channel.send("Roger that,\nShutting Down...");
        deleteLastMessage();
        process.exit();
        exit();
        break;
      } else if (message.member.roles.has(roleGod3.id)) {
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
      message.channel.send("The time is ")
      break;
    case "ping":
      const m = await message.channel.send("Ping?");
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
      break;

    //gambling commands start here
    case "stats":
      convert(messageAuthor);
      break;
    case "balance1":   //THEORETICALLY DEPRECATED
      let author1 = './playerdata/' + message.author.username.toString() + '.json';
      fs.readFile(author1, (err, data) => {
        if (err) message.channel.send("You don't exist");
      });
      let rawdata = fs.readFileSync(author1);
      let person = JSON.parse(rawdata);
      message.channel.send("Balance: " + person.reputation);
      break;
    case "register111": //THEORETICALLY DEPRECATED
      let author2 = message.author.username.toString() + '.json';
      fs.stat('./playerdata/' + author2, function(err) {
        if (!err) {
          console.log("file exists");
          message.channel.send("You are already registered.");
        }
        else if (err.code === 'ENOENT') {
          console.log('file does not exist');
          let newdata = {
            money: '$' + 1000
          };
          let data = JSON.stringify(newdata);
          fs.writeFileSync('./playerdata/' + author2, data);
          message.channel.send("You have been registered.");
        }
      });
      break;
    case "coinflip": //Javascript is treating investmetnts as strings, not numbers, so you end up with massive amounts of shit. fix with praseInt()
      if (isNaN(args[1]) || !args[1]) return message.channel.send('Input the amount of copper you want to bet on the coinflip.');
      let moneyType = "copper";
      if (args[2]) moneyType = args[2];
      if (!validType(moneyType)) return message.channel.send("Not a valid type of currency");
      moneyType = checkMoneyType(moneyType);
      var investment = quickConvert(parseInt(args[1]), moneyType);
      console.log("Investment = " + investment + "\nmoneyType = " + moneyType);
      if (brokeCheck(messageAuthor, investment)) return message.channel.send("You don't have enough money to do that.");
      if (Math.floor(Math.random() * 2) > 0)
      {
        message.channel.send("You Won " + investment);
        //(author, reputation, copper, silver, gold, platinum, sunset, discord, )
        write(messageAuthor, null, read(messageAuthor).copper + parseInt(investment));
      }
      else
      {
        message.channel.send("You Lost " + investment);
        write(messageAuthor, null, read(messageAuthor).copper - parseInt(investment));
      }
      break;
    case "areg":
    //author, reputation, copper, silver, gold, platinum, sunset, discord,
      write(messageAuthor, args[2], args[1]);
      convert(messageAuthor);
      break;

    case "img":
      if (!args[1]) {
        var imgEmbed = new Discord.RichEmbed()
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
        let tierlists = new Discord.RichEmbed()
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
    case "colors":
      if (colors.size < 1) return message.channel.send("No colors set up yet");
      log(colors.map(c => c.name));
      message.channel.send(colors.array().join(" | "));
      break;
    case "setcolor":
      let roleDuke = message.guild.roles.find("name", "Duke");
      if (!(message.member.roles.has(roleDuke.id))) {
        message.channel.send("You don't have enough perms for that.")
          .then(message => message.delete(5000));
        message.channel.fetchMessages({
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
    case "clap":
      args.splice(0, 1);
      message.channel.send(args.join(":clap:"));
      break;
    case "rate":
      args.splice(0, 1);
      var rated = args.join(" ");
      message.channel.send("I rate " + rated + " a good " + Math.floor(Math.random() * 101) + "/100");
      break;
    case "removecolor":
      try {
        await message.member.removeRoles(colors);
        message.channel.send("Removed your colors");
      } catch (e) {
        message.channel.send(`Operation Failed! ${e.message}`);
      }
      break;
    case "vote":
      args.splice(0, 1);
      deleteLastMessage();
      let votingEmbed = new Discord.RichEmbed()
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
        let urbanEm = new Discord.RichEmbed()
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
        let urbanEm = new Discord.RichEmbed()
          .setTitle(json.word)
          .setDescription(json.definition)
          .addField("Upvotes", json.thumbs_up, true)
          .addField("Downvotes", json.thumbs_down, true)
          .addField("Example", json.example);
        message.channel.send(urbanEm);
      });
      break;
    case "help":
      if (!args[1]) {
        var embed1 = new Discord.RichEmbed()

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
            var subhelp = new Discord.RichEmbed()
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
            var mathembed = new Discord.RichEmbed()
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
            var embed2 = new Discord.RichEmbed()
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
            var embed3 = new Discord.RichEmbed()
              .setTitle("Fun Commands")
              .setColor(generateHex())
              .addField("dab", "Dabs on the haters", true)
              .addField("urban", "Gives an entry from urban dictionary", true)
              .addField("urbanr", "Gives a random entry from urban dictionary", true)
              .addField("xkcd", "Gets an xkcd comic", true)
              .addField("colors", "Lists the current colors", true)
              .addField("setcolor", "Changes your color (Requires at least Duke")
              .addField("removecolor", "Removes your color and sets it back to default")
              .addField("source", "Plays an audio file from a folder. Has to be saved on my PC for now")
              .addField("effect", "Same as source, but from a folder full of random audio effects")
              .addField("randomhex", "Returns a random hex code", true)
              .addField("dog", "Sends a random picture of a dog", true)
              .addField("img", "Sends an image. Yay.");

            message.channel.send(embed3);
            break;
          case "gamble":
          case "gambling":
            var embed4 = new Discord.RichEmbed()
              .setTitle("Gambling Commands. None of these really work that well, and if more than one person uses it, it will 100% break.")
              .addField("register", "Registers you as a player", true)
              .addField("balance", "Shows your current balance", true)
              .addField("coinflip", "Flips a coin. Win/Lose $500", true)
              .addField("roulette", "Basic roulette. Use with 'hey roulette [Number Guess] [color] [Betting cash]");
            message.channel.send(embed4);
            break;
          default:
            message.channel.send("No such help menu");
        }
      }

      break;
    case "dab":
      var rand = Math.floor(Math.random() * dabArray.length);
      log("*Dab Command Received*\nFile: " + dabArray[rand] + "\nRand: " + rand);
      message.channel.send({
        files: ["./images/" + dabArray[rand]]
      });
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
          var mathtestingembed = new Discord.RichEmbed();
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
      message.channel.send(Math.floor(Math.random() * 20) + 1);
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
      let roleGod = message.guild.roles.find("name", "King");
      let roleGod1 = message.guild.roles.find("name", "Bot Dev");
      if (message.member.roles.has(roleGod.id)) {
        let newamount = 2;
        if (args[1]) {
          newamount = args[1];
        }
        let messagecount = newamount.toString();
        message.channel
          .fetchMessages({
            limit: messagecount
          })
          .then(messages => {
            message.channel.bulkDelete(messages);
            // Logging the number of messages deleted on both the channel and console.
            message.channel
              .send(
                "Deletion of messages successful. \n Total messages deleted including command: " +
                newamount
              )
              .then(message => message.delete(5000));
            log(
              "Deletion of messages successful. \n Total messages deleted including command: " +
              newamount
            );
          })
          .catch(err => {
            log("Error while doing Bulk Delete");
            log(err);
          });
      } else if (message.member.roles.has(roleGod1.id)) {
        let newamount = 2;
        if (args[1]) {
          newamount = args[1];
        }
        let messagecount = newamount.toString();
        message.channel
          .fetchMessages({
            limit: messagecount
          })
          .then(messages => {
            message.channel.bulkDelete(messages);
            // Logging the number of messages deleted on both the channel and console.
            message.channel
              .send(
                "Deletion of messages successful. \n Total messages deleted including command: " +
                newamount
              )
              .then(message => message.delete(5000));
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
      var list = new Discord.RichEmbed()
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
      if (message.member.roles.has(role11.id)) {
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
      let test10 = new Discord.RichEmbed()
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
      var embed = new Discord.RichEmbed()
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
      var embed = new Discord.RichEmbed();
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
      var embed0 = new Discord.RichEmbed();
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
      var embedlog = new Discord.RichEmbed();
      var CHANGELOG = config.changelog
      embedlog.setTitle("Change Log")
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
      message.channel.send("That isn't a command you idiot");
  }


});

bot.login(TOKEN);
