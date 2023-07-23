const { SlashCommandBuilder } = require("discord.js");
const { Game } = require("../../game.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Starts an Omni4 game against another user")
        .addUserOption((user) => user.setName("opponent").setDescription("The user to start the game against").setRequired(true)),
    async execute(interaction) {
        const opponent = interaction.options.getUser("opponent");
        new Game(interaction, interaction.user, opponent);
    },
};
