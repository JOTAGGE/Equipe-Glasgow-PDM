import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; 

import Button from '../../components/common/Button';
import useTeamStore from '../../store/teamStore';
import { teamMemberApi } from '../../services/teamMemberApi';
import { projectApi } from '../../services/projectApi';
import { taskApi } from '../../services/taskApi';

function AssignScreen() {
  const router = useRouter();
  const { teamMembers, setTeamMembers, updateTeamMember } = useTeamStore(); 
  
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]); 
  const [availableTasks, setAvailableTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showMessage = useCallback((title, text) => {
    Alert.alert(title, text);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("FRONTEND DEBUG - [AssignScreen] Iniciando busca de dados para atribuição...");
        
        const [membersData, projectsData, tasksData] = await Promise.all([
          teamMemberApi.getAll(), 
          projectApi.getAll(),    
          taskApi.getAll(),       
        ]);

        const filteredMembers = membersData && Array.isArray(membersData) 
                                ? membersData.filter(m => m && m.id) : [];
        setTeamMembers(filteredMembers); 

        const filteredProjects = projectsData && Array.isArray(projectsData) 
                                 ? projectsData.filter(p => p && p.id) : [];
        setAvailableProjects(filteredProjects);

        const filteredTasks = tasksData && Array.isArray(tasksData) 
                              ? tasksData.filter(t => t && t.id) : [];
        setAvailableTasks(filteredTasks);

        if (filteredMembers.length > 0) {
          setSelectedMemberId(filteredMembers[0].id);
        }

        console.log("FRONTEND DEBUG - [AssignScreen] Dados carregados com sucesso: Membros", filteredMembers.length, "Projetos", filteredProjects.length, "Tarefas", filteredTasks.length);

      } catch (error) {
        console.error('FRONTEND DEBUG - [AssignScreen] Erro ao carregar dados (catch block):', error.message || error);
        if (error.response) {
            console.error("FRONTEND DEBUG - [AssignScreen] Detalhes do erro de resposta da API (status/data):", error.response.status, JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("FRONTEND DEBUG - [AssignScreen] Erro de requisição (não houve resposta do servidor). VERIFIQUE API_BASE_URL e a conexão de rede do Codespace/celular.", error.request);
        } else {
            console.error("FRONTEND DEBUG - [AssignScreen] Erro de configuração Axios/JS:", error.message);
        }
        showMessage('Erro ao Carregar', `Não foi possível carregar os dados para atribuição. Verifique a conexão com o backend: ${error.message || 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setTeamMembers, showMessage]);

  useEffect(() => {
    if (selectedMemberId && teamMembers.length > 0) {
      const member = teamMembers.find(m => m.id === selectedMemberId);
      if (member) {
        setSelectedProjects(member.associatedProjects || []);
        setSelectedTasks(member.associatedTasks || []);
        console.log(`FRONTEND DEBUG - [AssignScreen] Membro selecionado: ${member.name}. Projetos associados: ${member.associatedProjects?.length || 0}, Tarefas associadas: ${member.associatedTasks?.length || 0}`);
      }
    } else {
      setSelectedProjects([]);
      setSelectedTasks([]);
    }
  }, [selectedMemberId, teamMembers]);

  const toggleSelection = (list, setList, itemId) => {
    if (list.includes(itemId)) {
      setList(list.filter(id => id !== itemId));
    } else {
      setList([...list, itemId]);
    }
  };

  const handleAssign = async () => {
    setSaving(true);
    if (!selectedMemberId) {
      showMessage('Atenção', 'Por favor, selecione um membro da equipe.');
      setSaving(false);
      return;
    }

    try {
      const memberToUpdate = teamMembers.find(m => m.id === selectedMemberId);
      if (!memberToUpdate) {
        showMessage('Erro', 'Membro selecionado não encontrado no estado local.');
        setSaving(false);
        return;
      }

      const updatedMemberData = {
        ...memberToUpdate,
        associatedProjects: selectedProjects,
        associatedTasks: selectedTasks,
      };

      console.log("FRONTEND DEBUG - [AssignScreen] Enviando atualização para membro:", updatedMemberData);
      const updatedMember = await teamMemberApi.update(updatedMemberData);
      updateTeamMember(updatedMember); 

      showMessage('Sucesso', 'Projetos e tarefas atribuídos com sucesso!');
      router.back(); 
    } catch (error) {
      console.error('FRONTEND DEBUG - [AssignScreen] Erro ao atribuir (catch block):', error.message || error);
      if (error.response) {
          console.error("FRONTEND DEBUG - [AssignScreen] Detalhes do erro de resposta da API (status/data):", error.response.status, JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
          console.error("FRONTEND DEBUG - [AssignScreen] Erro de requisição (não houve resposta do servidor). VERIFIQUE API_BASE_URL e a conexão de rede do Codespace/celular.", error.request);
      } else {
          console.error("FRONTEND DEBUG - [AssignScreen] Erro de configuração Axios/JS:", error.message);
      }
      showMessage('Erro', `Não foi possível atribuir projetos/tarefas: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Atribuir Projetos e Tarefas</Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Selecionar Membro:</Text>
          <Picker
            selectedValue={selectedMemberId}
            onValueChange={(itemValue) => setSelectedMemberId(itemValue)}
            style={styles.picker}
          >
            {teamMembers.length === 0 ? (
                <Picker.Item label="Nenhum membro disponível" value="" />
            ) : (
                teamMembers.map((member) => (
                    <Picker.Item key={member.id} label={member.name} value={member.id} />
                ))
            )}
          </Picker>
        </View>

        <Text style={styles.sectionTitle}>Projetos:</Text>
        {availableProjects.length === 0 ? (
          <Text style={styles.noItemsMessage}>Nenhum projeto disponível.</Text>
        ) : (
          availableProjects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={[
                styles.checkboxItem,
                selectedProjects.includes(project.id) && styles.checkboxItemSelected,
              ]}
              onPress={() => toggleSelection(selectedProjects, setSelectedProjects, project.id)}
            >
              <Text style={styles.checkboxText}>{project.name}</Text>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionTitle}>Tarefas:</Text>
        {availableTasks.length === 0 ? (
          <Text style={styles.noItemsMessage}>Nenhuma tarefa disponível.</Text>
        ) : (
          availableTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.checkboxItem,
                selectedTasks.includes(task.id) && styles.checkboxItemSelected,
              ]}
              onPress={() => toggleSelection(selectedTasks, setSelectedTasks, task.id)}
            >
              <Text style={styles.checkboxText}>{task.name}</Text>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Atribuir"
            onPress={handleAssign}
            style={styles.actionButton}
            disabled={saving || !selectedMemberId}
          />
          <Button
            title="Cancelar"
            onPress={() => router.back()}
            style={styles.cancelButton}
            disabled={saving}
          />
        </View>
      </ScrollView>
      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Atribuindo...</Text>
        </View>
      )}
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  label: {
    fontSize: 16,
    color: '#343a40',
    marginBottom: 5,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  picker: {
    width: '100%',
    color: '#495057',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    width: '100%',
  },
  checkboxItemSelected: {
    backgroundColor: '#e0f7fa',
    borderColor: '#007bff',
    borderWidth: 2,
  },
  checkboxText: {
    fontSize: 16,
    color: '#495057',
  },
  noItemsMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#007bff',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    flex: 1,
    marginHorizontal: 5,
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
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default AssignScreen;
