const request = require('supertest');
const { app, teamMembers } = require('./server');

describe('DELETE /team-members/:id', () => {
    let testMember;
    
    beforeEach(() => {
        // Limpa os dados antes de cada teste
        teamMembers.length = 0;
        
        // Adiciona um membro de teste
        testMember = {
            id: '123-test-id',
            name: 'Test User',
            role: 'Tester',
            email: 'test@test.com',
            description: 'Test description',
            associatedProjects: [],
            associatedTasks: []
        };
        teamMembers.push(testMember);
    });

    it('should delete an existing team member', async () => {
        const response = await request(app)
            .delete(`/team-members/${testMember.id}`)
            .expect(200);

        expect(response.body.message).toBe('Membro da equipe deletado com sucesso.');
        expect(teamMembers.length).toBe(0);
    });

    it('should return 404 if member not found', async () => {
        const response = await request(app)
            .delete('/team-members/nonexistent-id')
            .expect(404);

        expect(response.body.message).toBe('Membro da equipe não encontrado.');
        expect(teamMembers.length).toBe(1);
    });
});