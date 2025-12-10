
import { Router, Request, Response } from 'express';
import { Server } from 'socket.io';
import { courses, Course } from '../data/store';

const generateId = () => Math.random().toString(36).substr(2, 9);

export default (io: Server) => {
    const router = Router();

    router.get('/', (req, res) => {
        res.json(courses);
    });

    router.get('/:id', (req, res) => {
        const course = courses.find(c => c.id === req.params.id);
        if (course) res.json(course);
        else res.status(404).json({ message: 'Course not found' });
    });

    router.post('/', (req, res) => {
        const { title, description, duration } = req.body;
        const newCourse: Course = {
            id: generateId(),
            title,
            description,
            duration
        };
        courses.push(newCourse);
        io.emit('course_created', newCourse);
        res.status(201).json(newCourse);
    });

    router.put('/:id', (req, res) => {
        const idx = courses.findIndex(c => c.id === req.params.id);
        if (idx !== -1) {
            courses[idx] = { ...courses[idx], ...req.body };
            io.emit('course_updated', courses[idx]);
            res.json(courses[idx]);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    });

    router.delete('/:id', (req, res) => {
        const idx = courses.findIndex(c => c.id === req.params.id);
        if (idx !== -1) {
            const deleted = courses.splice(idx, 1)[0];
            io.emit('course_deleted', deleted);
            res.json(deleted);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    });

    return router;
};
