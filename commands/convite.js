// Devolve um link para adicionar esse bot no discord
async function cmdConvite(message) {
  await message.channel.send(`${message.author}\n<https://discordapp.com/api/oauth2/authorize?client_id=561628351840649216&permissions=36928576&scope=bot>`);
}

module.exports = cmdConvite;