// components/common/Input.jsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, keyboardType = 'default', editable = true, rightAccessory }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputFieldContainer}>
      <TextInput
        style={styles.inputField}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
        placeholderTextColor="#adb5bd"
      />
      {rightAccessory && <View style={styles.rightAccessoryContainer}>{rightAccessory}</View>}
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  inputField: {
    flexGrow: 1,
    height: 44,
    fontSize: 16,
    color: '#495057',
  },
  rightAccessoryContainer: {
    marginLeft: 10,
  },
});

export default Input;