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
    const category = "961341239318413402";

    if (user.bot) { return; }
    if (reaction.message.channel.parent == category) {
        reaction.message.channel.delete();
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
            .setDescription('Click on the emoji to close the moderator application!');

        channel.send("<@" + user.id + ">");


        channel.send(embed).then(msg => {
            msg.react("❌");
        });
      channel.send('Write your application here and the staff will read it and decide based on what you write!\n Recommended:\n 1. Tell us a bit about yourself!\n 2. Why do you want to become a staff member?\n3. Do you have any prior moderation/management experience?\n 4. How often are you available?')
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