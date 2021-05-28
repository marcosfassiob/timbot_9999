const role = require("../commands_mod/role")

module.exports = {
    name: 'roleinfo',
    desc: 'Displays a a list of users/number of users for said role',
    usage: [
        `${process.env.PREFIX}roleinfo <role>`,
        `${process.env.PREFIX}roleinfo <roleid>`
    ],
    example: [
        `${process.env.PREFIX}roleinfo mods`,
        `${process.env.PREFIX}roleinfo 778461373726195773`
    ],
    aliases: 'roleinfo',
    perms: "None",
    execute(client, message, args, Discord) {
        
        let members = []

        let role = message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.join(' ')))
        || message.guild.roles.cache.get(args[0])  
        || message.mentions.roles.first() 
        if (role === undefined) return message.reply('I couldn\'t find that role.')

        const getRoleInfo = () => {
            members = role.members.map(m => m.user.tag)
            switch (true) {
                case (members.toString().length > 1000):
                    members = "Too many users to fit here"
                    break;
                case (members.toString().length === 0):
                    members = "Nobody..?"
                    break;
                default:
                    members = members.join('\n')
            }
        }

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        else getRoleInfo();
        
        const embed = new Discord.MessageEmbed()
        .setTitle(`List of members with ${role.name}`)
        .setColor(role.color || "#E87722")
        .setDescription(`**Role color: **\`${role.hexColor || "DEFAULT"}\``)
        .addFields(
            { name: `Members [${role.members.size}]:`, value: '```\n' + members + '```' }
        );
        
        message.channel.send(embed)
            .catch(err => console.log(err));
    }
}