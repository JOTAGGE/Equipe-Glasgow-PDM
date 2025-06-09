// app/team/new.jsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useTeamStore from '../../store/teamStore';
import { teamMemberApi } from '../../services/teamMemberApi';

function NewTeamMemberScreen() {
  const router = useRouter();
  const { addTeamMember } = useTeamStore();

  const [member, setMember] = useState({ id: '', name: '', role: '', email: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);

  const showMessage = useCallback((title, text) => {
    Alert.alert(title, text);
  }, []);

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
      
      const apiKey = "AIzaSyA-g3mc6Sx-ViqxV9JXdeEAnXIJkeFUFdY"; // O Canvas irá injetar sua chave de API automaticamente AQUI.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (response.ok && result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setMember((prevMember) => ({ ...prevMember, description: text }));
        showMessage('Sucesso', 'Descrição gerada com sucesso!');
      } else {
        console.error('Erro na resposta da API Gemini:', result);
        const errorDetail = result.error?.message || 'Resposta inesperada ou incompleta da API Gemini.';
        showMessage('Erro Gemini', `Não foi possível gerar a descrição: ${errorDetail}. Verifique as permissões da API no Google Cloud Console.`);
      }
    } catch (error) {
      console.error('Erro ao chamar a API Gemini:', error);
      showMessage('Erro Gemini', `Falha ao gerar descrição: ${error.message || 'Erro de conexão ou servidor.'}`);
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
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
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      showMessage('Erro', `Não foi possível salvar: ${error.message || error.response?.data}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Adicionar Novo Membro</Text>

        <Input
          label="Nome"
          value={member.name}
          onChangeText={(text) => setMember({ ...member, name: text })}
          placeholder="Nome Completo"
          editable={true}
        />
        <Input
          label="Função"
          value={member.role}
          onChangeText={(text) => setMember({ ...member, role: text })}
          placeholder="Desenvolvedor, Designer, etc."
          editable={true}
          rightAccessory={
            <Button
              title={generatingDescription ? 'Gerando...' : '✨ Gerar Descrição'}
              onPress={handleGenerateDescription}
              style={styles.generateDescriptionButton}
              disabled={generatingDescription}
              textStyle={styles.generateDescriptionButtonText}
            />
          }
        />
        <Input
          label="Descrição da Função"
          value={member.description}
          onChangeText={(text) => setMember({ ...member, description: text })}
          placeholder="Detalhes sobre as responsabilidades da função."
          editable={true}
          keyboardType="default"
        />
        <Input
          label="Email"
          value={member.email}
          onChangeText={(text) => setMember({ ...member, email: text })}
          placeholder="email@example.example"
          keyboardType="email-address"
          editable={true}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Salvar"
            onPress={handleSave}
            style={styles.actionButton}
            disabled={saving}
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
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
});

export default NewTeamMemberScreen;