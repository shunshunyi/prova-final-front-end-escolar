
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import studentsRouter from './routes/students';
import coursesRouter from './routes/courses';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for simplicity in this test
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Render EJS view
app.get('/', (req, res) => {
    res.render('index', { title: 'School API Running' });
});

// API Routes
app.use('/api/students', studentsRouter(io));
app.use('/api/courses', coursesRouter(io));

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
