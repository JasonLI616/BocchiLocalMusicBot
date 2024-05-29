const{ SlashCommandBuilder, Embed, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createAudioResource } = require("@discordjs/voice");
const { dir } = require("../config.json");
const download = require('image-downloader');
var requestify = require('requestify');
var jmespath = require('jmespath');

// key and secret for discogs api
const key = 'zTLBeTAaoWIEJFopPpkB';
const secret = 'YkvAgbLhSpbZkgGuYeaeipKrMOPsFcWc';
const tmpPath = '../../source/tmp/cover.jpg'
var info;
var genre;
var country;
var year;
var style;
var cover_url;
var label;
var artist;
var release;
var embed;
var query;

var data;
var selection;
var playlist;
var musicDir;
var fileData = [];
var idxPl = 0;
var isPlaylist = [];
var localResource;
var song = {
    "title": "untitled",
    "url": "non url"
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription("Play songs of a selected album")
        // .addStringOption(audioFolderSearch =>
        //     audioFolderSearch
        //         .setName("album_selection")
        //         .setDescription("Album to select from")
        //         .setMaxLength(300)
        //         //.setRequired(true)
        //         .addChoices(
        //             {name: "結束バンド", value: "結束バンド_結束バンド - 結束バンド(2022)[flac]"},
        //             {name: "青春コンプレックス", value: "結束バンド_結束バンド - 青春コンプレックス(2022)[flac]"},
        //             {name: "Hollywoods Bleeding", value: "Post Malone_Post Malone - Hollywood's Bleeding"},
        //         ))
        .addStringOption(option =>
            option.setName('artist_name')
                .setDescription('Artist\'s name to search for')
                .setAutocomplete(true)
                .setRequired(true)
                )
        .addStringOption(option =>
            option.setName('album_name')
                .setDescription('Album\'s name to search for')
                .setAutocomplete(true))  
        .addBooleanOption(option =>
            option.setName('shuffle')
                .setDescription('Whether or not the chosen playlist be shuffled')),
        async execute(interaction, fs, path, player, precmmnd, client) {
            const channelid = client.channels.cache.get(interaction.channelId);
            //get selection
            //selection = interaction.options.getString("album_selection");
            var album = 'x';
            var album_new = album;
            try{
                info = selection.split("-");
                album_new = interaction.options.getString("album_name").trim();
                album = data[1].trim();
            }catch (err) {

            }
            console.log('selction is: ' + selection);
            console.log(interaction.options.getString("album_name"));
            if (selection === undefined || !(album === album_new)) { //selection && selection.trim().length > 0
                idxPl = 0;
                if (interaction.options.getString("artist_name") != null && interaction.options.getString("album_name") != null) {
                    selection = interaction.options.getString("artist_name").replace(/[\r\n]/gm, '') + '_' + interaction.options.getString("album_name").replace(/[\r\n]/gm, '');
                }
                await interaction.reply('Now Playing for ' + interaction.user.username + '\nselection: '+ selection);

                isPlaylist = [];
                musicDir = null;
                console.log('[Searching Local Files]');
                const artistDirArr = selection.split("_");
                console.log('artistDirArr: ' + artistDirArr);
                //console.log('playListStart: ' + isPlaylist);
                //full path to audio files
                isPlaylist.push(dir, "\\", artistDirArr[0], "\\", artistDirArr[1]);
                musicDir = path.normalize(isPlaylist.join(""));
                console.log('musicDir: '+ musicDir);
                songInfo = musicDir.split("\\");
                songName = songInfo[3].split("(");
                album = songName[0].replace(/^[ \t]+|[ \t]+$/, '');
                if (album === "結束バンド - 青春コンプレックス") {
                    album = "青春コンプレックス";
                }
                console.log('album: '+ album);
                isPlaylist = [];
                //check for files only, ignore everything else
                const isAudioFile = fileName => {
                    //return fs.lstatSync(fileName).isFile();
                    return fileName.endsWith("flac") || fileName.endsWith("mp3");
                }
                isPlaylist.push(
                    fs.readdirSync(musicDir).map(fileName => {
                        return path.join(musicDir, fileName)
                    }).filter(isAudioFile)
                );
            
                //console.log('isPlaylistFinal: ' + isPlaylist);
                //list of audio files not empty?
                if (isPlaylist != null) {
                    //files present separate them using comma
                    isPlaylist = isPlaylist.toString().split(",");
                }
                
                //shuffle isPlaylist based on the user's option
                if (interaction.options.getBoolean("shuffle") && idxPl === 0) {
                    isPlaylist = shuffle(isPlaylist);
                    console.log("\nshuffled!\n");
                }
                console.log('loading requestify...');
                try {
                    // requestify.get('https://api.discogs.com/database/search?q='+ album +'&per_page=3&page=1&key=' + key + '&secret=' + secret)
                    //     .then(function(response) {
                    //         // Get the response body (JSON parsed or jQuery object for XMLs)
                    //         response.getBody();
                    //         //console.log(response);
                    //         info = response.body;
                    //         //console.log(info);
                    //     }
                    // );
                    
                    // console.log('https://api.discogs.com/database/search?q='+ album +'&per_page=3&page=1&key=' + key + '&secret=' + secret);
                    let response = await requestify.get('https://api.discogs.com/database/search?type=release&q='+ album +'&per_page=3&page=1&key=' + key + '&secret=' + secret);
                    // Get the response body (JSON parsed or jQuery object for XMLs)
                    response.getBody();
                    //console.log(response);
                    info = response.body;
                    //console.log(info);
                
                    //setTimeout(function(){
                        console.log('Loading response...');
                        data = JSON.parse(info);
                        cover_url = jmespath.search(data, "results[0].cover_image");
                        year = jmespath.search(data, "results[0].year");
                        title = jmespath.search(data, "results[0].title");
                        country = jmespath.search(data, "results[0].country");
                        if (country === 'Unknown') {
                            country = jmespath.search(data, "results[1].country");
                        }
                        genre = jmespath.search(data, "results[0].genre");
                        style = jmespath.search(data, "results[0].style");
                        genre_content = "";
                        style_content = "";
                        if (genre.length > 0) {
                            genre.forEach(element => genre_content = genre_content + element + ", ");
                        }
                        genre_content = genre_content + "\n";
                        style.forEach(element => style_content = style_content + element + ", ");
                        style_content = style_content + "\n";
                        label = jmespath.search(data, "results[0].label");
                        songtitle = title.split("-");
                        artist = songtitle[0].replace(/^[ \t]+|[ \t]+$/, '');
                        release = songtitle[1].replace(/^[ \t]+|[ \t]+$/, '');
                        query = "https://www.discogs.com/search/?q=" + artist + "-" + release.replace(/\s/g, "%20");
                        console.log(query);
                        // console.log(cover_url);
                        // console.log(year);
                        // console.log(title);
                        // console.log(artist);
                        // console.log(release);
                        // console.log(country);
                        // console.log(genre);
                        // console.log(style);
                        // console.log(label[0]);
                        await download.image({
                            url: cover_url,
                            dest: tmpPath
                        });
                        
                        //console.log(info);
                    //}, 2000);
                    
                    //setTimeout(function(){
                        const attachment = new AttachmentBuilder('./tmp/cover.jpg');
                        if (title.length <50) {
                            embed =  new EmbedBuilder()
                                .setTitle("Now playing")
                                .setDescription("`Information of the album`")
                                .setColor(0xf19fba)
                                .setImage('attachment://cover.jpg')
                                .setThumbnail('attachment://cover.jpg')
                                .setTimestamp(Date.now())
                                .setAuthor({
                                    //iconURL: interaction.user.displayAvatarURL(),
                                    iconURL: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Discogs_logo.png",
                                    //name: interaction.user.tag,
                                    name: "Discogs",
                                    url: query.replace(/\s/g, "%20")
                                })
                                .addFields(
                                    { name: '_Artist_', value: artist, inline: true},
                                    { name: '_Release_', value: release, inline: true},
                                    { name: ' ', value: ' '},
                                    { name: '_Year_', value: year, inline: true},
                                    { name: '_Country_', value: country, inline: true},
                                    { name: '_Label_', value: label[0], inline: true},
                                    { name: ' ', value: ' '},
                                    
                                    //{ name: '', value: ''},
                                )
                                .addFields(
                                    { name: '_Genre_', value: genre_content, inline: true},
                                    { name: '_Style_', value: style_content, inline: true},
                                )
                                .setFooter({
                                    //iconURL: client.user.displayAvatarURL(),
                                    iconURL: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Discogs_logo.png",
                                    text: "Powered by discogs.com",
                                });
                            interaction.followUp({
                                embeds: [embed],
                                files: [attachment]
                            });
                        }
                        
                    //}, 3500);

                } catch(err) {
                    console.error(err);
                    // interaction.followUp({content: "Cannot find the information of the selected album"});
                }
               
                
               
                
                //await interaction.deleteReply();
            }else {
                console.log("\nalready exist a selection");
                fileData = [];
                //Read selection and idxPl from file
                fs.readFileSync("./vars", "utf-8")
                    .split(/\r?\n/)
                    .forEach(function(line) {
                        fileData.push(line);
                    });
                selection = fileData[0];
                isPlaylist = fileData[1].toString().split(",");;
                idxPl = parseInt(fileData[2]) + 1;
                console.log('selection: ' + selection);
                //console.log('idxSkip: ' + (idxPl-1));
                title = isPlaylist.at(idxPl-1).toString().substring(dir.length+1, isPlaylist[idxPl-1].toString().length);
                info = title.split("\\");
                try {
                    await interaction.editReply('Now Playing for ' + interaction.user.username + '\nselection: '+ selection);
                }
                catch (err) {
                    await interaction.reply('Now Playing for ' + interaction.user.username + '\nselection: '+ selection);
                }
                
                if (idxPl == isPlaylist.length-1) {
                    await interaction.followUp({ content: 'Already playing last song: '+ info[0] + '-' + info[2] + ', skipping will stop the player'});
                } 
            }
            
            // isPlaylist.forEach(file => console.log(file));
            // show content of the queue on console
            console.log("Current queue:");
            cnt = 1;
            for (let i = idxPl;i<isPlaylist.length;i++) {
                songName = isPlaylist[i].split("\\");
                if (cnt===1) {
                    console.log(cnt+ ". " + songName[4] + " <===");
                } else {
                    console.log(cnt+ ". " + songName[4]);
                }
                cnt = cnt + 1;
            }
            //tell player to start playing at the indicated index
            try {
                title = isPlaylist.at(idxPl).toString().substring(dir.length+1, isPlaylist[idxPl].toString().length);
                //console.log(isPlaylist);
                info = title.split("\\");
                if (idxPl < isPlaylist.length) {
                    // if (precmmnd === 'skip') {
                    //     await interaction.reply({ content: 'Now playing song: ' + info[0] + '-' + info[2] + '\nfor ' + interaction.user.username});
                    // } else {
                    //     await interaction.editReply({ content: 'Now playing song: ' + info[0] + '-' + info[2] + '\nfor ' + interaction.user.username});
                    // }

                    //await interaction.editReply({ content: 'Now playing song: ' + info[0] + '-' + info[2] + '\nfor ' + interaction.user.username});
                    
                    play(interaction, fs, isPlaylist, idxPl, player, channelid);
                }else {
                    isPlaylist = [];
                    idxPl = 0;

                }
            }catch(err) {
                console.error(err);
            }
        },
        async autocomplete(interaction, fs) {
            const focusedOption = interaction.options.getFocused(true);
            let choices_artist = [];
            let choices_album = [];
            
            //Read names of artists and albums from txt files
            if (focusedOption.name === 'artist_name' && focusedOption.value === "") {
                fs.readFileSync("./txts/artists.txt", "utf-8")
                .split('\n')
                .filter(line => line.trim() !== '') // filter out empty lines
                .forEach(function(line) {
                    choices_artist.push(line);
                });
                console.log(choices_artist);
                await interaction.respond(choices_artist.map(choice => ({ name: choice, value: choice })));
            
            } else if (focusedOption.name === 'artist_name') {
                fs.readFileSync("./txts/artists.txt", "utf-8")
                .split('\n')
                .filter(line => line.trim() !== '') // filter out empty lines
                .forEach(function(line) {
                    choices_artist.push(line);
                });
                const filtered = choices_artist.filter(choice => choice.includes(focusedOption.value));
                console.log(filtered);
                await interaction.respond(
                    filtered.map(choice => ({ name: choice, value: choice })),
                );
            } else if (focusedOption.name === 'album_name') {
                fs.readFileSync("./txts/albums.txt", "utf-8")
                .split('\n')
                .filter(line => line.trim() !== '') // filter out empty lines
                .forEach(function(line) {
                    choices_album.push(line);
                });
                choices = choices_album.filter(choice => choice.includes(interaction.options.getString("artist_name").replace(/[\r\n]/gm, '')));
                choices.forEach(file => console.log(file));
                console.log(interaction.options.getString("artist_name"));
                const filtered = choices.filter(choice => choice.includes(focusedOption.value));
                await interaction.respond(
                    filtered.map(choice => ({ name: choice, value: choice })),
                );
            }
            
        },
};

