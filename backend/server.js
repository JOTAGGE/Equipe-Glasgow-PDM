// backend/server.js
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// --- Dados em Memória (simulando um banco de dados simples) ---
// Estes dados são persistidos apenas enquanto o servidor estiver rodando.
// Ao reiniciar o servidor, os dados são resetados para os valores abaixo.
let teamMembers = [
    { id: uuidv4(), name: 'Alice Smith', role: 'Desenvolvedora Frontend', email: 'alice.s@example.com', description: 'Especialista em React Native.', associatedProjects: [], associatedTasks: [] },
    { id: uuidv4(), name: 'Bob Johnson', role: 'Desenvolvedor Backend', email: 'bob.j@example.com', description: 'Mestre em Node.js e bancos de dados.', associatedProjects: [], associatedTasks: [] },
    { id: uuidv4(), name: 'Charlie Brown', role: 'UI/UX Designer', email: 'charlie.b@example.com', description: 'Cria interfaces de usuário incríveis.', associatedProjects: [], associatedTasks: [] },
    { id: uuidv4(), name: 'David Lee', role: 'Gerente de Projeto', email: 'david.l@example.com', description: 'Gerencia projetos e equipes com eficiência.', associatedProjects: [], associatedTasks: [] },
    { id: uuidv4(), name: 'Eve White', role: 'Analista de QA', email: 'eve.w@example.com', description: 'Garante a qualidade do software através de testes rigorosos.', associatedProjects: [], associatedTasks: [] },
];

let projects = [
    { id: uuidv4(), name: 'Projeto Alpha', description: 'Desenvolvimento de um novo aplicativo móvel.' },
    { id: uuidv4(), name: 'Website Beta', description: 'Redesenho completo do site da empresa.' },
    { id: uuidv4(), name: 'Sistema de Vendas', description: 'Implementação de um sistema de vendas interno.' },
    { id: uuidv4(), name: 'Plataforma de E-learning', description: 'Criação de uma plataforma online para cursos.' },
    { id: uuidv4(), name: 'Aplicativo de Delivery', description: 'Desenvolvimento de um aplicativo para entrega de alimentos.' },
];

let tasks = [
    { id: uuidv4(), name: 'Configurar ambiente de desenvolvimento', description: 'Instalar todas as ferramentas e dependências necessárias.' },
    { id: uuidv4(), name: 'Desenvolver tela de login', description: 'Implementar a interface e lógica de login.' },
    { id: uuidv4(), name: 'Criar API de produtos', description: 'Desenvolver endpoints para gerenciamento de produtos.' },
    { id: uuidv4(), name: 'Criar documentação da API', description: 'Escrever documentação completa para todos os endpoints da API.' },
    { id: uuidv4(), name: 'Testar usabilidade da tela principal', description: 'Realizar testes com usuários para feedback da tela inicial.' },
    { id: uuidv4(), name: 'Implementar funcionalidade de carrinho', description: 'Desenvolver o carrinho de compras no aplicativo.' },
    { id: uuidv4(), name: 'Otimizar queries do banco de dados', description: 'Melhorar a performance das consultas ao DB.' },
];

// --- Rotas da API ---

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Bem-vindo à API de Gerenciamento de Equipe! Acesse /team-members, /projects ou /tasks.' });
});

app.get('/team-members', (req, res) => {
    console.log("BACKEND DEBUG: Requisição GET /team-members recebida.");
    console.log("BACKEND DEBUG: Enviando todos os membros:", teamMembers); // Log dos membros sendo enviados
    res.json(teamMembers);
});

app.get('/team-members/:id', (req, res) => {
    const { id } = req.params;
    const member = teamMembers.find(m => m.id === id);
    if (member) {
        console.log(`BACKEND DEBUG: Membro com ID ${id} encontrado.`);
        res.json(member);
    } else {
        console.warn(`BACKEND DEBUG: Membro com ID ${id} não encontrado.`);
        res.status(404).json({ message: 'Membro da equipe não encontrado.' });
    }
});

app.post('/team-members', (req, res) => {
    console.log("BACKEND DEBUG: Dados recebidos na requisição POST /team-members:", req.body);
    const newId = uuidv4();
    const newMember = {
        id: newId,
        name: req.body.name || '',
        role: req.body.role || '',
        email: req.body.email || '',
        description: req.body.description || '',
        associatedProjects: Array.isArray(req.body.associatedProjects) ? req.body.associatedProjects : [],
        associatedTasks: Array.isArray(req.body.associatedTasks) ? req.body.associatedTasks : []
    };
    teamMembers.push(newMember);
    console.log("BACKEND DEBUG: Objeto de novo membro criado e enviado:", newMember);
    res.status(201).json(newMember);
});

app.put('/team-members/:id', (req, res) => {
    const { id } = req.params;
    const memberIndex = teamMembers.findIndex(m => m.id === id);

    if (memberIndex !== -1) {
        const existingMember = teamMembers[memberIndex];
        teamMembers[memberIndex] = { 
            ...existingMember,
            ...req.body, 
            id: id,
            associatedProjects: req.body.associatedProjects !== undefined ? req.body.associatedProjects : existingMember.associatedProjects,
            associatedTasks: req.body.associatedTasks !== undefined ? req.body.associatedTasks : existingMember.associatedTasks
        };
        console.log(`BACKEND DEBUG: Membro com ID ${id} atualizado.`, teamMembers[memberIndex]);
        res.json(teamMembers[memberIndex]);
    } else {
        console.warn(`BACKEND DEBUG: Tentativa de atualização: Membro com ID ${id} não encontrado.`);
        res.status(404).json({ message: 'Membro da equipe não encontrado.' });
    }
});

app.delete('/team-members/:id', (req, res) => {
    const { id } = req.params;
    const memberIndex = teamMembers.findIndex(m => m.id === id);
    if (memberIndex !== -1) {
        const deletedMember = teamMembers[memberIndex];
        teamMembers.splice(memberIndex, 1);
        console.log(`BACKEND DEBUG: Membro com ID ${id} deletado.`, deletedMember);
        res.status(200).json({ message: 'Membro da equipe deletado com sucesso.' });
    } else {
        console.warn(`BACKEND DEBUG: Tentativa de exclusão: Membro com ID ${id} não encontrado.`);
        res.status(404).json({ message: 'Membro da equipe não encontrado.' });
    }
});

app.get('/projects', (req, res) => {
    console.log("BACKEND DEBUG: Requisição GET /projects recebida. Enviando todos os projetos.");
    res.json(projects);
});

app.get('/projects/:id', (req, res) => {
    const { id } = req.params;
    const project = projects.find(p => p.id === id);
    if (project) {
        console.log(`BACKEND DEBUG: Projeto com ID ${id} encontrado.`);
        res.json(project);
    } else {
        console.warn(`BACKEND DEBUG: Projeto com ID ${id} não encontrado.`);
        res.status(404).json({ message: 'Projeto não encontrado.' });
    }
});

app.get('/tasks', (req, res) => {
    console.log("BACKEND DEBUG: Requisição GET /tasks recebida. Enviando todas as tarefas.");
    res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(t => t.id === id);
    if (task) {
        console.log(`BACKEND DEBUG: Tarefa com ID ${id} encontrada.`);
        res.json(task);
    } else {
        console.warn(`BACKEND DEBUG: Tarefa com ID ${id} não encontrada.`);
        res.status(404).json({ message: 'Tarefa não encontrada.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`Para testar endpoints de API no navegador, tente: http://localhost:${PORT}/team-members`);
});
