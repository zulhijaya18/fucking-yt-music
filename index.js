// const fs = require('fs');
const ytdl = require('ytdl-core');
const usetube = require('usetube');
const express = require('express');
const app = express();
const got = require("got");
const https = require('https');
const stream = require('stream');

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
      });
    
    downloadStream.pipe(fileWriterStream);
    
    // https.get(url, (stream) => {
        // got.url('https://www.youtube.com/watch?v='+req.params.videoId).stream.pipe(res);
    // });
    // res.send(result);
    // res.end();
});

app.listen();

