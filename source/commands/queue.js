const{ SlashCommandBuilder, Embed, EmbedBuilder, Discord, AttachmentBuilder } = require("discord.js");
var fileData = [];
//const tmpPath = "attachment://F:/LocalMusicBot/source/tmp/cover.jpg";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Display the current playlist"),
        async execute(interaction, fs, path, player, precmmnd, client) {
            try {
                //Get the current playlist from var file(reply method)
                // fs.readFileSync("./vars", "utf-8")
                //     .split(/\r?\n/)
                //     .forEach(function(line){
                //         fileData.push(line);
                //     });
                // playlist = fileData[1].toString().split(",");
                // idxPl = parseInt(fileData[2]);
                // replyMsg = "";
                // cnt = 1;
                // for (let i = idxPl-1;i<playlist.length;i++) {
                //     if (cnt === 1) {
                //         replyMsg = replyMsg + cnt + ". " + playlist[i] + " <===\n";
                //     }else {
                //         replyMsg = replyMsg + cnt + ". " + playlist[i] + "\n";
                //     }
                //     cnt = cnt + 1;
                // }
                // await interaction.reply({content: replyMsg});

                //Get the current playlist from var file(embed method)
                //trim whitespace at front and back
                //result = text.replace(/^[ \t]+|[ \t]+$/, '');
                const attachment = new AttachmentBuilder('./tmp/cover.jpg');
                var embed =  new EmbedBuilder()
                    .setTitle("Queue")
                    .setDescription("`This is the content of current playlist`")
                    .setColor(0xf19fba)
                    //.setThumbnail(client.user.displayAvatarURL())
                    .setThumbnail('attachment://cover.jpg')
                    .setTimestamp(Date.now())
                    .setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: interaction.user.tag
                    })
                    .setFooter({
                        iconURL: client.user.displayAvatarURL(),
                        text: client.user.tag
                    })
                fileData = [];
                fs.readFileSync("./vars", "utf-8")
                    .split(/\r?\n/)
                    .forEach(function(line){
                        fileData.push(line);
                    });
                playlist = fileData[1].toString().split(",");
                idxPl = parseInt(fileData[2]);
                //console.log(idxPl);
                cnt = 1;
                replyMsg = "";
                for (let i = idxPl;i<playlist.length;i++) {
                    songInfo = playlist[i].split("\\");
                    songName = songInfo[4].split(".flac");
                    songName = songName[0].split("-");
                    song = songName[1].replace(/^[ \t]+|[ \t]+$/, '');
                    n = 2;
                    while (songName[n] != undefined) {
                        song = song + songName[n];
                        n = n + 1;
                    }
                    songName = songInfo[3].split("(");
                    artistAlbum = songName[0].split("-");
                    artist = artistAlbum[0].replace(/^[ \t]+|[ \t]+$/, '');
                    if (cnt === 1) {
                        replyMsg = replyMsg + "0" + cnt + ". " + artist + " - " + song + "\t\:arrow_left:\n";
                    }else if (cnt < 10){
                        replyMsg = replyMsg + "0" + cnt + ". " + artist + " - " + song + " \n";
                    } else {
                        replyMsg = replyMsg + cnt + ". " + artist + " - " + song + " \n";
                    }
                    cnt = cnt + 1;
                }
                songInfo = playlist[0].split("\\");
                songName = songInfo[3].split("(");
                artistAlbum = songName[0].split("-");
                album = artistAlbum[1].replace(/^[ \t]+|[ \t]+$/, '')
                embed.addFields({name: album, value: replyMsg, inline: true});
                await interaction.reply({
                    embeds: [embed],
                    files: [attachment]
                });
            }catch (err) {
                console.error(err);
                await interaction.reply({ content: "An error occurred while executing " + interaction.commandName +" command", ephemeral: true});
            }
        },
};
