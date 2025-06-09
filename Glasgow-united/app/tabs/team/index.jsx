// app/tabs/team/index.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// Caminhos de importação para ../../../ (subindo três níveis da raiz do projeto)
import Button from '../../../components/common/Button';
import useTeamStore from '../../../store/teamStore';
import { teamMemberApi } from '../../../services/teamMemberApi';

function TeamMembersListScreen() {
  const router = useRouter();
  const { teamMembers, setTeamMembers } = useTeamStore();
  const [loading, setLoading] = useState(true);

  const showMessage = useCallback((title, text) => {
    Alert.alert(title, text);
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const response = await teamMemberApi.getAll();
        setTeamMembers(response.data);
        if (response.data.length === 0) {
            console.log("Nenhum membro da equipe encontrado na API mock.");
        }
      } catch (error) {
        console.error('Erro ao buscar membros da equipe:', error);
        showMessage('Erro na API', 'Não foi possível carregar os membros da equipe. Verifique a conexão ou as permissões da API.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [setTeamMembers, showMessage]);

  const renderItem = ({ item: member }) => (
    <TouchableOpacity
      style={styles.teamMemberItem}
      onPress={() => router.push(`/team/${member.id}`)} // Navega para a tela de detalhes (fora das abas)
    >
      <Text style={styles.memberItemName}>{member.name}</Text>
      <Text style={styles.memberItemRole}>{member.role}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Nossa Equipe</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {teamMembers.length === 0 ? (
            <Text style={styles.emptyMessage}>Nenhum membro da equipe encontrado.</Text>
          ) : (
            <FlatList
              data={teamMembers}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.flatListContent}
            />
          )}
        </View>
      )}
      <Button
        title="Adicionar Novo Membro"
        onPress={() => router.push('/team/new')} // Navega para a tela de adicionar (fora das abas)
        style={styles.addMemberButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  teamMemberItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
  },
  memberItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 5,
  },
  memberItemRole: {
    fontSize: 15,
    color: '#6c757d',
  },
  addMemberButton: {
    backgroundColor: '#28a745',
    marginTop: 20,
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
  emptyMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TeamMembersListScreen;
