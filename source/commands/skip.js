const{ SlashCommandBuilder } = require("discord.js");
const { dir } = require("../config.json");
var fileData = [];
var playlist = [];
var idxPl = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip current song"),
        async execute(interaction, fs, path, player, precmmnd, client) {
            //await interaction.reply({content: 'Skipping song for '+ interaction.user.username, ephemeral: true});
            //interaction.channel.send('Skipping song for: ${interaction.user.username}');
            const command = precmmnd;

            if(!command) {
                console.error('Command '+ interaction.commandName +' was not found');
                return;
            }
            try {
                //Stop previously used player
                player.stop(true);
                player.removeAllListeners();
                //make its reference null if it is not used later, it can be garbage collected
                //player = null;
                //Execute play command from skip command
                fileData = [];
                //Read selection and idxPl from the file
                fs.readFileSync("./vars", "utf-8")
                    .split(/\r?\n/)
                    .forEach(function(line){
                        fileData.push(line);
                    });
                //console.log("filedata:"+fileData);
                playlist = fileData[1].toString().split(",");
                idxPl = parseInt(fileData[2]) + 1;
                title = playlist.at(idxPl-1).toString().substring(dir.length+1, playlist[idxPl-1].toString().length);
                info = title.split("\\");
                if(idxPl < playlist.length) {
                    await interaction.reply({ content: 'Skipping song: ' + info[0] + '-' + info[2] +'\nfrom ' + interaction.user.username});
                    // display = 'Skipping song: ' + info[0] + '-' + info[2] +'\nfrom ' + interaction.user.username;
                    // channel.send(display);
                    
                    //console.log(command);
                    await command.execute(interaction, fs, path, player, precmmnd, client);
                }else {
                    await interaction.reply({ content: 'Cannot find any song in the remaining playlist', ephemeral: true});
                }
            }catch (err) {
                console.error(err);
                await interaction.reply({ content: "An error occurred while executing " + interaction.commandName +" command", ephemeral: true});
            }
        },
};