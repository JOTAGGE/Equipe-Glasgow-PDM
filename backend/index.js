const { app } = require('./server');
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`Para testar endpoints de API no navegador, tente: http://localhost:${PORT}/team-members`);
});