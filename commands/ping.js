// Devolve o ping do bot ao servidor
module.exports = {
  run: async (client, message) => {
    await message.channel.send(`${message.author}\nPong! ${
        new Date().getTime() - message.createdTimestamp} ms`);
  },
  help: {name: 'ping', description: 'Mostra a latencia do BOT', usage: 'ping'}
}