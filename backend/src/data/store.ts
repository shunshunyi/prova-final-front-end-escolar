
export interface Student {
    id: string;
    name: string;
    age: number;
    grade: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    duration: string;
}

export let students: Student[] = [
    { id: '1', name: 'Ana Silva', age: 10, grade: '5º Ano' },
    { id: '2', name: 'Bruno Souza', age: 11, grade: '6º Ano' }
];

export let courses: Course[] = [
    { id: '1', title: 'Matemática Básica', description: 'Introdução à Aritmética', duration: '6 meses' },
    { id: '2', title: 'História da Arte', description: 'Introdução às Artes Visuais', duration: '4 meses' }
];
