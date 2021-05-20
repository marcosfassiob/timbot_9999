module.exports = {
    name: 'suggest',
    desc: 'Suggest something!',
    usage: `${process.env.PREFIX}suggest <suggestion>`,
    example: `${process.env.PREFIX}suggest hentai command`,
    aliases: [
        'suggest',
    ],
    perms: "None",
    execute(client, message, args, Discord) {

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        const suggestion = args.join(' ') || message.attachments.first();

        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        .setColor('003C71')
        .setTitle(`Suggestion from ${message.guild.name}`)
        .addField('Suggestion:', suggestion)
        .setFooter(`User ID: ${message.author.id} | Guild ID: ${message.guild.id}`)

        client.channels.cache.get('832281116135784490').send(embed)
            .then(() => {
                message.delete();
                message.channel.send('Successfully sent suggestion!')
                    .then(m => {
                        setTimeout(() => m.delete(), 5000)
                    });
            }, e => console.log(e.stack));
    }
}