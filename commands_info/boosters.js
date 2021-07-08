module.exports = {
    name: 'boosters',
    aliases: [
        'boosters', 
        'boosts'
    ],
    usage: [
        `${process.env.PREFIX}boosters`
    ],
    perms: "None",
    desc: 'Displays a list of server boosters',
    execute(client, message, args, Discord) {

        const { guild, channel } = message;
        let boosters = [];
        guild.members.cache.forEach(member => {
            if (member.premiumSinceTimestamp > 0) {
                boosters.push(`\`${member.user.tag}\``);
            }
        })
        if (boosters.length === 0) {
            boosters = `\`no boosters :(\``
        } else {
            boosters = boosters.join(', ')
        }

        const embed = new Discord.MessageEmbed()
        .setColor("#E87722")
        .setTitle(`List of boosters from ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`**Server level: **${message.guild.premiumTier}`)
        .addFields(
            { name: `Boosters:`, value: boosters, inline: true },
        )
        channel.send(embed).catch(err => console.log(err));
    }
}