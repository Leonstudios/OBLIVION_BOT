const Discord = require('discord.js');
const Token = process.env['TOKEN']
const keepAlive = require('./server.js');
const { Client, Intents } = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const fileSystem = require('fs');


const prefix = '.';

client.once('ready', async () => {
  client.user.setActivity( 'SITE: OBLIVION', {type: 'PLAYING'}); 
    console.log('Ready!');
});

client.on("message", async message => 
{
    if(message.author.bot) { return; }
    
    if(message.content == prefix + "app")
    {
         const embed = new Discord.MessageEmbed()
	    .setColor('#0099ff')
	    .setTitle('Moderator Application')
	    .setDescription('dw')
        
        message.channel.send(embed).then(msg => {
            msg.react("👍");
        });
    }
})

client.on('messageReactionAdd', (reaction, user) => {
        reaction.message.channel.guild.channels.create("#" + user.name, {
	    type: 'GUILD_TEXT',
        permissionOverwrites: [
            {
        	    id: reaction.message.channel.guild.roles.everyone,
                allow: ['VIEW_CHANNEL'],
	        },
            
            {
        	    id: reaction.message.channel.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
	        }
        ]
    });
});

keepAlive();
client.login(Token);

//GG