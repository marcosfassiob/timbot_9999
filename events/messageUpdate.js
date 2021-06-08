const { swearWords, bestWords } = require('../words.json')
const { adminPerms } = require('../config.json')
const mongoose = require('mongoose')
const guildConfigSchema = require('../schemas/guild-config-schema')
module.exports = (client, Discord) => {
    client.on('messageUpdate', async (oldMessage, newMessage) => {

        if (newMessage.author.bot) return;
        if (newMessage.channel.type === 'dm') return;

        const logs = newMessage.guild.channels.cache.find(c => c.name.includes('timbot-logs'));

        //timbot best bot
        for (const word of bestWords) {
            if (newMessage.author.bot) return;
            if (newMessage.content.toLowerCase().includes(word)) {
                const embed4 = new Discord.MessageEmbed()
                .setColor("#E87722")
                .setTitle(`${!!(newMessage.member.nickname) ? newMessage.member.nickname : newMessage.author.username}... stop making me blush ...`)
                .setImage("https://usaupload.com/file/ue1/tohsaka.gif")
                newMessage.channel.send(embed4)
                return;
            }
        }

        //chat filter 
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            const filter = await guildConfigSchema.findOne({ guildId: oldMessage.guild.id }, 'chatFilter enableChatFilter');
            const { chatFilter, enableChatFilter } = filter;
            for (const word of chatFilter) {
                if (newMessage.content.toLowerCase().includes(word)) {
                    if (newMessage.member.hasPermission(adminPerms) || enableChatFilter === false) return;
                    newMessage.delete();
                    newMessage.reply("Watch your language.")
                    .then(m => {
                        setTimeout(() => { m.delete() }, 5000)
                    })
                    .catch(err => console.log(err));
                    return;
                }
            }
        })
        
        //deletes message if over 1000 chars
        if (newMessage.content.length > 1000) {
            for (const perm of adminPerms) {
                if (newMessage.member.hasPermission(perm)) return;
            }
            newMessage.delete()
            newMessage.reply("Messages longer than 1000 characters get auto-deleted.")
            .then(m => {
                setTimeout(() => { m.delete() }, 5000)
            }).catch(err => console.log(err))
        }

 

        //edit a couple things cause if not bot goes byebye
        if (oldMessage.content === newMessage.content) return;
        if (oldMessage.content.length > 1000) oldMessage.content = oldMessage.content.substring(0, 1000) + "..."
        if (newMessage.content.length > 1000) newMessage.content = newMessage.content.substring(0, 1000) + "..."
        if (!oldMessage.partial) {
            const embed = new Discord.MessageEmbed()
            .setColor("#E87722")
            .setAuthor(`${newMessage.author.tag} edited message`, newMessage.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Channel: ** ${oldMessage.channel}\n[**Jump to message**](${newMessage.url})`)
            .addFields(
                { name: "Original message:", value: oldMessage.content || oldMessage.attachments.first().proxyURL, inline: true },
                { name: "Edited message:", value: newMessage.content || newMessage.attachments.first().proxyURL, inline: true },
            )
            .setTimestamp()
            logs.send(embed)
        }
        
        //snipes
        client.editsnipes.set(oldMessage.channel.id, {
            oldContent: oldMessage.content,
            newContent: newMessage.content,
            author: oldMessage.member,
            oldImage: oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : null,
            newImage: newMessage.attachments.first() ? newMessage.attachments.first().proxyURL : null
        })
    })
}