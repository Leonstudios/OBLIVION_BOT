const Discord = require('discord.js');
const Token = process.env['TOKEN'];
const config = require("./config.js");
const keepAlive = require('./server.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

var moderatorApplicationID = "";

client.once('ready', async () => {
    client.user.setActivity('SITE: OBLIVION', { type: 'PLAYING' });
    console.log('Ready!');
});

client.on("message", async message => {
    if (message.author.bot) return;
    const params = message.content.split(" ");

    if (params[0] == config.adminPrefix + "PDM") {

        if (!IsAdmin(message.author.id)) { return; }
        if (params[1] == "app") {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Moderator Application')
                .setDescription('You can be a apply to be a moderator by clicking on the reaction!')

            message.channel.send(embed).then(msg => {
                msg.react("👍");
                moderatorApplicationID = msg.id;
            });
        }


    }
})

client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) { return; }   
    
    const category = "961352646885769276";

    if (reaction.message.channel.parent == category) {
        
        
        
        
        reaction.message.channel.messages.fetch({ after: 1, limit: 1 }).then(messages => {
            let ping = messages.first().content;
            if(ping.includes("<") && ping.includes(">") && ping.includes("@")) {
                ping.replace("<", '').replace("@",1")
            }
            
            reaction.message.channel.delete();
            
        })
        .catch(console.error);
        return;
    }

    if (reaction.message.id != moderatorApplicationID) return;

    reaction.message.channel.guild.channels.create(user.username, {
        type: 'GUILD_TEXT',
        permissionOverwrites: [
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: reaction.message.channel.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
            }
        ]
    }).then(channel => {
        channel.setParent(category);
            const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Moderator Application')
            .setDescription('Introduce your self!\n1. Why do you want to become a staff member?\n2. Do you have any prior moderation/management experience?\n3. How often are you available?\n  \nyou can wait for our stuff the check your application\n\n\nClick on the emoji to close the moderator application!')
channel.send("<@" + user.id + ">");
        channel.send(embed).then(msg => {
            msg.react("❌");
        });
    });

});

function IsAdmin(id) {
    for (let i = 0; i < config.admins.length; i++) {
        if (config.admins[i] == id) {
            return true;
        }
    }

    return false;
}

keepAlive();
client.login(Token);

//GG