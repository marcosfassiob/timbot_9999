module.exports = {
    name: 'poll',
    desc: 'Creates a poll.',
    usage: `${process.env.PREFIX}poll <question> <"option1"> <"option2">`,
    aliases: ['poll'],
    perms: ['MANAGE_MESSAGES'],
    execute(client, message, args, Discord) {
        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        if (!message.member.hasPermission(this.perms)) return message.channel.send(`${message.author} Missing perms: ${this.perms}`);
        if (!message.guild.me.hasPermission(this.perms)) return message.channel.send(`${message.author} I'm missing perms: ${this.perms}`);

        const array = args.toString().match(/(?:"[^"]*"|^[^"]*$)/g).map(str => str.replace(/,/g, " ").replace(/"/g, ""))
        const digits = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟']
        
        let description = []
        for (let n = 1; n < array.length; n++) {
            description.push(`${digits[n]} ${array[n]}`)
        }

        const embed = new Discord.MessageEmbed()
        .setColor('#003C71')
        .setAuthor(`${message.author.tag} has started a new poll!`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(description.join('\n'))
        .setTitle(array[0])
        message.channel.send(embed).then(m => {
            for (let n = 1; n < array.length; n++) {
                m.react(`${digits[n]}`)
            }
        })
    }
}