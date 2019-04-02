// Exibe algumas informacoes sobre o BOT/projeto
const Discord = require("discord.js");
async function cmdInformacoes(message) {
    await message.channel.send({
        embed: {
            title: `Olá, ${message.author.username}`,
            description: "Eu sou o Getulio, o bot mais **competente** do Discord.\n Como estou em fase inicial de construção ainda apresento muitos bugs (isso tudo se deve a falta de competência de neveSZ que passa o dia no berço de ouro).",
            footer: {
                icon_url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
                text: "neveSZ/getulio-discord"
            },
            fields: [{
                name: "Código Fonte",
                value: "Fui construído em um código fonte aberto disponível [aqui](https://github.com/neveSZ/getulio-discord)"
            }]
        }
    });
}

module.exports = cmdInformacoes;