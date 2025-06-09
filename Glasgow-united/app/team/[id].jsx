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
  const insets = useSafeAreaInsets();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [deleted, setDeleted] = useState(false);

  const showMessage = useCallback((title, text) => {
    Alert.alert(title, text);
  }, []);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!id) {
        console.warn("FRONTEND DEBUG - [MemberDetail] ID não encontrado na rota.");
        showMessage('Erro', 'ID do membro não fornecido.');
        setLoading(false);
        return;
      }

      console.log("FRONTEND DEBUG - [MemberDetail] ID recebido na rota:", id);
      setLoading(true);
      try {
        const foundMember = teamMembers.find(m => m.id === id); 
        if (foundMember) {
          setMember(foundMember);
          console.log("FRONTEND DEBUG - [MemberDetail] Membro encontrado no store:", foundMember);
        } else {
          console.log("FRONTEND DEBUG - [MemberDetail] Membro não encontrado no store, buscando na API com ID:", id);
          const apiMember = await teamMemberApi.getById(id);
          setMember(apiMember);
          console.log("FRONTEND DEBUG - [MemberDetail] Dados do membro buscados da API:", apiMember);
        }
      } catch (error) {
        console.error('FRONTEND DEBUG - [MemberDetail] Erro ao buscar detalhes do membro (catch block):', error.message || error);
        
        if (error.response && error.response.status === 404) {
          showMessage('Membro Não Encontrado', 'O membro que você tentou acessar não existe mais ou foi excluído.');
          router.replace('/tabs/team'); 
          return;
        } else if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
          showMessage('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão e a URL do backend.');
          router.replace('/tabs/team'); 
          return;
        }

        if (error.response) {
            console.error("FRONTEND DEBUG - [MemberDetail] Detalhes do erro de resposta da API (status/data):", error.response.status, JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("FRONTEND DEBUG - [MemberDetail] Erro de requisição (não houve resposta do servidor).", error.request);
        } else {
            console.error("FRONTEND DEBUG - [MemberDetail] Erro de configuração Axios/JS:", error.message);
        }
        
        showMessage('Erro na API', `Não foi possível carregar os detalhes do membro: ${error.message || 'Erro desconhecido'}`);
        setMember(null); 
      } finally {
        setLoading(false);
      }
    };

    const fetchAllRelatedData = async () => {
      try {
        console.log("FRONTEND DEBUG - [MemberDetail] Buscando todos os projetos e tarefas para display...");
        const [allProjects, allTasks] = await Promise.all([
          projectApi.getAll(),
          taskApi.getAll()
        ]);
        setProjects(allProjects || []);
        setTasks(allTasks || []);
      } catch (e) {
        console.error("FRONTEND DEBUG - [MemberDetail] Erro ao buscar projetos/tarefas:", e.message);
        setProjects([]);
        setTasks([]);
      }
    };

    if (deleted) return;

    fetchMemberData();
    fetchAllRelatedData();
  }, [id, teamMembers, showMessage, router, deleted]);

  const handleUpdate = async () => {
    setSaving(true);
    console.log("FRONTEND DEBUG - [MemberDetail] Tentando atualizar membro. Dados enviados:", member);
    try {
      if (!member.name || !member.name || !member.email) {
        showMessage('Validação', 'Nome, função e email são obrigatórios.');
        setSaving(false);
        return;
      }
      
      const updated = await teamMemberApi.update(member);
      updateTeamMember(updated); 
      showMessage('Sucesso', 'Membro atualizado com sucesso!');
      setEditing(false); 
    } catch (error) {
      console.error('FRONTEND DEBUG - [MemberDetail] Erro ao atualizar membro:', error);
      showMessage('Erro', `Não foi possível atualizar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir ${member?.name || 'este membro'}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await teamMemberApi.delete(id);
              deleteTeamMember(id);
              setDeleted(true);
              showMessage('Sucesso', 'Membro excluído com sucesso!');
              router.replace('/tabs/team');
            } catch (error) {
              console.error('FRONTEND DEBUG - [MemberDetail] Erro ao excluir membro:', error);
              showMessage('Erro', `Não foi possível excluir: ${error.message || 'Erro desconhecido'}`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando detalhes do membro...</Text>
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>Membro não encontrado ou erro ao carregar.</Text>
        <Button title="Voltar" onPress={() => router.back()} style={styles.backButton} />
      </View>
    );
  }

  if (deleted) return null;

  return (
    <View style={styles.screenContainer}>
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
        
        {member.associatedProjects && member.associatedProjects.length > 0 && (
          <View style={styles.associationsContainer}>
            <Text style={styles.associationsTitle}>Projetos Associados:</Text>
            {member.associatedProjects.map((projectId, index) => {
              const project = projects.find(p => String(p.id) === String(projectId));
              return (
                <Text key={index} style={styles.associationItem}>
                  - {project ? project.name : `ID: ${projectId}`}
                </Text>
              );
            })}
          </View>
        )}
        
        {member.associatedTasks && member.associatedTasks.length > 0 && (
          <View style={styles.associationsContainer}>
            <Text style={styles.associationsTitle}>Tarefas Associadas:</Text>
            {member.associatedTasks.map((taskId, index) => {
              const task = tasks.find(t => String(t.id) === String(taskId));
              return (
                <Text key={index} style={styles.associationItem}>
                  - {task ? task.name : `ID: ${taskId}`}
                </Text>
              );
            })}
          </View>
        )}

        <View style={styles.buttonContainer}>
          {editing ? (
            <>
              <Button title="Salvar Alterações" onPress={handleUpdate} style={styles.actionButton} disabled={saving} />
              <Button title="Cancelar Edição" onPress={() => setEditing(false)} style={styles.cancelButton} disabled={saving} />
            </>
          ) : (
            <>
              <Button title="Editar Membro" onPress={() => setEditing(true)} style={styles.actionButton} />
              <Button title="Excluir Membro" onPress={handleDelete} style={styles.deleteButton} />
              <Button title="Voltar" onPress={() => router.back()} style={styles.backButton} />
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
    marginTop: 10, 
  },
  backButton: {
    backgroundColor: '#17a2b8',
    flex: 1,
    minWidth: '45%',
    marginTop: 10,
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
