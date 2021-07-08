const { invite_link, discord_invite_link } = require('../config.json')
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

        const result = await guildConfigSchema.findOne({ guildId: message.guild.id }, 'prefix');
        const { prefix } = result;

        /**
         * Displays the help command.
         */
        function help() {
            const embed1 = new Discord.MessageEmbed()
            .setColor("#E87722")
            .setTitle("List of commands for TimBot 9999")
            .setDescription(
                `Current prefix: \`${result.prefix}\`
                [Invite me to your server!](${invite_link})
                [Join our Discord server!](${discord_invite_link})`
            )
            .addFields(
                { name: "Fun commands:", value: fun_commands, inline: true },
                { name: "Info commands:", value: info_commands, inline: true }, 
                { name: "Mod commands:", value: mod_commands, inline: true },
                { name: "Misc. commands:", value: misc_commands, inline: true },
                { name: "Config commands:", value: config_commands, inline: true }
            )
            .setFooter(`Need additional help? Type "${result.prefix}help <command>"`)
            message.channel.send(embed1)
        }

        /**
         * Displays the command details for the specified command. "help ban"
         */
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

            let { name, desc, perms, aliases, subcommands, usage, example } = command;
            let embed5 = new Discord.MessageEmbed()
            .setColor(findColor())
            .setTitle(`${name} - ${desc}`)
            .addFields(
                { name: "Expected usage:", value: usage || "pretty self-explanatory lol" },
                { name: "Examples:", value: example || "pretty self-explanatory lol" },
                { name: "Subcommands:", value: subcommands || "None" }
            )

            try {
                var newAliases = [];
                aliases.forEach(alias => {
                    newAliases.push(`\`${alias}\``);
                })
                newAliases = newAliases.join(', ');
            } catch (err) {
                console.log(err)
            } finally {
                embed5.setDescription(`**Required permissions: **\`${perms}\`\n**Aliases: **${newAliases}`);
                message.channel.send(embed5).catch(err => console.log(err));
            }
        }
        
        if (!args[0] && message.content.startsWith(`${prefix}help`) || message.content === `${prefix}`) help()
        else if (!message.content.startsWith(`${prefix}help`)) helpPrompt()
        else if (!client.commands.has(args[0]) && !client.commands.find(a => a.aliases && a.aliases.includes(args[0].toLowerCase()))) {
            return message.reply(`\`${args.join(' ')}\` is not a valid command.`)
        } else helpPrompt()
    } 
}  