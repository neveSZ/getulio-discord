// Devolve o ping do bot ao servidor
async function cmdPing(message) {
  await message.channel.send(`${message.author}\nPong! ${new Date().getTime() - message.createdTimestamp} ms`);
}
module.exports = cmdPing;