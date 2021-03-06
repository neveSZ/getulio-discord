// Sai do canal atual
async function cmdSair(message, queues) {
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

  voiceChannel.leave();
  queues.delete(message.guild.id);
  console.log(`Saiu do canal #${voiceChannel.name}`);
}
module.exports = cmdSair;