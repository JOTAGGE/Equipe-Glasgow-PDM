import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Importar useRouter
import Button from '../../components/common/Button'; // Importar o componente Button

function AboutScreen() {
  const router = useRouter(); // Inicializar router

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Sobre este Aplicativo</Text>
      <Text style={styles.text}>
        Este aplicativo demonstra uma arquitetura básica de um aplicativo React Native com Expo,
        utilizando Expo Router para navegação e Zustand para gerenciamento de estado global.
      </Text>
      <Text style={styles.text}>
        Ele simula operações CRUD em uma entidade "Pessoa da Equipe" e exibe dados
        de "Projetos" e "Tarefas", mostrando um relacionamento entre eles.
      </Text>
      <Text style={styles.text}>
        As chamadas de API são mockadas para demonstração, mas podem ser facilmente
        substituídas por integrações reais com um backend Spring Boot ou Node.js.
      </Text>
      <Text style={styles.footerText}>Desenvolvido para a disciplina de AOS.</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 10,
    lineHeight: 24,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007bff',
    marginTop: 30,
    width: '100%',
  },
});

export default AboutScreen;