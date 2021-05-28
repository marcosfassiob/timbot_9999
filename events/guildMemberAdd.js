const { DiscordAPIError } = require('discord.js');
const { textChannels } = require('../config.json');
const message = require('./message');
module.exports = (client, Discord, dayjs) => {
    client.on('guildMemberAdd', async member => {

        //assign variables
        const today = dayjs()
        const date_registered = dayjs(member.user.createdTimestamp).format("MMMM D, YYYY h:mm A");
        const days_since_reg = Math.floor(dayjs(today).diff(date_registered, 'days'));
        const hours_since_reg = dayjs(today).diff(date_registered, 'hours');
        const hours = Math.floor(hours_since_reg - days_since_reg * 24) + 1

        const color = ((days_since_reg >= 15 && days_since_reg <= 45) || member.user.bot) ? "FFD700" : (days_since_reg < 15) ? "FF0000" : "00FF00";
        const welcome_gif = [
            'https://usaupload.com/file/APZ/wave2.gif', 
            'https://usaupload.com/file/APW/yuru_camp_2.gif',
            'https://usaupload.com/file/AQ1/wave3.gif',
            'https://usaupload.com/file/ASC/wave4.gif',
            'https://usaupload.com/file/ASD/wave5.gif',
            'https://usaupload.com/file/ASM/wave6.gif',
            'https://usaupload.com/file/ASN/wave7.gif',
            'https://usaupload.com/file/ASP/wave8.gif',
            'https://usaupload.com/file/ASQ/wave9.gif'
        ];

        const reject_gif = [
            'https://usaupload.com/file/AQ2/reject.gif',
            'https://usaupload.com/file/ASB/reject3.gif',
            'https://usaupload.com/file/ASR/reject4.gif'
        ];

        const logs = member.guild.channels.cache.find((c) => c.name.includes('timbot-logs') && c.type === 'text');
        const general = member.guild.channels.cache.find((c) => c.name.includes('general') && c.type === 'text');

        //altinator 9999
        const embed1 = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor(`${member.user.tag} has joined. Say hi!`, member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(member.user)
        .addFields(
            {name: "Date registered:", value: date_registered},
            {name: "Account age:", value: `${Math.floor(days_since_reg)} ${(days_since_reg === 1) ? 'day' : 'days'}, ${hours} ${(hours === 1) ? 'hour' : 'hours'}`}
        )
        .setImage(welcome_gif[Math.floor(Math.random() * welcome_gif.length)])
        .setFooter("Provided by TimBot Altinator 9999");

        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(`${member.user.tag} has joined the server`, member.user.displayAvatarURL({ dynamic: true }))
        .setColor("00ff00")
        .setDescription(`**Account age: ** ${Math.floor(days_since_reg)} days`)
        .setTimestamp();

        //create functions n shit
        const kickMember = async () => {
            await member.send(`You've been kicked from **${member.guild.name}** for being under the minimum account age requirements. ` + 
            `Come back in **${15 - days_since_reg}** days and/or **${24 - (hours_since_reg - (days_since_reg * 24))}** hours!`)
                .catch(err => {
                    console.log(err);
                    if (err instanceof DiscordAPIError && err.message === 'Cannot send messages to this user') {
                        embed1.setFooter("Couldn't DM user, oh well ¯\\_(ツ)_/¯");
                    }
                }).then(() => {
                    embed1.setAuthor(`Suspicious user detected!`, member.user.displayAvatarURL({ dynamic: true }));
                    embed1.setDescription(`Kicked **${member.user.tag}.**`);
                    embed1.setImage(reject_gif[Math.floor(Math.random() * reject_gif.length)]);
                    embed1.setFooter("Provided by TimBot Altinator 9999");
                    general.send(embed1);
                    member.kick()
                        .catch(err => {
                            console.log(err)
                            message.channel.send(`Something stopped working. Please use \`t.report\` to report this bug!\n` + "```\n" + err + "```\n")
                        })
                });
            }

        //MAIN FUNCTION
        if (days_since_reg < 15) {
            kickMember().then(logs.send(embed2))
        } else {
            general.send(embed1).then(logs.send(embed2))
        }
    })
}