
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { StudentsView } from './views/StudentsView';
import { CoursesView } from './views/CoursesView';
import { useWebSocket } from './hooks/useWebSocket';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bem-vindo ao Sistema Escolar</h1>
      <p>Selecione um módulo para gerenciar.</p>
    </div>
  );
}

function App() {
  const { isConnected } = useWebSocket();

  return (
    <BrowserRouter>
      <div className="nav-bar">
        <Link to="/" className="nav-link">Início</Link>
        <Link to="/students" className="nav-link">Alunos</Link>
        <Link to="/courses" className="nav-link">Cursos</Link>
        <span style={{ marginLeft: 'auto', color: isConnected ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center' }}>
          {isConnected ? '● Conectado' : '○ Desconectado'}
        </span>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<StudentsView />} />
        <Route path="/courses" element={<CoursesView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
