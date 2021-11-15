const fs = require('fs');
const ytdl = require('ytdl-core');
const usetube = require('usetube');
const express = require('express');
const app = express();
const got = require("got");
const https = require('https');
const stream = require('stream');
const path = require('path');

function sendRes (res){
    var filePath = path.join(__dirname, 'lagu.webm');
    var stat = fs.statSync(filePath);
    
    res.writeHead(200, {
        'Content-Type': 'audio/webm',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename=lagu.webm'
    });

    var readStream = fs.createReadStream(filePath);
    readStream.on('open', function() {
        readStream.pipe(res);
    });

    readStream.on('error', function(err) {
        res.end(err);
    });
}

app.get('/new-yt-music/search/:keyword', async (req, res) => {
    let search = await usetube.searchVideo(req.params.keyword);
    res.send(search.videos);
    res.end();
});

app.get('/new-yt-music/video/:videoId', async (req, res) => {
    let info = await ytdl.getInfo('https://www.youtube.com/watch?v='+req.params.videoId);
    let url = '';
    info.formats.forEach(format => {
        if (format.itag == '249') {
            url = format.url;
        }
    });
    
    const fileName = "lagu.webm";
    
    const downloadStream = got.stream(url);
    const fileWriterStream = fs.createWriteStream(fileName);
    
    downloadStream
      .on("downloadProgress", ({ transferred, total, percent }) => {
        const percentage = Math.round(percent * 100);
        console.error(`progress: ${transferred}/${total} (${percentage}%)`);
      })
      .on("error", (error) => {
        console.error(`Download failed: ${error.message}`);
      });
    
    fileWriterStream
      .on("error", (error) => {
        console.error(`Could not write file to system: ${error.message}`);
      })
      .on("finish", () => {
        console.log(`File downloaded to ${fileName}`);
        sendRes(res);
      });
    
    downloadStream.pipe(fileWriterStream);
});



app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});