const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const search = require('youtube-search');
const client = new Discord.Client();
const config = require("./config.json");
var opts = {
    maxResults: 1,
    key: (config.key)
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag} with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    console.log(`Invite me with`,config.invite);
    client.user.setActivity(`Prefix ${config.prefix}`);
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

    if(command === "play") {
        if (message.channel.type === 'dm') return;
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('Please run this command while in a voice channel!'); }
        voiceChannel.join().then(connection => {
            if (args.length == 0) {
                var request = ("high on humans oh wonder");
            }
            var request = args;
            search(request.join(" "), opts, function(err, results) {
                if(err) return console.log(err);
            connection.play(ytdl(results[0].link, {filter: 'audioonly' }));
            console.log("Playing ",results[0].title,":", results[0].link);
            message.channel.send(`Playing ${results[0].title}`);
            client.user.setActivity(`${results[0].title}`);
        }); 
            const dispatcher = connection.play();
            dispatcher.on('finish', () => voiceChannel.leave());
            client.user.setActivity(`Prefix ${config.prefix}`);
        })}});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection (possible deprecated code)'));

client.login(config.token);