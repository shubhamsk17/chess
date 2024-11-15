const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let chess = new Chess();

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('makeMove', (move) => {
        const result = chess.move(move);
        if (result) {
            io.emit('moveMade', move);
        }
    });

    socket.on('resetGame', () => {
        chess = new Chess();
        io.emit('gameReset');
    });

    socket.on('gameOver', (result) => {
        io.emit('gameOver', result); // Notify both players of the game result
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
