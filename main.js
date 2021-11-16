const fs = require('fs');
const ytdl = require('ytdl-core');
const usetube = require('usetube');
const express = require('express');
const app = express();
const got = require("got");
app.get('/new-yt-music/search/:keyword', async (req, res) => {
    let search = await usetube.searchVideo(req.params.keyword);
    res.send(search.videos);
    res.end();
});

app.get('/new-yt-music/video/:videoId', async (req, res) => {
    let info = await ytdl.getInfo('https://www.youtube.com/watch?v='+req.params.videoId);
    let url = '';
    let fileSize = 0;
    let fileName = req.params.videoId+'.webm';
    fs.writeFileSync('info.txt', JSON.stringify(info));
    info.formats.forEach(format => {
        if (format.itag == '249') {
            url = format.url;
            fileSize = format.contentLength;
        }
        // console.log(format);
    });
    
    const downloadStream = got.stream(url);

    downloadStream
      .on("downloadProgress", ({ transferred, total, percent }) => {
        const percentage = Math.round(percent * 100);
        console.error(`progress: ${transferred}/${total} (${percentage}%)`);
      })
      .on("error", (error) => {
        console.error(`Download failed: ${error.message}`);
      });

      res.writeHead(200, {
        'Content-Type': 'audio/webm',
        'Content-Length': fileSize,
        'Content-Disposition': 'attachment; filename='+fileName
      });

    downloadStream.pipe(res);
});



app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});