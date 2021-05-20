const mongoose = require('mongoose')
const nicknameSchema = require('../schemas/nickname-schema')
const getPastNicknames = async (guildId, userId, nicknames) => {
    await await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(async () => {
        try {
            const result = await nicknameSchema.findOneAndUpdate(
                { guildId, userId }, 
                { guildId, userId, $push: { nicknames: nicknames } },
                { upsert: true, new: true }
            )
            console.log(result)
        } finally {
            mongoose.connection.close()
        }
    })
}

module.exports = (client, Discord) => {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {

        const logs = oldMember.guild.channels.cache.find((c) => c.name.includes('timbot-logs'));

        //nickname change
        if (oldMember.nickname !== newMember.nickname) {

            //send to logs
            const embed = new Discord.MessageEmbed()
            .setColor("#E87722")
            .setAuthor(`${oldMember.user.tag} edited nickname`, oldMember.user.displayAvatarURL({ dynamic : true }))
            .addFields(
                { name: "Old nickname:", value: (oldMember.nickname === null) ? oldMember.user.username : oldMember.nickname, inline: true },
                { name: "New nickname:", value: (newMember.nickname === null) ? newMember.user.username : newMember.nickname, inline: true },
            )
            .setTimestamp()
            logs.send(embed)
                .catch(e => console.log(e.stack));

            //past nicknames
            if (oldMember.nickname === null) return;
            getPastNicknames(newMember.guild.id, newMember.id, oldMember.nickname)
        }
    })
}