// Acionado toda vez que recebe uma mensagem
module.exports = async (client, message) => {
  // Verificar se foi mensagem privada
  if (!message.guild) return;

  // Verificar se nao eh bot
  if (message.author.bot) return;

  // Verificar se possui o prefixo
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;

  console.log('bo apartir daqui');
  // Separar argumentos e comando
  const args =
      message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  console.log(args);
  console.log(command);
  const cmd = client.commands.get(command);  // treta aqui

  // Verificar se o comando esta disponivel
  if (!cmd) return;

  console.log(
      '[LOG]',
      `${message.author.username} (${message.author.id}) executou o comando ${
          cmd.help.name}`);

  cmd.run(client, message, args);
}