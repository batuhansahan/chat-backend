const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8080
});

wss.on('connection', (ws) =>{
    ws.on('open', () => {
        ws.send('Opened');
    })
    
    ws.on('message', (data) => {
        console.log(data)
    })
 
    ws.on('close', function close() {
        console.log('disconnected');
    });
})
