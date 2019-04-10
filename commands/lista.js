// Exibe a lista de musica atual
async function cmdLista(message, serverQueue) {
    const Discord = require("discord.js");

    // Verificar se esta conectado
    if (!serverQueue)
        return message.channel.send(`${message.author}\nNao estou conectado`);

    musics = serverQueue.musics;

    // Verificar se tem alguma musica na lista
    if (!musics[0])
        return message.channel.send(`${message.author}\nNao existe lista de reproducao`);
    var embed = new Discord.RichEmbed().setTitle("**Lista de reproducao (proximas 25 musicas)**");
    for (let i = 0; i < musics.length && i < 25; i++) {
        embed.addField(`**${i + 1} - ** ${musics[i].title}`, musics[i].url);
    }
    message.channel.send({
        embed
    });
}

module.exports = cmdLista;