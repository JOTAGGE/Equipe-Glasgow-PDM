// app/tabs/team/index.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { teamMemberApi } from '../../../services/teamMemberApi';
import useTeamStore from '../../../store/teamStore';

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
        const membersData = await teamMemberApi.getAll();
        let membersToSet = [];
        if (Array.isArray(membersData)) {
          membersToSet = membersData;
        } else if (
          membersData &&
          typeof membersData === 'object' &&
          Array.isArray(membersData.members)
        ) {
          membersToSet = membersData.members;
        } else {
          console.warn(
            "FRONTEND DEBUG - [TeamList] Resposta da API teamMemberApi.getAll() não é um array ou é inválida. Conteúdo recebido:",
            membersData
          );
          membersToSet = [];
        }
        setTeamMembers(membersToSet);
      } catch (error) {
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, [setTeamMembers]);

  const renderItem = ({ item: member }) => (
    <TouchableOpacity
      style={styles.teamMemberItem}
      onPress={() => router.push(`/team/${member.id}`)}
    >
      <Text style={styles.memberItemName}>{member.name}</Text>
      <Text style={styles.memberItemRole}>{member.role}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Nossa Equipe</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {Array.isArray(teamMembers) && teamMembers.length === 0 ? (
              <Text style={styles.emptyMessage}>Nenhum membro da equipe encontrado.</Text>
            ) : (
              <FlatList
                data={teamMembers}
                renderItem={renderItem}
                keyExtractor={(item, index) =>
                  item && typeof item === 'object' && item.id !== undefined && item.id !== null
                    ? String(item.id)
                    : `invalid-${index}`
                }
                contentContainerStyle={styles.flatListContent}
              />
            )}
          </View>
        )}
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.addMemberButton}
          onPress={() => router.push('/team/new')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Adicionar Novo Membro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.assignButton}
          onPress={() => router.push('/team/assign')}
        >
          <Text style={{ color: '#343a40', fontWeight: 'bold', textAlign: 'center' }}>Atribuir Projetos/Tarefas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
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
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  addMemberButton: {
    backgroundColor: '#28a745',
    flex: 1,
    marginHorizontal: 5,
    minWidth: 150,
    padding: 12,
    borderRadius: 8,
  },
  assignButton: {
    backgroundColor: '#ffc107',
    flex: 1,
    marginHorizontal: 5,
    minWidth: 150,
    padding: 12,
    borderRadius: 8,
  },
});

export default TeamMembersListScreen;