//start audio files
function play(interaction, fs, playlist, idxPl, player, channel) {
    //ignore empty Playlist
    if (!playlist) {
        return;
    }else {
        try {
            //write selection and idxPl variables to file
            data = selection + '\n' + playlist + '\n' + idxPl;
            fs.writeFile("./vars", data, (err) => {
                if (err) console.log(err);
                //console.log('Written: ' + data + ' to file');
            });
            //root Dir
            const rootDir = dir;
            //show name of audio file
            song['title'] = playlist.at(idxPl).toString().substring(rootDir.length+1, playlist[idxPl].toString().length);
            song['url'] = playlist.at(idxPl).toString();
            //full path to the file being played
            console.log('Accessing file: '+ song.title);
            info = song.title.split("\\");
            display = 'Now playing song: ' + info[0] + '-' + info[2] + '\nfor ' + interaction.user.username
            // try {
            //     interaction.editReply({ content: display});
            // }
            // catch (err) {
            //     interaction.reply({ content: display});
            // }
            
            channel.send({ content: display})
            // interaction.editReply({ content: display});
            //console.log("channel= " + channel);
            //channel.send(display);
            //create audioResource from audio file
            localResource = createAudioResource(song.url);
            //tell player to play audioResource
            player.stop(true);
            player.removeAllListeners();
            player.play(localResource);
            //player finishes playing then do
            player.on("idle", () => {
                player.removeAllListeners();
                //play until last file
                if (idxPl < isPlaylist.length - 1) {
                    //play next audio file in the playlist
                    idxPl = idxPl + 1;
                    // show content of the queue on console
                    console.log("Current queue:");
                    cnt = 1;
                    for (let i = idxPl;i<isPlaylist.length;i++) {
                        songName = isPlaylist[i].split("\\");
                        if (cnt===1) {
                            console.log(cnt+ ". " + songName[4] + " <===");
                        } else {
                            console.log(cnt+ ". " + songName[4]);
                        }
                        cnt = cnt + 1;
                    }
                    play(interaction, fs, playlist, idxPl, player, channel);
                }else {
                    //no more audio file are available, so finish player subscription
                    player.unsubscribe();
                    isPlaylist = [];
                    idxPl = 0;
                }
            });

            //show an error msg when player fails
            player.on("error", () => {
                player.removeAllListeners();
                console.log('Player has failed');
            });
        }catch (err) {
            //show error on console to review it
            console.log(err);
        }
    }
}

function shuffle(arr) {
    for (let i=arr.length-1;i>0;i--) {
        const j = Math.floor(Math.random()*(i+1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}