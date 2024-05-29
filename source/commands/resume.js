const{ SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the player"),
        async execute(interaction, fs, path, player) {
            try {
                //Resume the using player
                player.unpause();
                await interaction.reply('Resuming by: ' + interaction.user.username);
                
            }catch (err) {
                console.error(err);
                await interaction.reply({ content: "An error occurred while executing " + interaction.commandName +" command", ephemeral: true});
            }
        },
};

