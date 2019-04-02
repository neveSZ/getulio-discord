const Discord = require("discord.js");
var search = require("youtube-search");
const ytdl = require("ytdl-core-discord");
const cmdEntrar = require('./entrar.js');
const list = new Map();

const options = {
    maxResults: 10,
    key: process.env.YTB_API_KEY,
    regionCode: "BR"
};

// Procura a musica no youtube e devolve uma lista de musicas para selecionar
async function cmdTocar(message, args) {
    // Verificar se o usuario esta em um canal de voz
    if (!message.member.voiceChannel)
        return message.channel.send(`${message.author}\nVocê precisa estar em um canal de voz para usar este comando`);

    // Verificar se foi passado argumento(s)
    if (!args)
        return message.channel.send(`${message.author}\nVocê precisa passar o nome ou url da musica`);

    // Verificar se o bot ja esta em um canal de voz
    if (!message.guild.voiceConnection)
        // Caso nao esteja, entrar no canal de voz
        await cmdEntrar(message);

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

    // Pesquisar no youtube e listar resultados
    search(args, options, function (err, results) {
        if (err) return console.log(err);

        // Verificar se teve resultado
        if (!results[0])
            return message.channel.send(`${message.author}\nNão encontrei resultados`);

        // Listar opcoes
        const embed = new Discord.RichEmbed().setTitle("**Selecione uma opção de 1 a 10**");
        for (var i = 0; i < results.length; i++) {
            embed.addField(
                `**${i + 1} - ** ${results[i].title}`,
                `${results[i].link}`
            );
        }
        message.channel.send({
            embed
        });

        // Pegar a resposta do usuario com a opcao
        const filter = msg => msg.author.id == message.author.id;
        message.channel
            .awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ["time"]
            })
            .then(collected => {
                const option = collected.first().content - 1;
                if (option < 0 || option > 10)
                    return message.channel.send("Opção inválida");
                // ADICIONAR A LISTA DE REPRODUCAO
                const embedMsg = new Discord.RichEmbed().setTitle(`**Adicionado a lista: **${results[option].title}`).setDescription(results[option].link);
                message.channel.send(embedMsg);
            })
            .catch(collected => console.log("Ocorreu um erro na selecao da musica"));
    });
}

module.exports = cmdTocar;