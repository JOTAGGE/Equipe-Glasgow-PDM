import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, editable, keyboardType, multiline, style, rightAccessory, error, erro }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.inputField, multiline && styles.multilineInputField, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor="#6c757d"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {rightAccessory && (
        <View style={styles.rightAccessoryContainer}>
          {rightAccessory}
        </View>
      )}
      <View>
        {/* Comentário */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#343a40',
    marginBottom: 5,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row', // Organiza o campo de texto e o acessório na mesma linha
    alignItems: 'center', // Alinha verticalmente no centro
    backgroundColor: '#fff',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden', // Importante para que o conteúdo não vaze
  },
  inputField: {
    flex: 1, // Faz o TextInput ocupar todo o espaço disponível
    padding: 10,
    fontSize: 16,
    color: '#495057',
  },
  multilineInputField: {
    minHeight: 100,
    textAlignVertical: 'top', // Para que o texto comece no topo em multiline
  },
  rightAccessoryContainer: {
    // Não precisa de flex: 1 aqui, o acessório terá seu tamanho natural
    paddingRight: 10, // Espaçamento à direita do acessório
  },
  error: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 5,
  },
});

export default Input;