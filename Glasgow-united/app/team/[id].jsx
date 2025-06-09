// app/team/[id].jsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'; // Para ícones do botão de adicionar

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useTeamStore from '../../store/teamStore';
import useProjectStore from '../../store/projectStore';
import useTaskStore from '../../store/taskStore';
import { teamMemberApi } from '../../services/teamMemberApi';
import { projectApi } from '../../services/projectApi';
import { taskApi } from '../../services/taskApi';

function TeamMemberDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamStore();
  const { projects, setProjects } = useProjectStore();
  const { tasks, setTasks } = useTaskStore();

  const [member, setMember] = useState({ id: '', name: '', role: '', email: '', description: '', associatedProjects: [], associatedTasks: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false); // Estado para controlar o modal de associação

  const isNewMember = id === 'new';

  const showMessage = useCallback((title, text) => {
    Alert.alert(title, text);
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      if (!isNewMember) {
        const response = await teamMemberApi.getById(id);
        const fetchedMember = response.data;
        if (fetchedMember) {
          setMember(fetchedMember);
          setIsEditing(false);
        } else {
          showMessage('Erro', 'Membro da equipe não encontrado.');
          router.replace('/team');
        }
      } else {
          setMember({ id: '', name: '', role: '', email: '', description: '', associatedProjects: [], associatedTasks: [] });
          setIsEditing(true);
      }

      const projectsResponse = await projectApi.getAll();
      setProjects(projectsResponse.data);
      const tasksResponse = await taskApi.getAll();
      setTasks(tasksResponse.data);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showMessage('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  }, [id, isNewMember, setProjects, setTasks, router, showMessage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);


  const handleGenerateDescription = async () => {
    if (!member.role) {
      showMessage('Atenção', 'Por favor, insira uma função antes de gerar uma descrição.');
      return;
    }
    setGeneratingDescription(true);
    try {
      const prompt = `Gere uma descrição detalhada para a função de "${member.role}". A descrição deve ser concisa, focada nas responsabilidades principais e habilidades necessárias. Max 100 palavras.`;
      
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // A chave da API é fornecida automaticamente no ambiente Canvas.
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AIzaSyA-g3mc6Sx-ViqxV9JXdeEAnXIJkeFUFdY}`;
      const response = await axios.post(apiUrl, payload, {
          headers: { 'Content-Type': 'application/json' }
      });
      const result = response.data;

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setMember((prevMember) => ({ ...prevMember, description: text }));
        showMessage('Sucesso', 'Descrição gerada com sucesso!');
      } else {
        console.error('Estrutura de resposta inesperada da API Gemini:', result);
        showMessage('Erro', 'Não foi possível gerar a descrição. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao chamar a API Gemini:', error);
      showMessage('Erro', `Falha ao gerar descrição: ${error.message || error.response?.data}`);
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNewMember) {
        if (!member.name || !member.role || !member.email) {
            showMessage('Validação', 'Todos os campos são obrigatórios para um novo membro.');
            setSaving(false);
            return;
        }
        const response = await teamMemberApi.create(member);
        const newMember = response.data;
        addTeamMember(newMember);
        showMessage('Sucesso', 'Membro da equipe adicionado!');
        router.replace(`/team/${newMember.id}`);
      } else {
        const response = await teamMemberApi.update(member);
        const updated = response.data;
        updateTeamMember(updated);
        showMessage('Sucesso', 'Membro da equipe atualizado!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      showMessage('Erro', `Não foi possível salvar: ${error.message || error.response?.data}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir ${member.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            setSaving(true);
            try {
              await teamMemberApi.delete(member.id);
              deleteTeamMember(member.id);
              showMessage('Sucesso', 'Membro da equipe excluído!');
              router.replace('/team');
            } catch (error) {
              console.error('Erro ao excluir membro:', error);
              showMessage('Erro', `Não foi possível excluir: ${error.message || error.response?.data}`);
            } finally {
              setSaving(false);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Filtra projetos e tarefas associadas com base nos IDs que o membro possui
  const memberProjects = projects.filter(project => member.associatedProjects?.includes(project.id));
  const memberTasks = tasks.filter(task => member.associatedTasks?.includes(task.id));

  // Função para lidar com a associação de um projeto/tarefa
  const handleAssociate = useCallback(async (selectedItem, type) => {
    setSaving(true);
    try {
      let updatedMember = { ...member };
      if (type === 'project') {
        updatedMember.associatedProjects = updatedMember.associatedProjects ? [...updatedMember.associatedProjects, selectedItem.id] : [selectedItem.id];
      } else if (type === 'task') {
        updatedMember.associatedTasks = updatedMember.associatedTasks ? [...updatedMember.associatedTasks, selectedItem.id] : [selectedItem.id];
      }
      
      const response = await teamMemberApi.update(updatedMember);
      const updated = response.data;
      updateTeamMember(updated); // Atualiza o store global
      setMember(updated); // Atualiza o estado local do membro
      showMessage('Sucesso', `${selectedItem.name} ${type === 'project' ? 'associado' : 'associada'}!`);
      setShowAssignModal(false); // Fecha o modal
    } catch (error) {
      console.error(`Erro ao associar ${type}:`, error);
      showMessage('Erro', `Não foi possível associar: ${error.message || error.response?.data}`);
    } finally {
      setSaving(false);
    }
  }, [member, showMessage, updateTeamMember]);


  return (
    <View style={styles.screenContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>{isNewMember ? 'Adicionar Novo Membro' : 'Detalhes do Membro da Equipe'}</Text>

          <Input
            label="Nome"
            value={member.name}
            onChangeText={(text) => setMember({ ...member, name: text })}
            placeholder="Nome Completo"
            editable={isEditing}
          />
          <Input
            label="Função"
            value={member.role}
            onChangeText={(text) => setMember({ ...member, role: text })}
            placeholder="Desenvolvedor, Designer, etc."
            editable={isEditing}
            rightAccessory={
              isEditing && (
                <Button
                  title={generatingDescription ? 'Gerando...' : '✨ Gerar Descrição'}
                  onPress={handleGenerateDescription}
                  style={styles.generateDescriptionButton}
                  disabled={generatingDescription}
                  textStyle={styles.generateDescriptionButtonText}
                />
              )
            }
          />
          <Input
            label="Descrição da Função"
            value={member.description}
            onChangeText={(text) => setMember({ ...member, description: text })}
            placeholder="Detalhes sobre as responsabilidades da função."
            editable={isEditing}
            keyboardType="default"
          />
          <Input
            label="Email"
            value={member.email}
            onChangeText={(text) => setMember({ ...member, email: text })}
            placeholder="email@example.com"
            keyboardType="email-address"
            editable={isEditing}
          />

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <Button
                  title="Salvar"
                  onPress={handleSave}
                  style={styles.actionButton}
                  disabled={saving}
                />
                {!isNewMember && (
                  <Button
                    title="Cancelar"
                    onPress={() => {
                      const originalMember = teamMembers.find(m => m.id === id);
                      setMember(originalMember || { id: '', name: '', role: '', email: '', description: '' });
                      setIsEditing(false);
                    }}
                    style={styles.cancelButton}
                    disabled={saving}
                  />
                )}
              </>
            ) : (
              <>
                <Button
                  title="Editar"
                  onPress={() => setIsEditing(true)}
                  style={styles.actionButton}
                />
                <Button
                  title="Excluir"
                  onPress={handleDelete}
                  style={styles.deleteButton}
                />
              </>
            )}
          </View>

          {!isNewMember && ( // Só mostra informações relacionadas se não for um novo membro
            <>
              <View style={styles.relatedInfoContainer}>
                <Text style={styles.sectionTitle}>Projetos Associados:</Text>
                {memberProjects.length === 0 ? (
                  <Text style={styles.emptyMessage}>Nenhum projeto associado.</Text>
                ) : (
                  memberProjects.map(project => (
                    <View key={project.id} style={styles.relatedItem}>
                      <Text style={styles.relatedItemTitle}>{project.name}</Text>
                      <Text style={styles.relatedItemDescription}>{project.description}</Text>
                    </View>
                  ))
                )}
              </View>

              <View style={styles.relatedInfoContainer}>
                <Text style={styles.sectionTitle}>Tarefas Associadas:</Text>
                {memberTasks.length === 0 ? (
                  <Text style={styles.emptyMessage}>Nenhuma tarefa associada.</Text>
                ) : (
                  memberTasks.map(task => (
                    <View key={task.id} style={styles.relatedItem}>
                      <Text style={styles.relatedItemTitle}>{task.name}</Text>
                      <Text style={styles.relatedItemDescription}>{task.description}</Text>
                    </View>
                  ))
                )}
              </View>

              <Button
                title="Associar Projeto/Tarefa"
                onPress={() => router.push({
                  pathname: '/team/assign',
                  params: { memberId: member.id, memberProjects: JSON.stringify(member.associatedProjects || []), memberTasks: JSON.stringify(member.associatedTasks || []) }
                })}
                style={styles.associateButton}
              />
            </>
          )}
        </ScrollView>
      )}
      {saving && ( // Overlay de salvamento/geração
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Salvando...</Text>
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
  inputField: {
    backgroundColor: '#fff',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#495057',
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
  deleteButton: {
    backgroundColor: '#dc3545',
    flex: 1,
    marginHorizontal: 5,
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
  relatedInfoContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 15,
  },
  relatedItem: {
    backgroundColor: '#e9ecef',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  relatedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
  },
  relatedItemDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
  },
  generateDescriptionButton: {
    backgroundColor: '#6a0dad',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
    flexGrow: 0,
    alignSelf: 'flex-start',
  },
  generateDescriptionButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  associateButton: {
    backgroundColor: '#17a2b8', // Cor para o botão de associar
    marginTop: 20,
    width: '100%',
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

export default TeamMemberDetailScreen;