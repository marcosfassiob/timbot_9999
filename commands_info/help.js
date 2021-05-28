const { invite_link } = require('../config.json')
const guildConfigSchema = require('../schemas/guild-config-schema')

module.exports = {
    name: 'help',
    aliases: [
        'help', 
        'commands', 
        'cmds'
    ],
    usage: [
        `${process.env.PREFIX}help [command]`, 
    ],
    perms: "None",
    desc: 'Displays a list of commands',
    async execute(client, message, args, Discord) {
    
        const info_commands = client.commands_info.map(c => `\`${c.name}\``).join(' ');
        const fun_commands = client.commands_fun.map(c => `\`${c.name}\``).join(' ');
        const mod_commands = client.commands_mod.map(c => `\`${c.name}\``).join(' ');
        const misc_commands = client.commands_misc.map(c => `\`${c.name}\``).join(' ');
        const config_commands = client.commands_config.map(c => `\`${c.name}\``).join(' ');

        const loadedPrefix = await guildConfigSchema.findOne({ guildId: message.guild.id }, 'prefix');
        const { prefix } = loadedPrefix;

        function help() {
            const embed1 = new Discord.MessageEmbed()
            .setColor("#E87722")
            .setTitle("Invite TimBot 9999 to your server!")
            .setURL(invite_link)
            .setDescription(`Current prefix: \`${loadedPrefix.prefix}\`\nNeed additional help? Type \`${loadedPrefix.prefix}help <command>\``)
            .addFields(
                { name: "Fun commands:", value: fun_commands, inline: true },
                { name: "Info commands:", value: info_commands, inline: true }, 
                { name: "Mod commands:", value: mod_commands, inline: true },
                { name: "Misc. commands:", value: misc_commands, inline: true },
                { name: "Config commands:", value: config_commands, inline: true }
            )
            message.channel.send(embed1)
        }

        function helpPrompt() {
            const cmd = client.commands.get(message.content.slice(prefix.length).toLowerCase())
            || client.commands.get(args[0])
            || client.commands.find(a => a.aliases && a.aliases.includes(args[0] || message.content.slice(prefix.length)))
            const command = client.commands.get(cmd.name, cmd)
            let color;

            const findColor = () => {
                switch (true) {
                    case (client.commands_mod.has(cmd.name || cmd.aliases)):
                        color = "#861F41"
                        break;
                    case (client.commands_fun.has(cmd.name || cmd.aliases)):
                        color = "#C64600"
                        break;
                    case (client.commands_info.has(cmd.name || cmd.aliases)):
                        color = "#E87722"
                        break;
                    case (client.commands_misc.has(cmd.name || cmd.aliases)):
                        color = "#003C71"
                        break;
                    default:
                        color = "#642667"
                        break;
                }
                return color;
            }

            const embed5 = new Discord.MessageEmbed()
            .setColor(findColor())
            .setTitle(`About ${command.name}`)
            .setDescription(`**Description:** ${command.desc}\n**Usage:** Do not include any hooks like **<>** (required) or **[]** (optional) in your messages`)
            .addFields(
                { name: "Expected usage:", value: command.usage, inline: true },
                { name: "Examples:", value: (command.example !== undefined) ? command.example : "pretty self-explanatory", inline: true },
                { name: "Aliases:", value: command.aliases, inline: true },
                { name: "Required permissions: ", value: command.perms },
                { name: "Subcommands:", value: (command.subcommands === undefined) ? "None" : command.subcommands },  
            )
            message.channel.send(embed5)
        }
        
        if (!args[0] && message.content.startsWith(`${loadedPrefix.prefix}help`) || message.content === `${prefix}`) help()
        else if (!message.content.startsWith(`${prefix}help`)) helpPrompt()
        else if (!client.commands.has(args[0]) && !client.commands.find(a => a.aliases && a.aliases.includes(args[0].toLowerCase()))) {
            return message.reply(`\`${args.join(' ')}\` is not a valid command.`)
        } else helpPrompt()
    } 
}  