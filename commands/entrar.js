// Entrar no canal de voz do usuario
async function cmdEntrar(message) {
  const voiceChannel = message.member.voiceChannel;
  // Verificar se o membro esta em um canal de voz
  if (!voiceChannel)
    return message.channel.send(`${message.author}\nVocê precisa estar em um canal de voz para usar este comando`);

  // Verificar permissoes
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT')) {
    return message.channel.send(`${message.author}\nNão tenho permissão para entrar neste canal`);
  }
  if (!permissions.has('SPEAK')) {
    return message.channel.send(`${message.author}\n${message.author}\nNão tenho permissão para falar neste canal`);
  }
  voiceChannel.join().then(connection => console.log(`Conectado no canal #${voiceChannel.name}`)).catch(console.error);
}
module.exports = cmdEntrar;