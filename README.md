# Omni4 Discord Bot

This is an implementation of the Omni4 game as a discord bot.

## Omni4

Omni4 is a variation of Connect 4, but instead of only allowing straight lines and diagonals
it allows lines in any direction (omnidirectional, hence the name).

Below is a reference sheet of what counts as a 4-long line:

![Omni4 Reference Sheet](https://cdn.discordapp.com/attachments/530358696505769985/1132966961127624784/omni4-reference-sheet.png)

## How to play

To play it, you can either [add my bot to your server](https://discord.com/api/oauth2/authorize?client_id=1132948341542637609&permissions=10304&scope=bot), or host it on your bot.

You can start a game with `/omni4 <opponent>`, or you can specify yourself as the opponent to play against yourself

## Hosting yourself

To host it on your own bot, you will need to install [node.js](https://nodejs.org).

1. Clone the repository with `git clone https://github.com/SimonDMC/omni4` or download the code
2. Add a file called config.json in the root directory as below and add the bot token and application id (which can be found in the General Information tab of your discord application)

```json
{
    "token": "your bot token here",
    "clientId": "your application id here"
}
```

3. Open a command prompt in the root of the project and run the following commands:

```sh
npm i
node ./deploy_commands.js
node ./index.js
```

After that, your bot should go online.
