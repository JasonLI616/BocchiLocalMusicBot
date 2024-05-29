const{ SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addalbum')
        .setDescription("Add an album to the database")
        .addStringOption(option =>
            option.setName('album')
                .setDescription("The name of the album")
                .setRequired(true)),
    async execute(interaction, fs, path) {
        try {
            // Get the album name
            const album = String(interaction.options.getString("album"));
            // Read the file
            path = "./txts/albums.txt";
            var album_list = fs.readFileSync(path, 'utf8');
            // Check if the album is already in the list
            
            if (album_list.includes(album)) {
                await interaction.reply({ content: `The album **${album}** is already in the list`, ephemeral: true });
                return;
            }
            // Add the album to the list
            album_list += album + "\n";
            fs.writeFileSync(path, album_list);
            await interaction.reply({ content: `The album **${album}** has been added to the list`, ephemeral: true });

        } catch (err) {
            console.error(err);
            await interaction.reply({ content: "An error occurred while executing " + interaction.commandName + " command", ephemeral: true });
        }
    }


};