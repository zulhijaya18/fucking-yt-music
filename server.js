const WebSocketServer = require('ws').Server
const websocketStream = require('websocket-stream')
const wss = new WebSocketServer({port: 8098})
const fs = require('fs')
const ytdl = require('ytdl-core');
const https = require('https');

wss.on('connection', async function (ws, req) {
    const stream = websocketStream(ws)
    
    let videoId = req.url.split('/')[1];
    console.log('opened connection to '+ videoId);

  let info = await ytdl.getInfo('https://www.youtube.com/watch?v='+videoId);
  let url = '';
  fs.writeFileSync('info.txt', JSON.stringify(info));
  info.formats.forEach(format => {
      if (format.itag == '249') {
          url = format.url;
          fileSize = format.contentLength;
      }
  });

  https.get(url, function(data){
    data.pipe(stream)
  });
})