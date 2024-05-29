const{ REST, Routes } = require("discord.js");
const{ clientId, guildId, token } = require("./config.json");
const fs = require("node:fs");

const commands = [];
const cmmndFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

console.log(cmmndFiles);
for (const file of cmmndFiles) {
    console.log(file);
    const cmmnd = require("./commands/" + file);
    commands.push(cmmnd.data.toJSON());
}

const restMdl = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log('Refreshing ${commands.length} application (/) commands');
        const data = await restMdl.put(
            Routes.applicationGuildCommand(clientId, guildId),
            { body: commands}
        );
        console.log('Refresh of ${data.length} application commands completed');
    }catch (err) {
        console.error(err);
    }
})();