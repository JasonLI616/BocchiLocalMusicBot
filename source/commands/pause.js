const{ SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the player"),
        async execute(interaction, fs, path, player) {
            try {
                //Pause the using player
                player.pause();                                                                                                                                                                                                                                                                                                                                                                                                                                  
                await interaction.reply('Paused by: ' + interaction.user.username);
            }catch (err) {
                console.error(err);
                await interaction.reply({ content: "An error occurred while executing " + interaction.commandName +" command", ephemeral: true});
            }
        },
};
