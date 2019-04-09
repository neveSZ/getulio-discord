// Repete a musica atual
async function cmdRepetir(message) {
    const serverQueue = global.queue.get(message.guild.id);
    const voiceChannel = message.member.voiceChannel;

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

    serverQueue.repeat = !serverQueue.repeat;
    if (serverQueue.repeat)
        message.channel.send('Repeticão de musica ativado');
    else
        message.channel.send('Repeticão de musica desativado');
}

module.exports = cmdRepetir;