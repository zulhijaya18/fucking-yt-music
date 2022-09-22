const fs = require('fs')
const websocket = require('websocket-stream')

let ws = websocket('https://new-yt-music.herokuapp.com/XwRlsNpJgD0')
ws.pipe(fs.createWriteStream('lagu.webm'))