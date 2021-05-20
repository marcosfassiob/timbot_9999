const Discord = require('discord.js');
const dayjs = require('dayjs');
const fs = require('fs');
const mongoose = require('mongoose')

require('dotenv').config();

const client = new Discord.Client({ disableEveryone: true });
const config = require('./config.json');
client.config = config;
client.commands = new Discord.Collection();
client.commands_config = new Discord.Collection();
client.commands_info = new Discord.Collection();
client.commands_mod = new Discord.Collection();
client.commands_fun = new Discord.Collection();
client.commands_misc = new Discord.Collection();
client.snipes = new Discord.Collection();
client.editsnipes = new Discord.Collection();

const guildCreate = require('./events/guildCreate');
const guildMemberAdd = require('./events/guildMemberAdd');
const guildMemberRemove = require('./events/guildMemberRemove');
const guildMemberUpdate = require('./events/guildMemberUpdate');
const inviteCreate = require('./events/inviteCreate');
const message = require('./events/message');
const messageDelete = require('./events/messageDelete');
const messageUpdate = require('./events/messageUpdate');
const levels = require('./models/levels');
const perServerSettings = require('./models/per-server-settings');

['command-handler'].forEach(handler => { 
    require(`./handlers/${handler}`)(client);
})

client.on('ready', async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(() => {
        console.log('TB9999 CONNECTED');
    }, err => {
        console.log(`Error when connecting to TB9999: ${err}`);
    })

    //events
    guildCreate(client, Discord)
    guildMemberAdd(client, Discord, dayjs)
    guildMemberRemove(client, Discord, dayjs)
    guildMemberUpdate(client, Discord)
    inviteCreate(client, Discord)
    message(client, Discord)
    message.loadPrefixes(client)
    messageDelete(client, Discord, dayjs)
    messageUpdate(client, Discord)

    //models
    levels(client)
    perServerSettings(client)
    
    console.log("TimBot 9999 ACTIVATED");
    client.user.setActivity(`t.help | ${client.guilds.cache.size} servers`, { type: "LISTENING" });
    console.log(`Serving ${client.guilds.cache.size} servers for ${client.users.cache.size} members`)
})

client.login(process.env.TOKEN);