const mongoose = require('mongoose')
const guildConfigSchema = require('../schemas/guild-config-schema')
const { adminPerms } = require('../config.json')
const { bestWords, triggerWords, commandPrompts } = require('../words.json')
const guildPrefixes = {}
module.exports = (client, Discord) => {
    client.on('message', async message => {        

        //suicide awareness thing
        for (i = 0; i < triggerWords.length; i++) {
            if (message.content.toLowerCase().includes(triggerWords[i])) {
                let embed = new Discord.MessageEmbed()
                .setColor("#E87722")
                .setAuthor(`Are you alright?`, message.author.displayAvatarURL())
                .setTitle("This link redirects you to a list of national suicide crisis lines.")
                .setDescription(
                    "If you're seriously considering suicide, please seek professional help." 
                    + "\nCall your local emergency number for emergencies." 
                    + "\nIf nothing else works, here is a list of hotlines you can call:"
                    )
                .addFields(
                    { name: "National Suicide Hotline (for US citizens)", value: "1-800-273-8255\nOpen 24/7" },
                    { name: "The Trevor Project (for LGBTQ+ individuals):", value: "1-866-488-7386\nOpen 24/7" },
                    { name: "National Sexual Assault Hotline:", value: "1-800-656-4673\nOpen 24/7" },
                    { name: "SAMHSA Treatment Referral Helpline:", value: "1-877-726-4727\nOpen Mon-Fri from 8am-8pm" }
                )
                .setURL("https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines")
                .setFooter("Help is just a call away. Please reach out for help - Tim Honks#0808")
                console.log(`Message "${message.content}" sent by ${message.author.tag} triggered suicide awareness function in ${message.guild.name}`)
                message.author.send(embed)
                    .catch(err => {
                        console.log(err)
                        message.reply("you ok bro?")
                    })
            }
        }
        
        //timbot best bot
        for (i = 0; i < bestWords.length; i++) {
            if (message.author.bot) return;
            if (message.content.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().includes(bestWords[i])) {
                const embed4 = new Discord.MessageEmbed()
                .setColor("#E87722")
                .setTitle(
                    `${!!(message.member.nickname) ? message.member.nickname : message.author.username}...` 
                    + ` it's not like i like being complimented or anything...`
                    )
                .setImage("https://usaupload.com/file/ue1/tohsaka.gif")
                message.channel.send(embed4)
            }
        }

        //deletes messages longer than 1000 chars
        if (message.content.length > 1000) {
            if (message.member.hasPermission(adminPerms)) return;
            message.delete()
            message.reply("Messages longer than 1000 characters get auto-deleted.")
                .then(m => {
                    setTimeout(function() {
                        m.delete()
                    }, 5 * 1000)
                })
                .catch(err => console.log(err))
        }

        //set up everything for commands
        const prefix = guildPrefixes[message.guild.id] || process.env.PREFIX
        if (!message.content.toLowerCase().startsWith(prefix)) return;
        
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();
        const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd))
        
        //execute commands
        try {
            command.execute(client, message, args, Discord);
        } catch (err) {
            console.log(err);
        } finally {
            let num = Math.floor(Math.random() * 20);
            if (message.guild.id !== '778461267999588363' 
            && !client.commands_mod.has(command) 
            && !client.commands_config.has(command) 
            && num === 10) {
                const n = Math.floor(Math.random() * commandPrompts.length + 1);
                message.channel.send(commandPrompts[n])
            }
        }
    })   
}

module.exports.loadPrefixes = async client => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(async () => {
        try {
            for (const guild of client.guilds.cache) {
                const guildId = guild[1].id
                const result = await guildConfigSchema.findOne({ guildId: guildId })
                guildPrefixes[guildId] = result.prefix
            }
        } catch (err) {
            console.log(err)
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.updateCache = (guildId, newPrefix) => {
    guildPrefixes[guildId] = newPrefix
}