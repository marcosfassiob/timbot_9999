module.exports = {
    name: 'unmute',
    desc: 'Unmutes a user',
    aliases: 'unmute',
    usage: `${process.env.PREFIX}unmute <@user>`,
    example: `${process.env.PREFIX}unmute <@738918188376391712>`,
    perms: ["MUTE_MEMBERS"],
    execute(client, message, args, Discord) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const mutedRole = message.guild.roles.cache.find(r => r.name.toLowerCase().includes('muted'));
        const logs = message.guild.channels.cache.find((channel) => channel.name.includes('timbot-logs'));

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        if (!message.member.hasPermission(this.perms)) return message.reply("You don't have the perms to execute this command.");
        if (!message.guild.me.hasPermission(this.perms)) return message.reply("I don't have the perms to execute this command! Type `t.help unmute` for all the perms I need.");
        if (message.guild.me.roles.highest.comparePositionTo(mutedRole) < 0) return message.reply("My role needs to be higher than the muted role. Make sure you fix that!");

        if (!member.roles.cache.some(r => r.name === "Muted")) return message.reply(`**${member.user.tag}** has not been muted.`);
        member.roles.remove(mutedRole.id);

        const embed1 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setTitle(`Unmuted ${member.user.tag}`)
        .setTimestamp()

        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#861F41")
        .setTitle("Member unmuted")
        .setDescription(`**Member: ** ${member.user}`)
        .setTimestamp();

        message.channel.send(embed1)
            .then(() => {
                logs.send(embed2)
            }, err => {
                console.log(err.stack)
            });
    }
}