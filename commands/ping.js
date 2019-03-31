// Devolve o ping do bot ao servidor
module.exports = {
  run: async (client, message) => {
    await message.channel.send(`Pong! ${
        new Date().getTime() -
        message.createdTimestamp} ms\n${message.author}`);
  },
  help: {name: 'ping', description: 'Mostra a latencia do BOT', usage: 'ping'}
}