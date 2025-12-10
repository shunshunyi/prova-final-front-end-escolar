
import { Router, Request, Response } from 'express';
import { Server } from 'socket.io';
import { students, Student } from '../data/store';

// Simpler: Math.random().String
const generateId = () => Math.random().toString(36).substr(2, 9);

export default (io: Server) => {
    const router = Router();

    // GET All
    router.get('/', (req: Request, res: Response) => {
        res.json(students);
    });

    // GET One
    router.get('/:id', (req: Request, res: Response) => {
        const student = students.find(s => s.id === req.params.id);
        if (student) res.json(student);
        else res.status(404).json({ message: 'Student not found' });
    });

    // POST
    router.post('/', (req: Request, res: Response) => {
        const { name, age, grade } = req.body;
        const newStudent: Student = {
            id: generateId(),
            name,
            age: Number(age),
            grade
        };
        students.push(newStudent);
        io.emit('student_created', newStudent); // Notify clients
        res.status(201).json(newStudent);
    });

    // PUT
    router.put('/:id', (req: Request, res: Response) => {
        const idx = students.findIndex(s => s.id === req.params.id);
        if (idx !== -1) {
            students[idx] = { ...students[idx], ...req.body };
            io.emit('student_updated', students[idx]);
            res.json(students[idx]);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    });

    // DELETE
    router.delete('/:id', (req: Request, res: Response) => {
        const idx = students.findIndex(s => s.id === req.params.id);
        if (idx !== -1) {
            const deleted = students.splice(idx, 1)[0];
            io.emit('student_deleted', deleted);
            res.json(deleted);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    });

    return router;
};
