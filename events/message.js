module.exports = async (client, message) => {
  // Verificar se foi mensagem privada
  if (!message.guild) return;

  // Verificar se nao eh bot
  if (message.author.bot) return;

  // Verificar se possui o prefixo
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;

  // Separar argumentos e comando
  const args =
      message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);

  // Verificar se o comando esta disponivel
  if (!cmd) {
    await message.channel.send(
        `${message.author}\nComando não disponível. Digite ${
            process.env.PREFIX}ajuda para ver a lista de comandos.`);
    return;
  };

  console.log(
      '[LOG]',
      `${message.author.username} (${message.author.id}) executou o comando ${
          cmd.help.name}`);
  cmd.run(client, message, args);
}