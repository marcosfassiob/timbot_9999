module.exports = {
    name: 'purge',
    desc: 'Deletes a number of messages',
    aliases: [
        'purge',
        'prune',
        'clear',
        'delete',
    ],
    usage: [
        `${process.env.PREFIX}purge [@user] <number>`
    ],
    example: [
        `${process.env.PREFIX}purge 20`,
        `${process.env.PREFIX}purge <@738918188376391712> 20`
    ],
    perms: ["MANAGE_MESSAGES"],
    async execute(client, message, args, Discord) {  

        const logs = message.guild.channels.cache.find(c => c.name.includes('timbot-logs'));
        const member = message.mentions.members.first() || message.member;
        const amount = !!(parseInt(args[0])) ? (parseInt(args[0])) : (parseInt(args[1]));
        if (!member && isNaN(amount) || !args[0]) return client.commands.get('help').execute(client, message, args, Discord);

        //purge embed
        const embed1 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setTitle(`Purged ${amount} ${!!((amount) === 1) ? 'message' : 'messages'}.`);

        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#861F41")
        .setTitle("Purge command used")
        .setDescription(`**Used on (?): ** ${!!(args[0].match(/^\d/)) ? "Nobody" : member}\n**Amount: ** ${amount}\n **Channel: ** ${message.channel}`)
        .setTimestamp();

        const purgeAll = async () => {
            await message.channel.bulkDelete(amount + 1).then(() => {
                message.channel.send(embed1).then(m => {
                    setTimeout(() => m.delete(), 5000);
                    logs.send(embed2);
                }, e => {
                    console.log(e);
                })
            }).catch(err => {
                console.log(err);
                message.reply(`I couldn't purge any messages.`);
            })
        }

        const purgeUser = async () => {
            message.delete()
            await message.channel.messages.fetch({ limit: 100 }).then(async (amnt) => {
                amnt = amnt.filter(m => m.author.id === member.user.id).array().slice(0, amount)
                await message.channel.bulkDelete(amnt).then(() => {
                    message.channel.send(embed1).then(m => {
                        logs.send(embed2)
                        setTimeout(() => m.delete(), 5000)
                    }, e => {
                        console.log(e)
                    })
                }).catch(err => {
                    console.log(err)
                    return message.reply("I couldn't purge any messages.")
                })
            })
        }

        if (!message.member.hasPermission(this.perms)) return message.reply(`missing perms: \`${this.perms}\``);
        if (!message.guild.me.hasPermission(this.perms)) return message.reply(`I'm missing perms: \`${this.perms}\``);
        if (amount >= 100 || amount < 1) return message.reply("Choose a number between 2 and 99.");

        //main function
        if (args[0].match(/^\d/)) purgeAll();
        else purgeUser();
    }
}