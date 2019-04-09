// Acionado toda vez que o bot conecta no discord
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
const listStatus = [{
    activity: 'conhecimento tácito',
    type: 'STREAMING'
}, {
    activity: 'sessão da tarde',
    type: 'WATCHING'
}, {
    activity: 'tênis em NY',
    type: 'PLAYING'
}, {
    activity: 'pessoas obsoletas',
    type: 'LISTENING'
}, {
    activity: 'no berço esplêndido',
    type: 'PLAYING'
}];

async function onReady(client) {
    console.log(`O Bot foi iniciado, atualmente estou em ${client.guilds.size} servidor(es), auxiliando ${client.users.size} usuarios`);
    // Status do bot
    while (true) {
        const i = Math.floor((Math.random() * 5));
        await client.user.setActivity(listStatus[i].activity, {
            type: listStatus[i].type,
            url: 'https://www.twitch.tv/neveSZcs'
        });
        console.log(`Alterada a atividade para : ${listStatus[i].activity}`);
        await timeout(30000); // esperar 30 segundos
    }
}

module.exports = onReady;