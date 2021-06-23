const mongoose = require('mongoose')
const guildConfigSchema = require('../schemas/guild-config-schema');
const { DiscordAPIError } = require('discord.js');
const { swearWords } = require('../words.json')
const { textChannels, categories } = require('../config.json')

const setUpChatFilter = async (guildId) => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(async () => {
        try {
            await guildConfigSchema.findOneAndUpdate(
            { guildId: guildId },
            { guildId, $addToSet: { chatFilter: swearWords } },
            { upsert: true, new: true })
        } catch (err) {
            console.log(err)
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.setUpChatFilter = setUpChatFilter

module.exports = (client, Discord) => {
    client.on('guildCreate', async guild => {

        //find who invited bot
        await Discord.Util.delayFor(500);
        const entry = await guild.fetchAuditLogs({ type: 'BOT_ADD' }).then(audit => audit.entries.first());
        const channel = guild.channels.cache.find(c => c.type === 'text' && c.viewable === true) //if user's DMs are closed
        let timbotLogs = guild.channels.cache.some(c => c.name.includes('timbot-logs') && c.type === "text"); //if someone already set up timbot logs
        let mutedRole = guild.roles.cache.find(r => r.name.toLowerCase().includes('muted')); //if there's already a muted role

        //thanks-for-adding-me message
        const embed1 = new Discord.MessageEmbed()
        .setColor("#E87722")
        .setTitle("Thank you for adding TimBot 9999!")
        .setDescription("If you find any bugs, just type `t.reportbug <description>` and I'll do my best to fix that bug!")
        .addFields(
            { name: "This bot includes:", value: "• Built-in chat filter\n• Proper moderation and audit logging\n• Cute little mini-commands"}
        )
        .setImage('https://usaupload.com/file/1jfF/Himouto!_Umaru-chan_Cute_Smile_-_Imgur_(1).gif')
        .setFooter("Developed by Tim Honks#0808");

        const createMutedRole = () => {
            if (!mutedRole) {
                guild.roles.create({ 
                    data: {
                        name: "Muted",
                        color: "#7b5c00",
                        permissions: []
                    }
                }).then(role => {
                    guild.channels.cache.forEach(c => {
                        c.updateOverwrite(role, {
                            SEND_MESSAGES: false,
                            SPEAK: false,
                            ADD_REACTIONS: false
                        });
                    });
                });
            } else console.log("muted role already set up");
        }

        const createTimbotLogs = () => {
            let logs = guild.channels.cache.find(c => c.name.includes('logs') && c.type === "category");
            guild.channels.create('timbot-logs', { type: 'text' })
            .then(async cn => {
                await cn.setParent(logs.id);
                await cn.lockPermissions();
            }, err => console.log(err));
        }

        const createLogsCategory = () => {
            guild.channels.create('logs', {
                type: 'category',
                permissionOverwrites: [{ id: guild.roles.everyone, deny: ["VIEW_CHANNEL", "SEND_MESSAGES"] }]
            }).then(() => {
                createTimbotLogs();
            })
        }

        const setUpLogs = () => {
            for (const category of categories) {
                try {
                    let logs = guild.channels.cache.find(c => c.name.includes(category) && c.type === "category");
                    if (logs) {
                        if (timbotLogs) {
                            console.log(`${guild.name} already has TimBot Logs set up.`);
                            return;
                        } else {
                            createTimbotLogs();
                            return;
                        }
                    } else {
                        createLogsCategory();
                        return;
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
        
        //MAIN FUNCTION
        setUpChatFilter(guild.id) //enables chat filter
        createMutedRole();
        setUpLogs();
        entry.executor.send(embed1).catch(err => {
            console.log(err)
            if (err instanceof DiscordAPIError && err.message === 'Cannot send messages to this user') {
                channel.send(embed1)
            }
        })
    })
}