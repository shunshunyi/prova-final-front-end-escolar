
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Course } from '../types';

const API_URL = 'http://localhost:3000/api/courses';

export const CoursesView: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const { socket } = useWebSocket();
    const [formData, setFormData] = useState<Partial<Course>>({ title: '', description: '', duration: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetch(API_URL).then(res => res.json()).then(data => setCourses(data));
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('course_created', (item: Course) => setCourses(prev => [...prev, item]));
        socket.on('course_updated', (item: Course) => setCourses(prev => prev.map(i => i.id === item.id ? item : i)));
        socket.on('course_deleted', (item: Course) => setCourses(prev => prev.filter(i => i.id !== item.id)));

        return () => {
            socket.off('course_created');
            socket.off('course_updated');
            socket.off('course_deleted');
        };
    }, [socket]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setFormData({ title: '', description: '', duration: '' });
            setEditingId(null);
        } catch (err) { console.error(err); }
    };

    const handleEdit = (item: Course) => {
        setFormData(item);
        setEditingId(item.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    };

    return (
        <div>
            <h2>Gerenciar Cursos</h2>
            <div className="card">
                <h3>{editingId ? 'Editar Curso' : 'Adicionar Curso'}</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Título" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <input type="text" placeholder="Descrição" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <input type="text" placeholder="Duração" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                    <button type="submit">{editingId ? 'Salvar' : 'Adicionar'}</button>
                    {editingId && <button onClick={() => { setEditingId(null); setFormData({ title: '', description: '', duration: '' }); }} style={{ marginLeft: '10px', background: 'gray' }}>Cancelar</button>}
                </form>
            </div>

            <div className="list-container">
                {courses.map(course => (
                    <div key={course.id} className="card">
                        <h4>{course.title}</h4>
                        <p>{course.description}</p>
                        <small>{course.duration}</small>
                        <div style={{ marginTop: '1rem' }}>
                            <button className="edit" onClick={() => handleEdit(course)}>Editar</button>
                            <button className="danger" onClick={() => handleDelete(course.id)}>Excluir</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
