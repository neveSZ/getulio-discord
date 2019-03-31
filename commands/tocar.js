// Procura a musica no youtube e devolve uma lista de musicas para selecionar
const Discord = require("discord.js");
var search = require("youtube-search");
var opts = {
    maxResults: 10,
    key: process.env.YTB_API_KEY,
    regionCode: "BR"
};
const ytdl = require("ytdl-core-discord");
async function play(connection, url) {
    connection.playOpusStream(await ytdl(url));
}

module.exports = {
    run: async (client, message, args) => {
        // Verificar se o usuario esta em um canal de voz
        if (!message.member.voiceChannel)
            return message.channel.send(`${message.author}\nVocê precisa estar em um canal de voz para usar este comando`);

        // Verificar se foi passado argumento(s)
        if (!args[0])
            return message.channel.send(`${message.author}\nVocê precisa passar o nome ou url da musica`);

        // Verificar se o bot ja esta em um canal de voz
        if (!message.guild.voiceConnection)
            // Caso nao esteja, entrar no canal de voz
            await client.commands.get("entrar").run(client, message);

        // Verificar argumentos
        for (var i = 0; i < args.length; i++) {
            // Verificar se algum argumento eh url
            if (args[i].includes("youtube.com")) {
                // Verificar se todos os argumentos sao URLs
                if (!args[i].includes("youtube.com"))
                    return message.channel.send(`${message.author}\nEnvie todos os links separados por um espaco, ou somente o nome de uma musica`);
                // Args somente URL
                return;
            }
        }

        // Args eh o nome de uma musica, entao pesquisar e listar resultados
        search(args.join(" "), opts, function (err, results) {
            if (err) return console.log('[ERRO]', err);

            // Verificar se teve resultado
            if (!results[0])
                return message.channel.send(`${message.author}\nNão encontrei resultados`);

            // Listar opcoes    
            const embed = new Discord.RichEmbed().setTitle("**Selecione uma opção de 1 a 10**");
            for (var i = 0; i < results.length; i++) {
                embed.addField(`**${i+1} - ** ${results[i].title}`, `${results[i].link}`);
            }
            message.channel.send({
                embed
            });

            // Pegar a resposta do usuario com a opcao
            const filter = msg => msg.author.id == message.author.id;
            message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                })
                .then(collected => {
                    const option = collected.first().content - 1
                    if (option < 0 || option > 9)
                        return message.channel.send('Opção inválida');
                    console.log('[LOG]', `Adicionado a lista ${results[option].link}`);
                    play(message.guild.voiceConnection, results[option].link);
                    const embedMsg = new Discord.RichEmbed().setTitle(`**Adicionado a lista: **${results[option].title}`).setDescription(results[option].link);
                    message.channel.send(embedMsg);
                })
                .catch(collected => console.log('Não foi selecionada uma opção'));

        });
    },
    help: {
        name: "tocar",
        description: "Tocar video ou playlist do youtube",
        usage: "youtube <url> ou youtube <nome do video>"
    }
};