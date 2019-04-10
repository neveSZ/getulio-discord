// Pausa a reproducao
async function cmdPausar(message, serverQueue) {
    const voiceChannel = message.member.voiceChannel;

    // Verificar se o membro esta em um canal de voz
    if (!voiceChannel)
        return message.channel.send(`${message.author}\nVocê precisa estar em um canal de voz para usar este comando`);

    // Verificar se o bot esta em um canal
    if (!message.guild.voiceConnection)
        return message.channel.send(`${message.author}\nNo momento não estou em um canal de voz`);

    // Verificar se estao no mesmo canal de voz
    if (voiceChannel.id !== message.guild.voiceConnection.channel.id)
        return message.channel.send(`${message.author}\nVocê precisa estar no mesmo canal do bot para usar este comando`);

    // Verificar se tem algo na lista
    if (!serverQueue.musics[0])
        return message.channel.send('Não estou tocando nada');

    // Verificar se tem algo pausado
    if (!serverQueue.playing)
        return message.channel.send(`${message.author}\nA musica ja esta pausada`);

    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
}

module.exports = cmdPausar;