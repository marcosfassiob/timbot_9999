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

        let boosters = []
        let booster_size = 0

        function getBoosters() {
            message.guild.members.cache.forEach(m => {
                if (m.premiumSinceTimestamp > 0) {
                    boosters.push(m.user.tag)
                }
            })

            if (boosters.length === 0) boosters = 'no boosters :('
            else if (boosters.toString().length > 1000) boosters = 'too many to count :D'
            else {
                booster_size = boosters.length
                boosters = boosters.join('\n')
            }
        }

        getBoosters()
        
        let embed = new Discord.MessageEmbed()
        .setColor("#E87722")
        .setTitle(`List of boosters from ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`**Server level: ${message.guild.premiumTier}**\nFor those of you on this list, thank you for boosting this server!`)
        .addFields(
            { name: `Boosters [${booster_size}]:`, value: "```\n" + boosters + "```", inline: true },
        )

        message.channel.send(embed).catch(console.error)
    }
}