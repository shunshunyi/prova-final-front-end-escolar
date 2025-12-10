
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Student } from '../types';

const API_URL = 'http://localhost:3000/api/students';

export const StudentsView: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const { socket } = useWebSocket();
    const [formData, setFormData] = useState<Partial<Student>>({ name: '', age: 0, grade: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    // Fetch initial data
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setStudents(data))
            .catch(err => console.error('Error fetching students:', err));
    }, []);

    // WebSocket listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('student_created', (newStudent: Student) => {
            setStudents(prev => [...prev, newStudent]);
        });

        socket.on('student_updated', (updatedStudent: Student) => {
            setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        });

        socket.on('student_deleted', (deletedStudent: Student) => {
            setStudents(prev => prev.filter(s => s.id !== deletedStudent.id));
        });

        // Cleanup listeners
        return () => {
            socket.off('student_created');
            socket.off('student_updated');
            socket.off('student_deleted');
        };
    }, [socket]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to save');
            // No need to update state manually here if we rely on WebSocket, 
            // but usually we do it for optimistic UI or wait for response. 
            // With WS, we can either wait for the event or update immediately.
            // I'll wait for the event to prove WS works!
            setFormData({ name: '', age: 0, grade: '' });
            setEditingId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (student: Student) => {
        setFormData(student);
        setEditingId(student.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h2>Gerenciar Alunos</h2>

            <div className="card">
                <h3>{editingId ? 'Editar Aluno' : 'Novo Aluno'}</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Idade"
                        value={formData.age || ''}
                        onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Série/Ano"
                        value={formData.grade}
                        onChange={e => setFormData({ ...formData, grade: e.target.value })}
                        required
                    />
                    <button type="submit">{editingId ? 'Atualizar' : 'Criar'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', age: 0, grade: '' }); }} style={{ marginLeft: '10px', background: 'gray' }}>Cancelar</button>}
                </form>
            </div>

            <div className="list-container">
                {students.map(student => (
                    <div key={student.id} className="card">
                        <h4>{student.name}</h4>
                        <p>Idade: {student.age}</p>
                        <p>Série: {student.grade}</p>
                        <div style={{ marginTop: '1rem' }}>
                            <button className="edit" onClick={() => handleEdit(student)}>Editar</button>
                            <button className="danger" onClick={() => handleDelete(student.id)}>Excluir</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
