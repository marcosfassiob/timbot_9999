module.exports = {
    name: 'ship',
    aliases: ['ship'],
    usage: [
        `${process.env.PREFIX}ship <@user1> <@user2>`,
        `${process.env.PREFIX}ship <@user1> <anything>`,
        `${process.env.PREFIX}ship <anything> <@user1>`,
        `${process.env.PREFIX}ship <anything> <anything>`
    ],
    example: [
        `${process.env.PREFIX}ship <@738918188376391712> <@733085479590690847>`,
        `${process.env.PREFIX}ship <@738918188376391712> heylol`,
        `${process.env.PREFIX}ship Subaru <@738918188376391712>`,
        `${process.env.PREFIX}ship timbot bestbot`
    ],
    perms: "None",
    desc: 'Ships two users together',
    execute(client, message, args, Discord) {

        //users/params
        let users = message.mentions.users.array()
        let [ param1, param2 ] = [ users[0], users[1] ]
        if (!param1) param1 = args[0]
        if (!param2) param2 = args[1]
        if (users[0] && !users[1]) param2 = (param1 === users[0]) ? args[1] : args[0]

        let param1len = ""
        let param2len = ""

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        if (!args[1]) return message.reply('please enter two words to ship together')
        if (args[2]) return message.reply(`you cannot have more than two words in your message - type \`t.help ship\` for help`)

        if (param1 === users[0]) param1len = parseInt(param1.id.toString().substring(param1.id.length - 5, param1.id.length))
        else if (param1 === args[0]) param1len = Math.pow(parseInt(param1.toString().length) + 3, 5)

        if (param2 === users[1]) param2len = parseInt(param2.id.toString().substring(param2.id.length - 5, param2.id.length))  
        else if (param2 === args[1]) param2len = Math.pow(parseInt(param2.toString().length) + 3, 5)
        
        let shipRate = (param1len + param2len) * (param1.toString().length + param2.toString().length)
        shipRate = Math.ceil(parseInt(shipRate.toString().substring(shipRate.toString().length - 3, shipRate.toString().length))/10)

        const black_bar = '<:bar_black:830166406057164810>'
        const red_bar = '<:bar_red:830166421463629924>'
        const mix_bar = '<:bar_blackandred:830167809639579651>'

        const black_semiright = '<:semicircle_black_right:830166436462592000>'
        const red_semileft = '<:semicircle_red_left:830166539935678515>'
        const red_semiright = '<:semicircle_red_right:830166473875128331>'

        let emote;
        let footer;

        //emote magic fuck yeah
        switch (true) {
            case (shipRate <= 20):
                emote = ':neutral_face:'
                footer = 'horrible idea please stop'
                break;
            case (shipRate > 20 && shipRate <= 40):
                emote = ':rolling_eyes:'
                footer = 'there are plenty of fish out there, head up king/queen!'
                break;
            case (shipRate > 40 && shipRate <= 60):
                emote = ':face_with_raised_eyebrow:'
                footer = 'ayo? i see some potential'
                break;
            case (shipRate > 60 && shipRate < 69):
                emote = ':grin:'
                footer = 'there\'s some chemistry here'
                break;
            case (shipRate === 69):
                emote = ':smirk:'
                footer = 'get a room'
                break;
            case (shipRate > 69 && shipRate <= 80):
                emote = ':smiling_face_with_3_hearts:'
                footer = 'you two definitely seem cute together'
                break;
            case (shipRate > 80):
                emote = ':heart_eyes:'
                footer = 'happily ever after..?'
                break;
        }

        //ship bar magic fuck yeah
        let i = 0
        let progressBar = []
        progressBar.push(red_semileft)
        while (i < 10) {
            i += 1
            switch (true) {
                case (i * 10 <= shipRate):
                    progressBar.push(red_bar)
                    break;
                case (i * 10 > shipRate && i * 10 <= shipRate + 10):
                    progressBar.push(mix_bar)
                    break;
                case (i * 10 > shipRate + 10):
                    progressBar.push(black_bar)
                    break;
            }
        }
        progressBar.push((shipRate >= 100) ? red_semiright : black_semiright)
        progressBar = progressBar.join('')

        const embed = new Discord.MessageEmbed()
        .setColor("#B21D50")
        .setTitle(`Shipping ${(users[0]) ? param1.username : param1} with ${(users[1]) ? param2.username : (args[1].startsWith('<@!') ? args[0] : args[1])}...`)
        .setDescription(emote + progressBar + `${shipRate}%`)
        .setFooter(footer)
        message.channel.send(embed)
            .catch(e => console.log(e))
    }
}