const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const socket = require('socket.io');
const p2pServer = require('socket.io-p2p-server').Server;
const io = socket(server);

io.use(p2pServer);
const port = process.env.PORT || 5000;
const conectados = [];
const clientes =[];

io.on('connection',(socket)=>{
    // Todos conectados
    const idSocket = socket.id;
    const {nameRoom} = socket.handshake.query;
    console.log(`Usuario ${idSocket}`);
    socket.join(nameRoom);
    console.log(`Usuario: ${idSocket} unido sala: ${nameRoom}`);
    
    // una vez conectados manejamos los eventos
    // podemos pedirle a la DB que consiga los datos para el nombre
    socket.on('nuevoMensaje',(mensaje)=>{
        let myJsonMen = JSON.stringify(mensaje);
        console.log(myJsonMen);
        console.log('Mensaje:' + mensaje['_mensaje']);
        socket.to(nameRoom).emit('getMensaje',mensaje['_mensaje']);
    });
    
});

server.listen(port,()=>
{
    console.log("Escuchando puerto: " + port);
}); 