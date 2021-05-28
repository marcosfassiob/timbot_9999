const levelSchema = require('../schemas/level-schema')
const mongoose = require('mongoose')
module.exports = {
    name: 'rank',
    desc: 'Displays your activity level',
    aliases: [
        'rank', 
        'level'
    ],
    usage: [
        `${process.env.PREFIX}rank [@user]`,
        `${process.env.PREFIX}rank [userid]`
    ],
    perms: "None",
    async execute(client, message, args, Discord) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const url = member.user.displayAvatarURL({ dynamic: true });

        //progress bar
        const black_semicircle_right = '<:semicircle_black_right:830166436462592000>';
        const blue_semicircle_right = '<:blue_semicircle_right:844691229392240683>';
        const blue_semicircle_left = '<:blue_semicircle_left:844691229388439573>';
        const blue_solid_bar = '<:blue_bar:844691229715070996>';
        const blue_mix_bar = '<:bar_blackandblue:844692199500677120>';
        const black_bar = '<:bar_black:830166406057164810>'

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            try {
                const xpNeeded = level => 4 * Math.pow(level, 2) + (45 * level) + 120 
                const result = await levelSchema.findOne({ guildId: message.guild.id, userId: member.id }, 'xp level -_id')
                const { xp, level } = result

                const leaderboard = await levelSchema.find({ guildId: message.guild.id }, 'xp level userId -_id').sort('-level -xp')
                let n = 0 //user's rank
                for (n; n < leaderboard.length; n++) {
                    if (message.author.id === leaderboard[n].userId) break;
                }

                let progressBar = [blue_semicircle_left];
                for (let i = 0.1; i < 1; i += 0.1) {
                    switch (true) {
                        case (xp >= xpNeeded(level) * i):
                            progressBar.push(blue_solid_bar);
                            break;
                        case (xp < xpNeeded(level) * i && xp >= xpNeeded(level) * (i - 0.1)):
                            progressBar.push(blue_mix_bar);
                            break;
                        case (xp < xpNeeded(level) * i):
                            progressBar.push(black_bar);
                            break;
                    }
                }
                progressBar.push((xp >= xpNeeded(level) ? blue_semicircle_right : black_semicircle_right))
                progressBar = progressBar.join('')

                const embed = new Discord.MessageEmbed()
                .setColor('#003C71')
                .setAuthor(`${member.user.tag}'s stats:`, url)
                .setTitle(`Rank: #${n + 1}`)
                .setDescription(`Level: ${level}${progressBar}${xp}/${xpNeeded(level)} xp`)
                message.channel.send(embed);
            } catch (err) {
                console.log(err);
                message.reply("I wasn't able to fetch any ranks.");
            }
        })
    }
}