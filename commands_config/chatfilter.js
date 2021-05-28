const mongoose = require('mongoose')
const guildConfigSchema = require('../schemas/guild-config-schema');
const { swearWords } = require('../words.json')
const { DiscordAPIError } = require('discord.js');
module.exports = {
    name: 'chatfilter',
    desc: 'Configures chat filter settings\n**WARNING:** `filter disable, enable` STILL A WORK IN PROGRESS.',
    aliases: [
        'chatfilter',
        'filter'
    ],
    subcommands: [
        '**chatfilter add** - adds a word to the bot\'s chat filter',
        '**chatfilter remove** - removes a word from the bot\'s chat filter',
        '**chatfilter disable** - disables the bot\'s chat filter',
        '**chatfilter enable** - enables the bot\'s chat filter',
        '**chatfilter list** - shows all censored words in filter',
        '**chatfilter default** - resets chat filter to default settings'
    ],
    usage: [
        `${process.env.PREFIX}filter add <word>`,
        `${process.env.PREFIX}filter remove <word>`,
        `${process.env.PREFIX}filter enable`,
        `${process.env.PREFIX}filter disable`,
        `${process.env.PREFIX}filter list`,
        `${process.env.PREFIX}filter default`,
    ],
    example: [
        `${process.env.PREFIX}filter add tentacle hentai`,
        `${process.env.PREFIX}filter remove hentai`
    ],
    perms: ["ADMINISTRATOR"],
    async execute(client, message, args, Discord) {

        const logs = message.guild.channels.cache.find(c => c.name.includes('timbot-logs'));

        const addToFilter = async (arguments) => {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }).then(async () => {
                try {
                    await guildConfigSchema.findOneAndUpdate( 
                        { guildId: message.guild.id }, 
                        { $addToSet: { chatFilter: arguments } },
                        { upsert: true, new: true })
        
                    const embed = new Discord.MessageEmbed()
                    .setColor("642667")
                    .setTitle(`Added phrase "${arguments}" to server's chat filter.`)
                    
                    const embed2 = new Discord.MessageEmbed()
                    .setColor("642667")
                    .setAuthor(`${message.author.tag} added word/phrase`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**Channel: **${message.channel}`)
                    .addField("Phrase added:", arguments)
                    .setTimestamp()
                    
                    await message.channel.send(embed).then(logs.send(embed2))
                } catch (err) {
                    console.log(err)
                } finally {
                    mongoose.connection.close();
                }
                
            })
        }    

        const removeFromFilter = async (arguments) => {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }).then(async () => {
                try {
                    await guildConfigSchema.findOneAndUpdate(
                        { guildId: message.guild.id }, 
                        { $pull: { chatFilter: arguments } }
                    )
    
                const embed = new Discord.MessageEmbed()
                .setColor("642667")
                .setTitle(`Removed phrase "${arguments}" from server's chat filter.`)
                .setTimestamp()
                
                const embed2 = new Discord.MessageEmbed()
                .setColor("642667")
                .setAuthor(`${message.author.tag} removed word/phrase`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Channel: **${message.channel}`)
                .addField("Phrase removed:", arguments)
                .setTimestamp()
                await message.channel.send(embed).then(logs.send(embed2))
                } catch (err) {
                    console.log(err)
                } finally {
                    mongoose.connection.close();
                } 
            })
        }

        const showFilterList = async () => {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }).then(async () => {
                try {
                    const filterList = await guildConfigSchema.findOne({ guildId: message.guild.id }, 'chatFilter')
                    const { chatFilter } = filterList
        
                    const embed = new Discord.MessageEmbed()
                    .setColor("642667")
                    .setTitle(`List of words filtered in ${message.guild.name}`)
                    .setDescription('```\n' + chatFilter.join('\n') + '```')
                    .setFooter('This feature is for config and viewing purposes only.')
                    await message.author.send(embed).then(() => {
                        message.reply("check your DMs.").then(m => {
                            setTimeout(() => m.delete(), 5000)
                        })
                    }, err => {
                        console.log(err)
                        if (err instanceof DiscordAPIError && err.message === 'Cannot send messages to this user') {
                            return message.reply("turn on your DMs.");
                        }
                    })
                } catch (err) {
                    console.log(err)
                } finally {
                    mongoose.connection.close();
                }
            })         
        }

        const resetToDefault = async () => {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }).then(async () => {
                try {
                    await guildConfigSchema.findOneAndUpdate(
                        { guildId: message.guild.id },
                        { $unset: { chatFilter: "" } }
                    )

                    await guildConfigSchema.updateOne(
                        { guildId: message.guild.id },
                        { chatFilter: swearWords }
                    )

                    const embed = new Discord.MessageEmbed()
                    .setColor("642667")
                    .setTitle(`Reset chat filter settings to default.`)
                    .setTimestamp()

                    const embed2 = new Discord.MessageEmbed()
                    .setColor("642667")
                    .setAuthor(`${message.author.tag} reset chat filter to default settings`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**Channel: **${message.channel}`)
                    .setTimestamp()
                    await message.channel.send(embed).then(logs.send(embed2))
                } catch (err) {
                    console.log(err)
                } finally {
                    mongoose.connection.close();
                }
            })
        }

        const enableOrDisable = async word => {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }).then(async () => {
                try {
                    if (word === 'enable') {
                        await guildConfigSchema.findOneAndUpdate( 
                            { guildId: message.guild.id }, 
                            { $set: { enableChatFilter: true } },
                        )   
                    } else if (word === 'disable') {
                        await guildConfigSchema.findOneAndUpdate( 
                            { guildId: message.guild.id }, 
                            { $set: { enableChatFilter: false } },
                        )
                    } 
                    const embed = new Discord.MessageEmbed()
                    .setColor("642667")
                    .setTitle(`${(word === 'enable') ? 'Enabled' : 'Disabled'} chat filter.`)
                    .setTimestamp();
                    message.channel.send(embed)

                    const embed2 = new Discord.MessageEmbed()
                    .setColor("642667")
                    .setAuthor(`${message.author.tag} ${(word === 'enable') ? 'enabled' : 'disabled'} chat filter`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**Channel: **${message.channel}`)
                    .setTimestamp();
                    logs.send(embed2)
                } catch (err) {
                    console.log(err)
                }
            })
        }

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        if (!message.guild.me.hasPermission(this.perms)) return message.reply(`I'm missing perms: \`${this.perms}\``)
        if (!message.member.hasPermission(this.perms)) return message.reply(`Missing perms: \`${this.perms}\``)
        else {
            if (args[0] === 'add') {
                addToFilter(args.slice(1).join(' '))
            } else if (args[0] === 'list') {
                showFilterList()
            } else if (args[0] === 'remove') {
                removeFromFilter(args.slice(1).join(' '))
            } else if (args[0] === 'default') {
                resetToDefault()
            } else if (args[0] === 'enable' || args[0] === 'disable') {
                enableOrDisable(args[0]);
            } else return message.reply(`Choose between one of six command prompts: \`add, default, disable, enable, list, remove\``)
        }
    }
}