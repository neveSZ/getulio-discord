// Mistura as musicas atuais
async function cmdMisturar(message) {
    const serverQueue = global.queue.get(message.guild.id);
    const voiceChannel = message.member.voiceChannel;
    const musics = serverQueue.musics;

    // Verificar se o membro esta em um canal de voz
    if (!voiceChannel)
        return message.channel.send(`${message.author}\nVocê precisa estar em um canal de voz para usar este comando`);

    //Verificar se o bot esta em um canal
    if (!message.guild.voiceConnection)
        return message.channel.send(`${message.author}\nNo momento não estou em um canal de voz`);

    // Verificar se estao no mesmo canal de voz
    if (voiceChannel.id !== message.guild.voiceConnection.channel.id)
        return message.channel.send(`${message.author}\nVocê precisa estar no mesmo canal do bot para usar este comando`);

    // Verificar se esta tocando algo
    if (!serverQueue)
        return message.channel.send(`${message.author}\nNão estou tocando nada`);

    // Verificar se esta tocando algo
    if (!musics[2])
        return message.channel.send(`${message.author}\nNão eh possivel misturar somente uma musica`);

    // Misturar a array
    for (let i = musics.length - 1; i > 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [musics[i], musics[j]] = [musics[j], musics[i]];
    }

    message.channel.send('A lista de reproducao foi misturada');
}

module.exports = cmdMisturar;