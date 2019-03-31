module.exports = async (client, message) => {
  // Verificar se nao eh bot
  if (message.author.bot) return;

  // Verificar se foi mensagem privada
  if (!message.guild)
    return message.channel.send('Ainda não funciono no privado');

  // Verificar se possui o prefixo
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;

  // Separar argumentos e comando
  const args =
    message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);

  // Verificar se o comando esta disponivel
  if (!cmd) {
    return await message.channel.send(`${message.author}\nComando não disponível. Digite ${process.env.PREFIX}ajuda para ver a lista de comandos.`);
  };

  console.log('[LOG]', `${message.author.username} (${message.author.id}) executou o comando ${cmd.help.name}`);
  cmd.run(client, message, args);
}