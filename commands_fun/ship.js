const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'ship',
    aliases: ['ship'],
    usage: [
        `${process.env.PREFIX}ship`,
        `${process.env.PREFIX}ship [anything] [anything]`,
    ],
    example: [
        `${process.env.PREFIX}ship`,
        `${process.env.PREFIX}ship timbot bestbot`,
        `${process.env.PREFIX}ship <@738918188376391712> <@733085479590690847>`,
        `${process.env.PREFIX}ship Subaru <@738918188376391712>`,
    ],
    perms: "None",
    desc: 'Ships two users together',
    async execute(client, message, args, Discord) {

        const { guild, channel, member, mentions } = message;
        const guildMembers = guild.members.cache.array();
        const memberAmount = guild.members.cache.size;
        const n = Math.floor(Math.random() * memberAmount);
        
        /**
         * Returns the ship rate of a specific word
         * @param {String} word 
         * @returns {Number}
         */
        function shipString(word) {
            let shipRate = 0;
            for (let i = 0; i < word.length; i++) {
                switch(true) {
                    case word.substring(i).match(/[a-f]/i):
                        shipRate += 1003;
                        break;
                    case word.substring(i).match(/[g-m]/i):
                        shipRate += 2535;
                        break;
                    case word.substring(i).match(/[m-z]/i):
                        shipRate += 5017;
                        break;
                    case word.substring(i).match(/^\d/i):
                        shipRate += 3589;
                        break;
                    default:
                        shipRate += 81;
                        break;
                }
            }
            return shipRate;
        }

        /**
         * Determines the ship rate between two random users.
         * @param {Snowflake} paramOne
         * @param {Snowflake} paramTwo
         * @returns {Array}
         */
        function ship_none(paramOne, paramTwo) {
            paramOne = {
                rate: paramOne.user.id,
                name: paramOne.user.tag
            }
            paramTwo = {
                rate: paramTwo.user.id,
                name: paramTwo.user.tag
            }
            const shipRate = (parseInt(paramOne.rate) * parseInt(paramTwo.rate)).toString();
            shipRate = parseInt(shipRate.substring(shipRate.length - 1, shipRate.length));
            return [shipRate, paramOne, paramTwo];
        }

        /**
         * Ships the message author with something
         * @param {Snowflake} paramOne 
         * @param {String} paramTwo 
         * @returns {Array}
         */
        async function ship_one(paramOne, paramTwo) {
            try {
                paramOne = {
                    rate: paramOne.user.id,
                    name: paramOne.user.tag
                }
                paramTwo = mentions.members.first() || await guild.members.fetch(paramTwo);
                paramTwo = {
                    rate: paramTwo.user.id,
                    name: paramTwo.user.tag
                }
            } catch (err) {
                if (err instanceof DiscordAPIError) {
                    if (err.code === 50035) { //value not snowflake
                        paramTwo = {
                            rate: shipString(paramTwo),
                            name: paramTwo
                        }
                    } else {
                        console.log(err);
                    }
                } else {
                    console.log(err);
                }
            } finally {
                const shipRate = (parseInt(paramOne.rate) * parseInt(paramTwo.rate)).toString();
                shipRate = parseInt(shipRate.substring(shipRate.length - 1, shipRate.length));
                return [shipRate, paramOne, paramTwo];
            }           
        }

        async function ship_both(paramOne, paramTwo) {
            try {
                paramOne = mentions.members.first() || await guild.members.fetch(paramOne);
                paramOne = {
                    rate: paramOne.user.id,
                    name: paramOne.user.tag
                }
            } catch (err) {
                if (err instanceof DiscordAPIError) {
                    if (err.code === 50035) { //value not snowflake
                        paramOne = {
                            rate: shipString(paramOne),
                            name: paramOne
                        };
                    } else {
                        console.log(err);
                    }
                } else {
                    console.log(err);
                }
            }

            try {
                paramTwo = mentions.members.first(2)[1] || await guild.members.fetch(paramTwo);
                paramTwo = {
                    rate: paramTwo.user.id,
                    name: paramTwo.user.tag
                }
            } catch (err) {
                if (err instanceof DiscordAPIError) {
                    if (err.code === 50035) { //value not snowflake
                        paramTwo = {
                            rate: shipString(paramTwo),
                            name: paramTwo
                        };
                    } else {
                        console.log(err);
                    }
                } else {
                    console.log(err);
                }
            }            
            const shipRate = (parseInt(paramOne.rate) * parseInt(paramTwo.rate)).toString();
            shipRate = parseInt(shipRate.substring(shipRate.length - 1, shipRate.length));
            return [shipRate, paramOne, paramTwo];
        }

        /**
         * Sets up the embed with the ship rate and both users being shipped
         * @param {Number} shipRate 
         * @param {Object} userOne
         * @param {Object} userTwo
         */
        async function ship(array) {
            const shipRate = array[0];
            const paramOne = array[1];
            const paramTwo = array[2];

            const black_bar = '<:bar_black:830166406057164810>';
            const red_bar = '<:bar_red:830166421463629924>';
            const mix_bar = '<:bar_blackandred:830167809639579651>';

            const black_semiright = '<:semicircle_black_right:830166436462592000>';
            const red_semileft = '<:semicircle_red_left:830166539935678515>';
            const red_semiright = '<:semicircle_red_right:830166473875128331>';

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
            let progressBar = [red_semileft];
            for (let i = 1; i < 11; i++) {
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
            progressBar.push((shipRate >= 100) ? red_semiright : black_semiright);
            progressBar = progressBar.join(''); 

            //finally, the fucking ship embed
            const shipEmbed = new Discord.MessageEmbed()
            .setColor("#B21D50")
            .setTitle(`${paramOne.name} x ${paramTwo.name}...`)
            .setDescription(`${emote}${progressBar}${shipRate}%\n\n⬇️ \`${paramOne.name}\`\n⬆️ \`${paramTwo.name}\``)
            .setFooter(footer)
            try {
                channel.send(shipEmbed)
            } catch (err) {
                console.log(err);
            }
        }

        if (!args[0]) {
            ship(ship_none(member, guildMembers[n]));
        } else if (!args[1]) {
            ship(await ship_one(member, args[0]));
        } else {
            ship(await ship_both(args[0], args[1]));
        }     
    }
}