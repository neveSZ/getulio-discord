// Define o volume do bot
async function cmdVolume(message, args) {
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

    // Verificar se foi passado argumento
    if (!args)
        return message.channel.send(`${message.author}\nO volume atual é ${serverQueue.volume}`);
    args = parseInt(args);

    // Verificar se eh um inteiro
    if (!Number.isInteger(args))
        return message.channel.send(`${message.author}\nVocê precisa passar um numero`);

    // Verificar se esta dentro do limite
    if (args < 0 && args > 200)
        return message.channel.send(`${message.author}\nVocê precisa passar um numero entre 1 e 200`);

    serverQueue.volume = args;
    serverQueue.connection.dispatcher.setVolume(args / 100);
}

module.exports = cmdVolume;