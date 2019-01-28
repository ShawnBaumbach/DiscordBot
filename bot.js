var Discord = require('discord.io');
const client = new Discord.Client();
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
// Configure logger settings
/* logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
*/
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on("ready", () => {
    console.log("Bot online!");
    const guild = client.guilds.get("500850632056373271");
    const role = guild.roles.find("Loser", "Loser");

    console.log(`Found the role ${role.name}`);
})

bot.on('ready', function (evt) {
    //logger.info('Connected');
    //logger.info('Logged in as: ');
    //logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // var contents = fs.readFileSync('C:\\Discord Bot\\data.txt', 'utf8');
    // console.log(contents);

    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        /*bot.sendMessage({
            to: channelID,
            message: channelID
        });*/

        switch(cmd) {
            case 'Role': 
                bot.sendMessage({
                    to: channelID, 
                    message: "You have been assigned the role " + args[1]
                });
                guildMember = message.member;
                guildMember.addRole('Loser');
                break;
            case 'Roles':
            const guild = client.guilds.get("500850632056373271");
            const role = guild.roles.find("Loser", "Loser");
                bot.sendMessage({
                    to: channelID,
                    message: role
                });
                break;
            case 'Roles2':
                bot.sendMessage({
                    to: channelID,
                    message: roles
                });
                break;
         }
     }
});