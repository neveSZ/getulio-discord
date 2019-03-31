// Devolve um link para adicionar esse bot no discord
module.exports = {
  run: async (client, message) => {
    await message.channel.send(
        `https://discordapp.com/api/oauth2/authorize?client_id=561628351840649216&permissions=36928576&scope=bot\n${
            message.author}`);
  },
  help: {
    name: 'convite',
    description: 'Link para adicionar o bot',
    usage: 'convite'
  }
}