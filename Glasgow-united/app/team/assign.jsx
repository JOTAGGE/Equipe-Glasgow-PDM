// app/team/assign.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView } from 'react-native'; // <--- ScrollView IMPORTADO AQUI
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

// Caminhos de importação para ../../ (subindo dois níveis da raiz do projeto)
import Button from '../../components/common/Button';
import useProjectStore from '../../store/projectStore';
import useTaskStore from '../../store/taskStore';
import useTeamStore from '../../store/teamStore'; // Para atualizar o membro no store
import { projectApi } from '../../services/projectApi';
import { taskApi } from '../../services/taskApi';
import { teamMemberApi } from '../../services/teamMemberApi';


function AssignProjectTaskModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { memberId, memberProjects: initialMemberProjectsJson, memberTasks: initialMemberTasksJson } = useLocalSearchParams();

  const initialMemberProjects = initialMemberProjectsJson ? JSON.parse(initialMemberProjectsJson) : [];
  const initialMemberTasks = initialMemberTasksJson ? JSON.parse(initialMemberTasksJson) : [];

  const { projects, setProjects } = useProjectStore();
  const { tasks, setTasks } = useTaskStore();
  const { updateTeamMember } = useTeamStore(); // Para atualizar o membro no store global

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState(new Set(initialMemberProjects));
  const [selectedTasks, setSelectedTasks] = useState(new Set(initialMemberTasks));

  const showMessage = useCallback((title, text) => {
    Alert.alert(title, text);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const projectsResponse = await projectApi.getAll();
        setProjects(projectsResponse.data);
        const tasksResponse = await taskApi.getAll();
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error('Erro ao carregar projetos/tarefas:', error);
        showMessage('Erro', 'Não foi possível carregar projetos e tarefas.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [setProjects, setTasks, showMessage]);

  const toggleSelection = (item, type) => {
    if (type === 'project') {
      setSelectedProjects(prev => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    } else if (type === 'task') {
      setSelectedTasks(prev => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    }
  };

  const handleSaveAssociations = async () => {
    setSaving(true);
    try {
      const memberResponse = await teamMemberApi.getById(memberId);
      let currentMember = memberResponse.data;

      if (!currentMember) {
        showMessage('Erro', 'Membro não encontrado para associação.');
        setSaving(false);
        return;
      }

      currentMember = {
        ...currentMember,
        associatedProjects: Array.from(selectedProjects),
        associatedTasks: Array.from(selectedTasks),
      };

      const response = await teamMemberApi.update(currentMember);
      const updated = response.data;
      updateTeamMember(updated); // Atualiza o store global
      showMessage('Sucesso', 'Associações salvas com sucesso!');
      router.back(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao salvar associações:', error);
      showMessage('Erro', `Não foi possível salvar associações: ${error.message || error.response?.data}`);
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item, type, isSelected }) => (
    <TouchableOpacity
      style={[styles.itemContainer, isSelected && styles.selectedItem]}
      onPress={() => toggleSelection(item, type)}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <FontAwesome
        name={isSelected ? 'check-circle' : 'circle-o'}
        size={20}
        color={isSelected ? '#28a745' : '#6c757d'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.modalContainer, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <Text style={styles.modalTitle}>Associar Projetos/Tarefas</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.sectionHeading}>Projetos Disponíveis:</Text>
          <FlatList
            data={projects}
            renderItem={({ item }) => renderItem({ item, type: 'project', isSelected: selectedProjects.has(item.id) })}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhum projeto disponível.</Text>}
          />

          <Text style={styles.sectionHeading}>Tarefas Disponíveis:</Text>
          <FlatList
            data={tasks}
            renderItem={({ item }) => renderItem({ item, type: 'task', isSelected: selectedTasks.has(item.id) })}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhuma tarefa disponível.</Text>}
          />
        </ScrollView>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={saving ? 'Salvando...' : 'Salvar Associações'}
          onPress={handleSaveAssociations}
          style={styles.saveButton}
          disabled={saving}
        />
      </View>

      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Salvando...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    padding: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 15,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  selectedItem: {
    borderColor: '#007bff',
    backgroundColor: '#e6f7ff',
  },
  itemName: {
    fontSize: 16,
    color: '#343a40',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#28a745',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    zIndex: 1000,
  },
});

export default AssignProjectTaskModal;