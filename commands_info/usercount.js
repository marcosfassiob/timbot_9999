module.exports = {
    name: 'usercount',
    desc: 'Displays total users in server',
    usage: `${process.env.PREFIX}usercount`,
    aliases: [
        'usercount', 
        'membercount'
    ],
    perms: "None",
    execute(client, message, args) {
        message.channel.send(`Total members: **${message.guild.memberCount}**`);
    }
}