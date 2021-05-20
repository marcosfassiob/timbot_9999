module.exports = {
    name: 'reportbug',
    desc: 'Report a bug',
    usage: `${process.env.PREFIX}reportbug <bug>`,
    example: `${process.env.PREFIX}reportbug ship command broken :rolling_eyes:`,
    aliases: [
        'reportbug',
        'report'
    ],
    perms: "None",
    execute(client, message, args, Discord) {

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        const desc = args.join(' ') || message.attachments.first();
        const member = message.member

        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        .setColor('003C71')
        .setTitle(`Bug reported in ${message.guild.name}`)
        .addFields(
            { name: 'Description:', value: desc, inline: true },
            { name: 'User:', value: member.user.tag, inline: true }
        )
        .setFooter(`User ID: ${message.author.id} | Guild ID: ${message.guild.id}`)

        client.channels.cache.get('832281116135784490').send(embed)
            .then(() => {
                message.delete();
                message.channel.send('Successfully sent report!')
                    .then(m => { 
                        setTimeout(() => m.delete(), 5000) 
                    });
            }, err => console.log(err));
    }
}