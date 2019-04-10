const Discord = require("discord.js");
const YouTube = require('simple-youtube-api');
const ytdl = require("ytdl-core-discord");
const cmdEntrar = require('./entrar.js');
const youtube = new YouTube(process.env.YTB_API_KEY);
const prism = require('prism-media');

// Procura a musica no youtube e devolve uma lista de musicas para selecionar
async function cmdTocar(message, args, queues) {
    // Verificar se o usuario esta em um canal de voz
    if (!message.member.voiceChannel)
        return message.channel.send(`${message.author}\nVocê precisa estar em um canal de voz para usar este comando`);

    // Verificar se foi passado argumento(s)
    if (!args)
        return message.channel.send(`${message.author}\nVocê precisa passar o nome ou url da musica`);

    // Verificar se o bot ja esta em um canal de voz
    if (!message.guild.voiceConnection)
        // Caso nao esteja, entrar no canal de voz
        await cmdEntrar(message, queues);

    // Verificar se eh link do youtube
    const ytbReg = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const ytbMatch = args.match(ytbReg);
    if (!ytbMatch) {
        // Pesquisar no youtube
        const videos = await youtube.searchVideos(args, 10, {
            regionCode: 'BR'
        });

        // Verificar se teve resultado
        if (!videos[0])
            return message.channel.send(`${message.author}\nNão encontrei resultados`);

        // Listar opcoes
        const embed = new Discord.RichEmbed().setTitle("**Selecione uma opção de 1 a 10**");
        videos.forEach((video, i) => embed.addField(`**${i + 1} - ** ${video.title}`, `${video.url}`));
        message.channel.send({
            embed
        });

        // Aguardar a resposta do usuario
        const filter = msg => msg.author.id == message.author.id;
        const response = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 10000,
            errors: ["time"]
        });

        // Verificar resposta do usuario
        const option = response.first().content - 1;
        if (option < 0 || option > videos.length)
            return message.channel.send("Opção inválida");

        // Passar musica para lista
        await addMusic(videos[option], message, queues);
        return;
    }

    // Adicionar https caso nao tenha
    if (!ytbMatch[1])
        args = 'https://' + args;

    // Verificar se eh playlist
    const playlistReg = /^.*(list=)([^#\&\?]*).*/;
    const playlistMatch = args.match(playlistReg);
    if (playlistMatch) {
        const playlist = await youtube.getPlaylist(args);
        // Verificar se teve resultados
        if (!playlist)
            return message.channel.send(`${message.author}\nNão encontrei esta playlist`);

        const videos = await playlist.getVideos();
        // Verificar se teve resultados
        if (!videos)
            return message.channel.send(`${message.author}\nPlaylist vazia`);

        await addPlaylist(videos, message, queues);
    } else {
        // Pesquisar link no youtube para pegar informacoes
        const video = await youtube.getVideo(args);

        // Verificar se teve resultado
        if (!video)
            return message.channel.send(`${message.author}\nNão encontrei resultado`);

        await addMusic(video, message, queues);
    }
}

async function playMusic(guild, music, queues) {
    var serverQueue = queues.get(guild.id);

    // Verificar se tem musica na fila
    if (!music) {
        serverQueue.connection.channel.leave();
        queues.delete(guild.id);
        return;
    }

    // Tocar musica
    const input = await ytdl(music.url);
    const pcm = input.pipe(new prism.opus.Decoder({
        rate: 48000,
        channels: 2,
        frameSize: 960
    }));
    serverQueue.playing = true;
    const dispatcher = serverQueue.connection.playConvertedStream(pcm)
        .on('end', pular => {
            // Verificar se eh para repetir a musica atual
            if (!serverQueue.repeat)
                serverQueue.musics.shift();

            // Se utilizado o comando pular
            else if (pular == global.PULAR)
                serverQueue.musics.shift();

            playMusic(guild, serverQueue.musics[0], queues);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolume(serverQueue.volume / 100);
    serverQueue.textChannel.send(`Tocando: **${music.title}**`);
};

async function addMusic(video, message, queues) {
    var serverQueue = queues.get(message.guild.id);
    serverQueue.musics.push(video);
    // Se for a primeira da fila
    if (!serverQueue.musics[1])
        return playMusic(message.guild, serverQueue.musics[0], queues);
    return message.channel.send(`A musica **${video.title}** foi adicionada a lista de reproducao.`);
}

async function addPlaylist(videos, message, queues) {
    var serverQueue = queues.get(message.guild.id);
    // Verificar se tem fila
    if (!serverQueue.musics[0]) {
        serverQueue.musics = videos;
        playMusic(message.guild, serverQueue.musics[0], queues);
    } else {
        videos.forEach(video => serverQueue.musics.push(video));
    }
    return message.channel.send(`Foram adicionadas **${videos.length}** musicas na fila`);
}

module.exports = cmdTocar;