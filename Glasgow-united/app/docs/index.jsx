import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../components/common/Button'; // Importar o componente Button

function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Bem-vindo ao Aplicativo da Equipe!</Text>
      <Text style={styles.subtitle}>Gerencie e conheça nossa equipe, projetos e tarefas.</Text>
      

    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: '#007bff',
    marginTop: 15,
    width: '100%',
  },
});

export default HomeScreen;
