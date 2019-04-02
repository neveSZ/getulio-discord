// Acionado toda vez que o bot conecta no discord
async function onReady(client) {
    console.log(`O Bot foi iniciado, atualmente estou em ${client.guilds.size} servidor(es), auxiliando ${client.users.size} usuarios`);
    // Status do bot
    client.user.setActivity('eu sei tudo!!!', {
        type: 'STREAMING',
        url: 'https://www.twitch.tv/neveSZcs'
    });
}
module.exports = onReady;