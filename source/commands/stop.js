const{ SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop playing songs"),
        async execute(interaction, fs, path, player,precmmnd) {
            await interaction.reply('Stopping player for: ' + interaction.user.username);
            try {
                //Stop previously used player
                player.stop(true);
                player.removeAllListeners();
                //make its reference null if it is not used later, it can be garbage collected
                player = null;
                await interaction.followUp({ content: 'Stopping player for: ' + interaction.user.username});
            }catch (err) {
                console.error(err);
                await interaction.reply({ content: "An error occurred while executing " + interaction.commandName +" command", ephemeral: true});
            }
        },
};
