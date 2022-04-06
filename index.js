const Discord = require('discord.js');
const Token = process.env['TOKEN']
const keepAlive = require('./server.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fileSystem = require('fs');

let ModeratorApplicationId = "";
const prefix = '.';

client.once('ready', async () => {
  client.user.setActivity('SITE: OBLIVION', { type: 'PLAYING' });
  console.log('Ready!');
});

client.on("message", async message => {
  if (message.author.bot)  return; 

  if (message.content == prefix + "app") {
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Moderator Application')
      .setDescription('You can be a apply to be a moderator by clicking on the reaction!')

    message.channel.send(embed).then(msg => {
      msg.react("👍");
        ModeratorApplicationId = msg.id;
    });
  }
})

client.on('messageReactionAdd', (reaction, user) => {
        const category = "961285909901344799";
    
        if(user.bot) { return; } 
        if(reaction.message.channel.parent == category)
        {
            reaction.message.channel.delete();
            return;
        }
        if(reaction.message.id != ModeratorApplicationId ) return;
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
  });
});

keepAlive();
client.login(Token);

//GG