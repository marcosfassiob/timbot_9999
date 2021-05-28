const dayjs = require('dayjs');
module.exports = {
    name: 'userinfo',
    desc: "Displays user information",
    aliases: [
        'userinfo', 
        'whois'
    ],
    usage: [
        `${process.env.PREFIX}userinfo [@user]`
    ],
    example: [
        `${process.env.PREFIX}userinfo`,
        `${process.env.PREFIX}userinfo <@738918188376391712>`
    ],
    perms: "None",
    execute(client, message,  args, Discord) {
        
        let guildMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let url = guildMember.user.displayAvatarURL({ dynamic: true, size: 256 });

        //get date created and joined
        const cDate = dayjs(guildMember.user.createdTimestamp).format('MMMM D YYYY, h:mm A')
        const jDate = dayjs(guildMember.joinedTimestamp).format('MMMM D YYYY, h:mm A')
        let today = dayjs()
        let cAge = dayjs(today).diff(cDate, 'days')
        let jAge = dayjs(today).diff(jDate, 'days')

        //get roles
        let array = [];
        guildMember.roles.cache.some(r => {
            array.push(r)
            return array.toString().length > 1000
        })
        let len = array.length - 1
        

        //create embed
        const embed = new Discord.MessageEmbed()
        .setColor("#E87722")
        .setTitle(`About ${guildMember.user.tag}`)
        .setDescription(guildMember.user)
        .setThumbnail(url)
        .addFields(
            {name: "Date registered:", value: cDate, inline: true},
            {name: "Account age:", value: `${cAge} ${(cAge === 1) ? 'day' : 'days'}`, inline: true},
            {name: '\u200B', value: '\u200B', inline: true}, //blank
            {name: "Date joined:", value: jDate, inline: true},
            {name: "Days since joining:", value: `${jAge} ${(jAge === 1) ? 'day' : 'days'}`, inline: true},
            {name: '\u200B', value: '\u200B', inline: true}, //blank
            {name: `Roles: [${len}]`, value: `${array.join(' ')}`}
        )

        message.channel.send(embed)
            .catch(console.error)
    }
}