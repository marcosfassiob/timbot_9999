const dayjs = require('dayjs');
module.exports = {
    name: 'guildinfo',
    aliases: [
        'guildinfo', 
        'serverinfo'
    ],
    usage: `${process.env.PREFIX}guildinfo`,
    perms: "None",
    desc: "Displays server information",
    execute(client, message, args, Discord) {

        const guild = message.guild;

        const numChannels = guild.channels.cache.size;
        const numCategories = guild.channels.cache.filter(channel => channel.type == "category").size;
        const numTextChannels = guild.channels.cache.filter(channel => channel.type == "text").size; 
        const numVoiceChannels = guild.channels.cache.filter(channel => channel.type == "voice").size; 

        const numRoles = guild.roles.cache.size;
        const numEmotes = guild.emojis.cache.size;
        const rdate = dayjs(guild.createdTimestamp).format("MMMM D, YYYY");
        const today = dayjs()
        const gDate = dayjs(today).diff(rdate, 'days')

        const embed = new Discord.MessageEmbed()
        .setColor("#E87722")
        .setTitle(`About ${guild.name}`)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addFields(
            {name: "Date created:", value: rdate, inline: true},
            {name: "Guild age:", value: `${gDate} days`, inline: true},
            {name: "Server owner:", value: `${guild.owner.user}`, inline: true},
            {name: "Total channels: ", value: `${numChannels - numCategories} channels`, inline: true},
            {name: "Text channels:", value: `${numTextChannels} channels`, inline: true},
            {name: "Voice channels:", value: `${numVoiceChannels} channels`, inline: true},
            {name: "Total roles:", value: `${numRoles} roles`, inline: true},
            {name: "Total emotes:", value: `${numEmotes} emotes`, inline: true},
            {name: "Total members:", value: `${guild.memberCount} members`, inline: true},
        )
        message.channel.send(embed);
    }
}