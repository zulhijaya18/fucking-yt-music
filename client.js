const fs = require('fs')
const websocket = require('websocket-stream')

let ws = websocket('http://localhost:8098/XwRlsNpJgD0')

for (let i = 0; i <= 20; i++) {
    console.log('writing chunk ' + i)
    ws.pipe(fs.createWriteStream(i+'.webm'))
}