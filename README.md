
# Prova Final - Front-End do Sistema de Gerenciamento Escolar Infantil

## Objetivo
Implementação do Front-End de um Sistema de Gerenciamento Escolar utilizando React, TypeScript, e Vite. O sistema consome uma API REST (Node.js/Express) e utiliza WebSockets para atualizações em tempo real. O projeto é totalmente containerizado utilizando Docker.
Também inclui implementação de views renderizadas no servidor com **EJS** (acessível na rota raiz do backend).

## Entidades Escolhidas
As duas entidades selecionadas para o CRUD completo são:
1. **Students (Alunos)**: Gerenciamento de informações dos alunos (Nome, Idade, Série).
2. **Courses (Cursos)**: Gerenciamento dos cursos oferecidos (Título, Descrição, Duração).

## Instruções de Execução
O projeto utiliza Docker Compose para orquestrar o Backend e o Frontend.

### Pré-requisitos
- Docker Desktop instalado e rodando.

### Passo a Passo
1. Clone este repositório.
2. Na raiz do projeto, execute o comando:
   ```bash
   docker-compose up --build
   ```
3. Acesse a aplicação:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000

## Instruções de Build (Vite)
O build do Frontend é gerenciado automaticamente pelo Dockerfile.
Caso deseje rodar manualmente ou gerar os arquivos estáticos:
1. Navegue até a pasta `frontend`.
2. Instale as dependências: `npm install`.
3. Execute o build:
   ```bash
   npm run build
   ```
   Os arquivos serão gerados na pasta `frontend/dist`.
4. Para desenvolvimento local: `npm run dev`.

## Implementação do WebSocket
O sistema utiliza **Socket.io** para comunicação em tempo real.
- **Backend**: Emite eventos (`student_created`, `student_updated`, `student_deleted`, etc.) sempre que uma operação de escrita ocorre.
- **Frontend**: Utiliza um hook customizado `useWebSocket` que gerencia a conexão única e expõe o objeto `socket` para os componentes.
- **Custom Hook (`useWebSocket.ts`)**:
  - Inicializa a conexão com o servidor na montagem.
  - Gerencia o estado de conexão (`isConnected`).
  - Realiza a limpeza (disconnect) ao desmontar.

## Exemplos de Rotas da API

### Students
- `GET /api/students`: Lista todos os alunos.
- `GET /api/students/:id`: Detalhes de um aluno.
- `POST /api/students`: Cria um novo aluno.
  - Body: `{ "name": "Maria", "age": 10, "grade": "5º Ano" }`
- `PUT /api/students/:id`: Atualiza um aluno.
- `DELETE /api/students/:id`: Remove um aluno.

### Courses
- `GET /api/courses`: Lista todos os cursos.
- ... (CRUD padrão similar a Students)

---
**Desenvolvido para a Prova Final de 2025/2.**
