module.exports = {
    name: 'ping',
    desc: 'Pingus.',
    usage: `${process.env.PREFIX}ping`,
    aliases: ['ping'],
    perms: "None",
    execute(client, message, args) {
        message.channel.send("bong.").then((msg) => {
            const ping = msg.createdTimestamp - message.createdTimestamp;
            msg.edit("bong. `" + `${ping} ms` + "`");
        });
    }
}