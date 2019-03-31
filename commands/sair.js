// Sai do canal atual
module.exports = {
  run: async (client, message) => {
    const voiceChannel = message.member.voiceChannel;
    // Verificar se o membro esta em um canal de voz
    if (!voiceChannel)
      return message.channel.send(`${
          message
              .author}\nVocê precisa estar em um canal de voz para usar este comando`);

    // Verificar se estao no mesmo canal de voz
    if (voiceChannel.id !== message.guild.voiceConnection.channel.id)
      return message.channel.send(`${
          message
              .author}\nVocê precisa estar no mesmo canal do bot para usar este comando`);
    voiceChannel.leave();
    console.log('[LOG]', `Saiu do canal #${voiceChannel.name}`);
  },
  help: {name: 'sair', description: 'Sair do canal de voz', usage: 'sair'}
}