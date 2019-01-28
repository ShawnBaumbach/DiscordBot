const Discord = require('discord.js');
const client = new Discord.Client();
var auth = require('./auth.json');
var bBots = require('./BlackList.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`); 
});

client.on('message', message  => {
    //var guild = client.guilds.get(guildID);
    //const channel = member.guild.channels.find(ch => ch.name === 'work-orders');
    // var contents = fs.readFileSync('C:\\Discord Bot\\data.txt', 'utf8');
    //var chan = "work-orders"
    //if (message.channel.name == chan && message.pinned == false)
     //   message.delete(60000*5);
    if (message.author.bot)
    //    message.delete(60000);
        console.log(message.type.toString())
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        switch(cmd.toUpperCase()) {
            case 'ROLE': 
                if (args[1] != null){
                    var uRole = getRoleID(args[1]);
                    if (bBots.BlockRoles.includes(args[1].toUpperCase())){
                        message.reply(`you do not have access to the role "${args[1]}"`);
                        break;
                    }
                    if (uRole == null){
                        message.reply(`there is no role called "${args[1]}". Type !roles to view a list of possible roles.`);
                    } else {
                        guildMember = message.member;
                        guildMember.addRole(uRole);  
                        message.reply(`you have been assigned the role "${args[1]}"`);   
                }}
                break;

            case 'REROLL': 
                if (args[1] != null){
                    var uRole = getRoleID(args[1]);

                    if (uRole == null){
                        message.reply(`there is no role called "${args[1]}". Type !roles to view a list of possible roles.`);
                    } 
                    else if (message.member.roles.has(uRole) == false){
                        message.reply(`you do not have the role "${args[1]}"`);
                        break;
                    }
                    else {
                        guildMember = message.member;
                        guildMember.removeRole(uRole);  
                        message.reply(`you no longer have the role "${args[1]}"`);      
                    }}
                break;

            case 'GUILDS':
                // message.channel.send(client.guilds.map(g => g.name).join("\n"));
                message.channel.send(client.guilds.filter(g => g.memberCount > 10).map(g => g.name).join("\n"));
                break;

            case 'HELP':
                if (args[1] == null)
                    message.reply("If you can't help yourself, then how could I?");
                break;

            case 'WHO':
                var uRole = getRoleID(args[1]);
                if (uRole != null && args[1] != null){
                    const ListEmbed = new Discord.RichEmbed()
                        .setColor(message.guild.roles.get(uRole).color)
                        .setTitle(`${args[1][0].toUpperCase() + args[1].substring(1).toLowerCase()}:`)
                        .addField("Skill sheet", 'You can view the google skill sheet [here](https://docs.google.com/spreadsheets/d/1V_t_XanpetCSBKaQb3qbKtEd3Hrfqo7LRWA3L--HwYM).')
                        .setFooter(`requested by ${message.member.displayName}.`)
                        .setDescription(message.guild.roles.get(uRole).members.map(m=>m.displayName).join('\n'));
                    message.channel.send(ListEmbed);
                } else
                    message.reply(`the role "${args[1]}" does not exist`);       
                break;

            case 'ROLES':
                message.channel.send(message.guild.roles.filter(g => g.name != "@everyone" 
                && bBots.BlockRoles.includes(g.name.toUpperCase()) == false).map(g => g.name).join("\n"));
                break;
            }
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

client.login(auth.token);