const{ SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addartist')
        .setDescription("Add an artist to the database")
        .addStringOption(option =>
            option.setName('artist')
                .setDescription("The name of the artist")
                .setRequired(true)),
    async execute(interaction, fs, path) {
        try {
            // Get the artist name
            const artist = String(interaction.options.getString("artist"));
            // Read the file
            path = "./txts/artists.txt";
            var artist_list = fs.readFileSync(path, 'utf8');
            // Check if the artist is already in the list
            
            if (artist_list.includes(artist)) {
                await interaction.reply({ content: `The artist **${artist}** is already in the list`, ephemeral: true });
                return;
            }
            // Add the artist to the list
            artist_list += artist + "\n";
            fs.writeFileSync(path, artist_list);
            await interaction.reply({ content: `The artist **${artist}** has been added to the list`, ephemeral: true });

        } catch (err) {
            console.error(err);
            await interaction.reply({ content: "An error occurred while executing " + interaction.commandName + " command", ephemeral: true });
        }
    }


};