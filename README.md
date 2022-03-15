# TimBot_9999
**As of November 15, 2021, this bot has been offline, and I have ceased development since then. It was a really fun bot to work on and I learned a lot of technical skills from this.** 

A general-purpose bot with several of its own little gimmicks. What started as a passion project early February has become what it is today: a fully-fledged bot with moderation, configurability, logging and other fun commands.

[Add TimBot 9999 to your server!](https://discord.com/oauth2/authorize?client_id=807464203358830605&scope=bot&permissions=8)

[Need support for TimBot? Join this server!](https://discord.gg/q439qazkT5)

**What we have to offer:**
* Built-in, configurable chat filter (can be enabled, edited and removed).
* Built-in "alt detection" system (it just kicks members whose account age is under 15 days old).
* Built-in anti-Discord invite link system (can be enabled or disabled - more to come).
* General-purpose moderation commands (ban, kick, mute, purge, slowmode, lock, etc.).
* Audit logs for commands used, messages deleted or edited, members joining or leaving, and invites created.
* Level system (and leaderboards and ranks, too!)
* Gimmick commands - just add the bot and you'll see.

# CHANGELOG:
## June 1st update (v1.0.0):
**New commands:**
* `poll`: create a poll for people to vote on!.
* `antiad`: want to send a Discord invite link but TimBot keeps deleting it? You can now enable or disable it.
* Added ghost kick subcommand for `t.kick`.

**Quality of life:**
* Chat filter can now be enabled or disabled.
* Altinator kicks unverified bots by default.
* When typing the server prefix, the help command shows up instead of the roleinfo help panel.
* When typing TimBot's default prefix, `t.`, while the server prefix isn't the default prefix, the server's prefix will be shown.
* Reworked help command panels to be less cluttered.
* Reworked rank command embed to look a whole lot cleaner.
* Rank command now shows your rank, level and xp; it's a proper rank command now lol

## June 8th update (v1.0.1):
**Quality of life:**
* Original message is deleted before poll embed shows up.
* Rank progress bar shortened to look cleaner on mobile.
* You are now required to write a reason when using the remindme command.
* When editing or deleting messages:
    * Editsnipes and snipes now won't work on filtered words.
    * The edited message will be deleted if it includes a filtered word or if it includes more than 1000 characters.
* Timed commands are now shown in proper English.
    * "2m" will now be shown as "2 minutes".
* XP earned raised from between 5-12 to 10-25.

### June 9th hotfix (v1.0.2):
* Fixed an error making all channels viewable if the bot is added and if there is no "Muted" role.

## June 14th update (v1.1.0):
**New commands!**
* `dadjoke`: Tell a dad joke. Over 20 dad jokes added!
* `truthordare`: Truth or dare? Feeling lucky? 5 truths or dares to pick out from with your friends.
**Audit log updates:**
* Voice state updates are now logged!
    * The bot will record when a user joins, leaves or moves between voice channels.
* When a nickname is changed by someone else, the executor is logged as well.
**Quality of life:**
* XP updates:
    * XP will be rewarded when in a voice call - just join and you will earn 5 xp per minute.
    * When a user ranks up, a rankup embed will be sent as well as a message pinging the user.
* Leaderboard updates:
    * Leaderboards are now dynamic - the top 50 members are now displayed in leaderboards.
    * You can clear a specific user's stats using `lb clear [@user]`.
    * You can edit a sepcific user's stats using `lb edit <@user> <level> [xp]`
    * When resetting leaderboards, the message embed will edit itself rather than send two different embeds.
    * Leaderbaord actions are now logged.
* Usercount updates:
    * Usercount now displays the total users, members, and bots in your server.
* 8ball updates:
    * 8ball is now send in an embed.
    * 15 new 8ball lines.
* 1 new pickup line.
* Removed alias `prune` from purge command.

### June 15th hotfix (v1.1.1):
* Fixed a bug where members in voice calls were gaining more xp than intended.

## June 23rd update (v1.1.2):
**New commands!**
* `altinator`: that one pesky alt detection system can now be enabled or disabled.
**Quality of life:**
* Fixed a leaderboard bug. Sometimes, there were gaps in the leaderboard positions - they now display 'unknown user' instead of nothing.
* Added audit logging for whenever someone enables or disables `antiad`.
* Mod commands:
    * Refactored every mod command - a lot less error-prone now!
    * Members ouside of your guild can be banned using `ban` now.
        * Members outside of your guild won't know they got banned; outside-guild bans act like ghost bans.
    * `mute` command now requires a time limit.
    * Removed `purge` command aliases "clear" and "delete".
    * Time is now required for mod commands `mute`, `lock`.
    * Updated audit logs for a fresher, more compact look.
* Added one new tip.
* Fixed snipes and editsnipes not working on images/gifs/video embeds.
* Disabled @everyone and @here mentions.

### June 26th hotfix (v1.1.3)
* Fixed mute command delay.

## June 29th update (v1.1.4)
**New commands!**
`invite`: plugs the bot's invite link and my Discord server's invite link. That's it.
**Quality of life:**
* `editsnipe` and `snipe` commands:
    * Remade embeds in order to look more compact.
    * Replaced "get fucked lol" with "yours truly, `message author`".
    * `editsnipe` command only shows the original message - it would be redundant to include the edited message as well.
    * Logs removed for each command - what's the point?
* `help` commands:
    * Remade dynamic help commands to make them more compact and fit more information.
* Completely revamped `ship` command.
    * Members can now ship using two, one or no parameters.
    * Top and bottom displayed for both members.
* Attempted fix where `rank` progress bars filled up before they were meant to.
* Changed leaderboard embed title to match the number of users in the leaderboard.
    * If there are 28 entries, the leaderboard title will be "Top 28 users in `server name`"
* 4 new 8ball lines

### July 5th hotfix (v1.1.5)
* Fixed an error causing new members to not receive any xp.
* Attempted fix for extremely slow (and then fast) xp rates in voice calls.
* Slowed down xp rates for text messages - xp will be awarded every 60 seconds if the member sends a message.

## July 8th update (v1.1.6)
**New commands!**
* Remade `invite` command to track the most used invites in a server.
    * Future updates will include specific stats about an invite code and perhaps even a user.
**Quality of life:**
* Reverted update 1.1.5 and removed the voice xp rates (minus the error fixed).
    * Coding is hard. TimBot would keep offering xp even after members would leave voice channels. I'll look back into this when I feel like I can properly implement this.
* Made minor changes to the `boosters`, `ban`, `kick` and `help` commands.
* Updated `roleinfo` and `nickname` commands to separate the list of members into ten per page.
* Attempted fix for slow `mute` and `role` command executions.

### July 21st update (v1.1.7)
* Fixed a bug where replying to TimBot would send the prefix for that server - it can only be triggered now if you ping TimBot *only.*
* Fixed a bug where purge command embeds won't delete after five seconds.
