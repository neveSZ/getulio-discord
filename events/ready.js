// Acionado toda vez que o bot conecta no discord
module.exports = async (client) => {
  console.log(
      '[LOG]',
      `O Bot foi iniciado, atualmente esta ajudando ${
          client.users.size} usuarios em ${client.guilds.size} servidor(es)`);
  // Status do bot
  client.user.setActivity(
      'EU SEI TUDO!!!',
      {type: 'STREAMING', url: 'https://www.twitch.tv/neveSZcs'});
}