// app/team/[id].jsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useTeamStore from '../../store/teamStore';
import { teamMemberApi } from '../../services/teamMemberApi';
import { projectApi } from '../../services/projectApi'; 
import { taskApi } from '../../services/taskApi';     

function MemberDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { teamMembers, updateTeamMember, deleteTeamMember } = useTeamStore();
  const insets = useSafeAreaInsets(); // Obtém os insets da área segura para ajustar o layout

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]); // Estado para armazenar todos os projetos
  const [tasks, setTasks] = useState([]);     // Estado para armazenar todas as tarefas
  const [deleted, setDeleted] = useState(false);

  // Callback para exibir mensagens de alerta ao usuário
  const showMessage = useCallback((title, text) => {
    Alert.alert(title, text);
  }, []);

  // Efeito para buscar os detalhes do membro e dados relacionados (projetos/tarefas)
  useEffect(() => {
    const fetchMemberData = async () => {
      if (!id) {
        console.warn("FRONTEND DEBUG - [MemberDetail] ID não encontrado na rota.");
        showMessage('Erro', 'ID do membro não fornecido.');
        setLoading(false);
        return;
      }

      console.log("FRONTEND DEBUG - [MemberDetail] ID recebido na rota:", id);
      setLoading(true); // Inicia o estado de carregamento
      try {
        // Tenta encontrar o membro no store global primeiro (mais rápido)
        const foundMember = teamMembers.find(m => m.id === id); 
        if (foundMember) {
          setMember(foundMember);
          console.log("FRONTEND DEBUG - [MemberDetail] Membro encontrado no store:", foundMember);
        } else {
          // Se não estiver no store, busca na API
          console.log("FRONTEND DEBUG - [MemberDetail] Membro não encontrado no store, buscando na API com ID:", id);
          const apiMember = await teamMemberApi.getById(id);
          setMember(apiMember);
          console.log("FRONTEND DEBUG - [MemberDetail] Dados do membro buscados da API:", apiMember);
        }
      } catch (error) {
        console.error('FRONTEND DEBUG - [MemberDetail] Erro ao buscar detalhes do membro (catch block):', error.message || error);
        
        // Trata erros de rede ou 404 (membro não encontrado/deletado) com redirecionamento imediato
        if (error.response && error.response.status === 404) {
          showMessage('Membro Não Encontrado', 'O membro que você tentou acessar não existe mais ou foi excluído.');
          router.replace('/tabs/team'); // Redireciona para a lista de membros
          return; // Importante para parar a execução após o redirecionamento
        } else if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
          showMessage('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão e a URL do backend.');
          router.replace('/tabs/team'); // Redireciona para a lista de membros
          return; // Importante para parar a execução após o redirecionamento
        }

        // Logs detalhados para outros tipos de erro, caso não sejam 404 ou Network Error
        if (error.response) {
            console.error("FRONTEND DEBUG - [MemberDetail] Detalhes do erro de resposta da API (status/data):", error.response.status, JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("FRONTEND DEBUG - [MemberDetail] Erro de requisição (não houve resposta do servidor).", error.request);
        } else {
            console.error("FRONTEND DEBUG - [MemberDetail] Erro de configuração Axios/JS:", error.message);
        }
        
        showMessage('Erro na API', `Não foi possível carregar os detalhes do membro: ${error.message || 'Erro desconhecido'}`);
        setMember(null); // Limpa o membro em caso de erro grave
      } finally {
        setLoading(false); // Finaliza o estado de carregamento
      }
    };

    // Função para buscar todos os projetos e tarefas do backend para exibição dos nomes completos
    const fetchAllRelatedData = async () => {
      try {
        console.log("FRONTEND DEBUG - [MemberDetail] Buscando todos os projetos e tarefas para display...");
        const [allProjects, allTasks] = await Promise.all([
          projectApi.getAll(),
          taskApi.getAll()
        ]);
        setProjects(allProjects || []); // Garante que é um array, mesmo se a API retornar null/undefined
        setTasks(allTasks || []);     // Garante que é um array
      } catch (e) {
        console.error("FRONTEND DEBUG - [MemberDetail] Erro ao buscar projetos/tarefas:", e.message);
        setProjects([]); // Limpa as listas em caso de erro
        setTasks([]);
      }
    };

    if (deleted) return; // Não busca se já foi deletado

    fetchMemberData();      // Chama a função principal para buscar os dados do membro
    fetchAllRelatedData();  // Chama a função para buscar dados relacionados
  }, [id, teamMembers, showMessage, router, deleted]); // Dependências do useEffect

  // Lógica para atualizar os dados do membro no backend
  const handleUpdate = async () => {
    setSaving(true); // Ativa o estado de salvamento
    console.log("FRONTEND DEBUG - [MemberDetail] Tentando atualizar membro. Dados enviados:", member);
    try {
      if (!member.name || !member.role || !member.email) {
        showMessage('Validação', 'Nome, função e email são obrigatórios.');
        setSaving(false);
        return;
      }
      
      const updated = await teamMemberApi.update(member); // Chama a API para atualizar
      updateTeamMember(updated); // Atualiza o membro no store global do Zustand
      showMessage('Sucesso', 'Membro atualizado com sucesso!');
      setEditing(false); // Sai do modo de edição
    } catch (error) {
      console.error('FRONTEND DEBUG - [MemberDetail] Erro ao atualizar membro:', error);
      showMessage('Erro', `Não foi possível atualizar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSaving(false); // Desativa o estado de salvamento
    }
  };
  
  // Lógica para excluir o membro
  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este membro?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await teamMemberApi.delete(member.id);
              deleteTeamMember(member.id); // Atualiza o store
              setDeleted(true);
              showMessage('Sucesso', 'Membro excluído com sucesso!');
              router.replace('/tabs/team'); // Redireciona para a lista
            } catch (error) {
              console.error('FRONTEND DEBUG - [MemberDetail] Erro ao excluir:', error);
              showMessage('Erro', `Não foi possível excluir: ${error.message || 'Erro desconhecido'}`);
            }
          }
        }
      ]
    );
  };

  // Renderiza um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando detalhes do membro...</Text>
      </View>
    );
  }

  // Renderiza uma mensagem de erro se o membro não for encontrado após o carregamento
  if (!member) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>Membro não encontrado ou erro ao carregar.</Text>
        <Button title="Voltar" onPress={() => router.back()} style={styles.backButton} />
      </View>
    );
  }

  // Se o membro foi deletado, não renderiza nada (pode redirecionar para outra tela no futuro)
  if (deleted) return null;

  // Renderiza a tela de detalhes/edição do membro
  return (
    <View style={styles.screenContainer}>
      {/* ScrollView para permitir rolagem do conteúdo. Padding inferior ajustado com insets para não cobrir a barra de navegação. */}
      <ScrollView contentContainerStyle={[styles.scrollViewContent, { paddingBottom: insets.bottom + 80 }]}> 
        <Text style={styles.title}>{editing ? 'Editar Membro' : 'Detalhes do Membro'}</Text>

        <Input
          label="Nome"
          value={member.name ? String(member.name) : ''}
          onChangeText={(text) => setMember({ ...member, name: text })}
          editable={editing}
          placeholder="Nome Completo"
        />
        <Input
          label="Função"
          value={member.role ? String(member.role) : ''}
          onChangeText={(text) => setMember({ ...member, role: text })}
          editable={editing}
          placeholder="Desenvolvedor, Designer, etc."
        />
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Descrição</Text>
          <Input
            value={member.description ? String(member.description) : ''}
            onChangeText={(text) => setMember({ ...member, description: text })}
            editable={editing}
            placeholder="Descrição detalhada"
            multiline={true}
            style={styles.multilineInputField}
          />
        </View>
        <Input
          label="Email"
          value={member.email ? String(member.email) : ''}
          onChangeText={(text) => setMember({ ...member, email: text })}
          editable={editing}
          placeholder="email@example.com"
          keyboardType="email-address"
        />
        
        {/* Exibe os projetos associados, buscando o nome completo se disponível */}
        {member.associatedProjects && member.associatedProjects.length > 0 && (
          <View style={styles.associationsContainer}>
            <Text style={styles.associationsTitle}>Projetos Associados:</Text>
            {member.associatedProjects.map((projectId, index) => {
              // Tenta encontrar o projeto completo pela ID
              const project = projects.find(p => String(p.id) === String(projectId));
              return (
                <Text key={index} style={styles.associationItem}>
                  - {project ? project.name : `ID: ${projectId}`} {/* Exibe o nome ou o ID */}
                </Text>
              );
            })}
          </View>
        )}
        
        {/* Exibe as tarefas associadas, buscando o nome completo se disponível */}
        {member.associatedTasks && member.associatedTasks.length > 0 && (
          <View style={styles.associationsContainer}>
            <Text style={styles.associationsTitle}>Tarefas Associadas:</Text>
            {member.associatedTasks.map((taskId, index) => {
              // Tenta encontrar a tarefa completa pela ID
              const task = tasks.find(t => String(t.id) === String(taskId));
              return (
                <Text key={index} style={styles.associationItem}>
                  - {task ? task.name : `ID: ${taskId}`} {/* Exibe o nome ou o ID */}
                </Text>
              );
            })}
          </View>
        )}

        {/* Substitua o ButtonContainer existente por este */}
        <View style={styles.buttonContainer}>
          {editing ? (
            <>
              <Button 
                title="Salvar Alterações" 
                onPress={handleUpdate} 
                style={styles.actionButton} 
                disabled={saving} 
              />
              <Button 
                title="Cancelar Edição" 
                onPress={() => setEditing(false)} 
                style={styles.cancelButton} 
                disabled={saving} 
              />
            </>
          ) : (
            <>
              <Button 
                title="Editar Membro" 
                onPress={() => setEditing(true)} 
                style={styles.actionButton} 
              />
              <Button 
                title="Excluir Membro" 
                onPress={handleDelete} 
                style={styles.deleteButton} 
              />
              <Button 
                title="Voltar" 
                onPress={() => router.replace('/tabs/team')} 
                style={styles.backButton} 
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    alignItems: 'center',
    // O paddingBottom dinâmico é aplicado diretamente no componente ScrollView, não aqui.
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    color: '#343a40',
    marginBottom: 5,
    fontWeight: '500',
  },
  multilineInputField: {
    backgroundColor: '#fff',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#495057',
    width: '100%',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  associationsContainer: {
    width: '100%',
    marginTop: 15,
    padding: 15,
    backgroundColor: '#e9f7ef',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#28a745',
  },
  associationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  associationItem: {
    fontSize: 16,
    color: '#343a40',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#007bff',
    flex: 1,
    minWidth: '45%',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    flex: 1,
    minWidth: '45%',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    flex: 1,
    minWidth: '45%',
  },
  backButton: {
    backgroundColor: '#17a2b8',
    flex: 1,
    minWidth: '45%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorMessage: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default MemberDetailScreen;
