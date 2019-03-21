const Discord = require('discord.js');
const client = new Discord.Client();
var auth = require('./auth.json');
var bBots = require('./BlackList.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`); 
});

// Just Dead Things
client.on("guildMemberAdd", member => {
    if (member.guild.id == '246768916381171723')
        member.guild.channels.get('397896637361553408').send(member.user.username + " has joined the server! He's been on discord since " 
        + (member.user.createdAt.getMonth() + 1)
        + "/" + (member.user.createdAt.getDate() + 1)
        + "/" + member.user.createdAt.getFullYear()); 


    //console.log(member.client.users)
});

client.on('message', message  => {
    //var guild = client.guilds.get(guildID);
    //const channel = member.guild.channels.find(ch => ch.name === 'work-orders');
    // var contents = fs.readFileSync('C:\\Discord Bot\\data.txt', 'utf8');
    //var chan = "work-orders"
    //if (message.channel.name == chan && message.pinned == false)
     //   message.delete(60000*5);
    //if (message.author.bot)
    //    message.delete(60000);
        //console.log(message.type.toString())

    if (message.content.toLowerCase === "bad bot")
        message.reply(`Just doing my job! :angry: `);

    if (message.content.toLowerCase === "good bot")
        message.reply(`You bet. :smirk: `);

    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args.shift();
        var cmdparameter = args.join(" ");

        switch(cmd.toUpperCase()) {
            case 'ROLL': 
            case 'ROLE':
                if (cmdparameter != null){
                    var uRole = getRoleID(cmdparameter);
                    if (bBots.Roles.includes(cmdparameter.toUpperCase()) == false){
                        message.reply(`you do not have access to the role "${cmdparameter}"`);
                        break;
                    }
                    if (uRole == null){
                        message.reply(`there is no role called "${cmdparameter}". Type !roles to view a list of possible roles.`);
                    } else {
                        guildMember = message.member;
                        guildMember.addRole(uRole);  
                        message.reply(`you have been assigned the role "${cmdparameter}"`);   
                }}
                break;

            case 'REROLL': 
                if (cmdparameter != null){
                    
                    var uRole = getRoleID(cmdparameter);
                    
                    if (uRole == null){
                        message.reply(`there is no role called "${cmdparameter}". Type !roles to view a list of possible roles.`);
                    } 
                    else if (message.member.roles.has(uRole) == false){
                        message.reply(`you do not have the role "${cmdparameter}"`);
                        break;
                    }
                    else {
                        try{
                            guildMember = message.member;
                            guildMember.removeRole(uRole); 
                            message.reply(`you no longer have the role "${cmdparameter}"`);  
                        }
                        catch (error){
                            console.log("Failed to remove role");
                            message.reply(`I failed to remove the role "${cmdparameter}"`); 
                        }
                    }
                }
                break;

            case 'GUILDS':
                // message.channel.send(client.guilds.map(g => g.name).join("\n"));
                message.channel.send(client.guilds.filter(g => g.memberCount > 10).map(g => g.name).join("\n"));
                break;

            case 'HELP':
                if (cmdparameter == null)
                    message.reply("If you can't help yourself, then how could I?");
                break;

            case 'WHO':
                var uRole = getRoleID(cmdparameter);
                if (uRole != null && cmdparameter != null){
                    const ListEmbed = new Discord.RichEmbed()
                        .setColor(message.guild.roles.get(uRole).color)
                        .setTitle(`${cmdparameter[0].toUpperCase() + cmdparameter.substring(1).toLowerCase()}:`)
                        .addField("Skill sheet", 'You can view the google skill sheet [here](https://docs.google.com/spreadsheets/d/1V_t_XanpetCSBKaQb3qbKtEd3Hrfqo7LRWA3L--HwYM).')
                        .setFooter(`requested by ${message.member.displayName}.`)
                        .setDescription(message.guild.roles.get(uRole).members.map(m=>m.displayName).join('\n'));
                    message.channel.send(ListEmbed);
                } else
                    message.reply(`the role "${cmdparameter}" does not exist`);       
                break;

            case 'ROLES':
                message.channel.send(message.guild.roles.filter(g => g.name != "@everyone" 
                && bBots.Roles.includes(g.name.toUpperCase()) == true).map(g => g.name).join("\n"));
                break;

            case 'PARTY':
                console.log(message.member.guild.members.map(m=>m.displayName));
                if (cmdparameter != null){
                    // returns false if the parameter does not contain a number
                    if (isNaN(cmdparameter) == true) {
                        message.channel.send("Please provide a number following the Party command");
                        break;
                    }
                    
                    let max = Math.floor(cmdparameter);
                    /*
                    if (max <= 1) {
                        message.channel.send("Please provide a number larger than 1");
                        break;
                    }
                    */
                    let names = []
                    let partymembers = message.member.guild.members.map(m=>m.voiceChannelID).map(m=>m == message.member.voiceChannelID);
                    let namestemp = message.member.guild.members.map(m=>m.displayName);
                    for (let pm = 0; pm < partymembers.length; pm++) {
                        if (partymembers[pm] == true)
                            names.push(namestemp[pm]);
                    }
                    
                    console.log(teamString(names, max))
                    message.channel.send(teamString(shuffle(names), max))

                } else {
                    message.channel.send("There must be a number following the 'Party' command")
                }
                break;
            }
        }
    
    function teamString(names, max) {
        let str = [];
        let temp = 0
        let teamNumber = 1;

        str.push("Team " + teamNumber + ":");
        names.forEach(e => {
            //if (temp < max)
            temp < max ? str.push("\t" + e) : ( str.push("Team " + (++teamNumber) + ":"), str.push("\t" + e), temp = 0 )
            temp ++;
        });

        return str;
    }

    function shuffle(a) {
        b = [];
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }

        return a;
    }

    function getRoleID(name){
        //var guild = client.guilds.get(guildID);
        var guild = message.guild;
        temp = guild.roles.find(role => role.name.toUpperCase() === name.toUpperCase());
        if (temp != null)
            return temp.toString().substring(3).split('>')[0];
        else
            return null
    }
});

client.on('error', console.error);
client.on("reconnecting", () => console.log("Attempting to reconnect..."))

client.login(auth.token);