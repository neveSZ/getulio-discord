// Para a musica atual e remove todas as musicas da lista
async function cmdParar(message) {
    const serverQueue = global.queue.get(message.guild.id);
    const voiceChannel = message.member.voiceChannel;

    // Verificar se o membro esta em um canal de voz
    if (!voiceChannel)
        return message.channel.send(`${message.author}\nVocê precisa estar em um canal de voz para usar este comando`);
    if (!serverQueue)
        return message.channel.send('Não estou tocando nada');
    serverQueue.connection.dispatcher.end();
}

module.exports = cmdParar;