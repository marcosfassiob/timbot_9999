const fs = require('fs');
module.exports = (client) => {

    const infoCommandFiles = fs.readdirSync('./commands_info').filter(file => file.endsWith('.js'));
    for (const file of infoCommandFiles) {
        const command = require(`../commands_info/${file}`);
        client.commands.set(command.name, command);   
        client.commands_info.set(command.name, command);   
    }
    
    const funCommandFiles = fs.readdirSync('./commands_fun').filter(file => file.endsWith('.js'));
    for (const file of funCommandFiles) {
        const command = require(`../commands_fun/${file}`);
        client.commands.set(command.name, command);   
        client.commands_fun.set(command.name, command);   
    }

    const closedCommandFiles = fs.readdirSync('./commands_mod').filter(file => file.endsWith('.js'));
    for (const file of closedCommandFiles) {
        const command = require(`../commands_mod/${file}`);
        client.commands.set(command.name, command);   
        client.commands_mod.set(command.name, command);
    }

    const miscCommandFiles = fs.readdirSync('./commands_misc').filter(file => file.endsWith('.js'));
    for (const file of miscCommandFiles) {
        const command = require(`../commands_misc/${file}`);
        client.commands.set(command.name, command);   
        client.commands_misc.set(command.name, command);
    }

    const configCommandFiles = fs.readdirSync('./commands_config').filter(file => file.endsWith('.js'));
    for (const file of configCommandFiles) {
        const command = require(`../commands_config/${file}`);
        client.commands.set(command.name, command);   
        client.commands_config.set(command.name, command);
    }
}