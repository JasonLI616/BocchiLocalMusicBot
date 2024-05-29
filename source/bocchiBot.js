//Load Natice File System Module
const fs = require("node:fs");
//Load Native Path Utility Module
const path = require("node:path");
//discordjs client
const {Client, Events, Collection, GatewayIntentBits} = require("discord.js");
const { token } = require("./config.json");
//create client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]});
//Instantiate a Collection (map) to load commands
client.commands = new Collection();
const cmmndsPath = path.join(__dirname, "commands");
const cmmndFiles = fs.readdirSync(cmmndsPath).filter(file => file.endsWith(".js"));
var precmmnd;
for (const file of cmmndFiles) {
    const filePath = path.join(cmmndsPath, file);
    const cmmnd = require(filePath);
    if ("data" in cmmnd && "execute" in cmmnd) {
        client.commands.set(cmmnd.data.name, cmmnd);
    }else {
        console.log('Command at ' + filePath + ' is missing required "data" or "execute" property');
    }
}
//Discordvoice
const { createAudioPlayer } = require("@discordjs/voice");
const { joinVoiceChannel } = require("@discordjs/voice");
var player = createAudioPlayer();
//When bot is online, show msg to the console
client.once(Events.ClientReady, c => {
    //console.log("Bocchi the Rock!\n ");
    
    console.log("⢸⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⢸\n⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⣉⣥⠆⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢠⣿\n⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢿⡏⢻⣿⣿⣷⣾⣿⠇⣸⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⣿⣿⣿⣿⠀⣾⣿\n⢸⣿⣿⣿⣿⣿⣿⣿⠿⠟⢿⡄⢻⠀⣿⣿⣿⣿⣿⣿⠿⠁⣉⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠉⢿⣷⣘⣷⣼⣿⣿⣿⣿⠋⠀⣉⣍⡛⢿⣿⣿⣿⣿⣟⡀⢾⣿⣿⣿⠟⣾⣿⣿\n⠀⣹⣿⣿⠟⢋⣡⡄⢲⣿⣿⣿⣤⣧⣿⣿⣿⣿⠋⣡⡄⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⣡⣤⠀⣿⣿⣿⣿⡿⣿⣿⣿⣧⣴⣿⣿⣿⡿⢀⣿⣿⠟⠛⢿⣿⣦⣙⣿⡟⢠⣿⣿⣿\n⠀⣾⣿⣿⣿⣿⠿⠋⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢸⠟⢛⣉⡙⢻⣿⣟⠻⣿⣿⣿⠿⣿⣦⣿⣿⣿⣿⣷⣦⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣥⣾⡟⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⠀⢸⣿⣿⣯⣤⣶⠟⠀⢛⣛⣻⣿⣿⠟⢛⠻⣿⣿⣿⣧⣀⣴⣿⣿⡟⢈⣿⣿⣿⣿⣿⣿⣶⣬⣍⣛⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⢋⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⠀⠸⣿⣿⣿⣿⣿⡀⢁⣼⣿⣿⣿⣧⣴⡿⢀⣿⣿⣿⣿⣿⣿⡿⠏⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⢰⡀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣷⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⢸⣷⣄⠹⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿");
    
    console.log("⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⢿⣿⣿⡿⠟⡛⠻⣿⣿⣿⠿⠛⣛⣉⣭⣭⣭⣭⣝⣛⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⣋⠥⠶⠞⠛⠛⠶⢦⣌⠋⣠⣾⣟⠢⠙⣋⣤⢴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣍⡛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⠟⢁⣠⣤⣴⣶⣾⣿⣿⣷⣦⢀⣐⢿⣿⠟⣡⣾⣿⣵⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡉⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⢪⣶⡶⢁⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⢻⡿⣡⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠆⣰⣿⡏⠉⠛⠻⢛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⣰⣿⣿⣿⣷⣶⣤⣀⠉⠀⠉⢿⣿⣿⣿⣿⣿⡿⣟⡻⠏⠉⠋⠉⢁⣀⣿⣿⣿⣧⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢠⣿⣿⡟⠛⠙⠉⠉⠉⠉⠀⠀⣸⣿⣿⣿⣿⣿⠉⠀⠀⠠⠴⣶⣿⣿⣿⣿⣿⣿⣿⡀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢠⣿⢟⢩⠏⣲⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣤⣤⣤⣀⣀⠉⠉⢻⣿⣿⣿⣷⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⣠⣿⣿⣜⣈⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⢻⡏⢿⣿⣿⣇⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡈⠭⣸⣿⣿⣿⡆⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⢰⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⠹⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠘⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⢿⣿⣿⣿⣿⣿⡆⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣙⠛⠿⠿⠿⠿⠛⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢻⣿⣿⣿⣿⣿⣿⣿⣿⡄⠿⠿⠿⠿⠋⣠⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⡇⠸⣿⣿⣿⣿⣿⣿⠟⢋⣠⣴⣌⠻⣿⣿⣿⣿⣿⣿⣿⣿⡟⢁⣤⡙⢿⣿⣿⣿⣿⣿⣿⡗⢰⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⠛⠿⠛⢋⣡⣴⣿⣿⣿⣿⣧⠹⣿⣿⣿⣿⣿⣿⣿⢁⣾⣿⣿⣦⣌⠛⠿⠿⠿⠛⣡⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡘⠿⣿⣿⣿⠟⢃⣾⣿⣿⣿⣿⣿⣿⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣦⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n");


}, async interaction => {
    await interaction.reply("⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⢿⣿⣿⡿⠟⡛⠻⣿⣿⣿⠿⠛⣛⣉⣭⣭⣭⣭⣝⣛⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⠟⣋⠥⠶⠞⠛⠛⠶⢦⣌⠋⣠⣾⣟⠢⠙⣋⣤⢴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣍⡛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⠟⢁⣠⣤⣴⣶⣾⣿⣿⣷⣦⢀⣐⢿⣿⠟⣡⣾⣿⣵⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡉⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⢪⣶⡶⢁⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⢻⡿⣡⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡘⢿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠆⣰⣿⡏⠉⠛⠻⢛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡈⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⣰⣿⣿⣿⣷⣶⣤⣀⠉⠀⠉⢿⣿⣿⣿⣿⣿⡿⣟⡻⠏⠉⠋⠉⢁⣀⣿⣿⣿⣧⢹⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢠⣿⣿⡟⠛⠙⠉⠉⠉⠉⠀⠀⣸⣿⣿⣿⣿⣿⠉⠀⠀⠠⠴⣶⣿⣿⣿⣿⣿⣿⣿⡀⢻⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⡟⢠⣿⢟⢩⠏⣲⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣤⣤⣤⣀⣀⠉⠉⢻⣿⣿⣿⣷⠈⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⠟⣠⣿⣿⣜⣈⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⢻⡏⢿⣿⣿⣇⢹⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⡿⢋⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡈⠭⣸⣿⣿⣿⡆⢻⣿⣿⣿⣿\n⣿⣿⣿⡿⠋⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⠻⣿⣿⣿\n⣿⣿⠏⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡈⢿⣿\n⣿⡏⢰⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⠹\n⣿⣇⠘⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⢿⣿⣿⣿⣿⣿⡆\n⣿⣿⣦⣙⠛⠿⠿⠿⠿⠛⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢻⣿⣿⣿⣿⣿⣿⣿⣿⡄⠿⠿⠿⠿⠋⣠\n⣿⣿⣿⣿⣿⣷⣶⣶⣶⡇⠸⣿⣿⣿⣿⣿⣿⠟⢋⣠⣴⣌⠻⣿⣿⣿⣿⣿⣿⣿⣿⡟⢁⣤⡙⢿⣿⣿⣿⣿⣿⣿⡗⢰⣶⣶⣶⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⠛⠿⠛⢋⣡⣴⣿⣿⣿⣿⣧⠹⣿⣿⣿⣿⣿⣿⣿⢁⣾⣿⣿⣦⣌⠛⠿⠿⠿⠛⣡⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡘⠿⣿⣿⣿⠟⢃⣾⣿⣿⣿⣿⣿⣿⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣦⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n");
});
//Listener to slash commands only
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()){
        const command = interaction.client.commands.get(interaction.commandName);
        //console.log(command);
        //record the previous play command
        if (interaction.commandName === 'play') {
            precmmnd = command;
        }
    
                                                                                  
        if (!command) {
            console.error('Command ' + interaction.commandName+ ' was not found');
            return;
        }
    
        try {
            if (interaction.commandName === 'play' || interaction.commandName === 'stop'|| interaction.commandName === 'skip') {
               //Connection
                player = createAudioPlayer();
                //Create a new connection
                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
                //Subscribe player to conneciton
                connection.subscribe(player);
            }
            //Execute selected interaction
            await command.execute(interaction, fs, path, player, precmmnd, client);
            // if (interaction.isAutocomplete()) {
            //     await command.autocomplete(interaction, fs, path, player, precmmnd, client);
            // } else {
            //     await command.execute(interaction, fs, path, player, precmmnd, client);
            // }
            
        }catch (error) {
            console.error(error);
            await interaction.editReply({ content: "An error occured while executing ${interaction.commandName} command", ephemeral: true });
        }
    } else if (interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error('Command ' + interaction.commandName+ ' was not found');
            return;
        }

        try {
			await command.autocomplete(interaction, fs);
		} catch (error) {
			console.error(error);
		}
    }
});
//allow bot to log in to the server using the token
client.login(token);

