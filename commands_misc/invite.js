module.exports = {
    name: 'invites',
    aliases: [
        'invites',
        'invite'
    ],
    usage: [
        `${process.env.PREFIX}invite`, 
    ],
    perms: "None",
    desc: 'Displays a list of invites and the number of clicks it got.',
    execute(client, message, args, Discord) {
        const { guild, channel } = message;
        const embed = new Discord.MessageEmbed()
        .setColor('003C71')
        .setTitle(`Top five inviters in ${guild.name}`)
        .setThumbnail(guild.iconURL({ dynamic: true }));

        guild.fetchInvites().then(invites => {
            try {
                invites = invites.array().filter(invite => invite.uses > 0).sort((inviteA, inviteB) => { return inviteB.uses - inviteA.uses });
                for (let i = 0; i < 5; i++) {
                    embed.addField(`${i + 1}.) ${invites[i].inviter.tag}`, `Code: \`${invites[i].code}\`\nMembers invited: **${invites[i].uses}**`)
                }
                return channel.send(embed);
            } catch (err) {
                console.log(err);
                if (err instanceof TypeError && err.message.startsWith('Cannot read property')) {
                    embed.setDescription(`There are no invites. Be the first to invite someone here!`)
                } else {
                    embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                }
                return channel.send(embed);
            }
        }, err => {
            console.log(err);
            embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
            channel.send(embed);
        })
    }
}