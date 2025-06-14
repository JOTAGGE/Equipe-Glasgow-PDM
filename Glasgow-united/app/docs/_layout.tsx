import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true, // Cabeçalhos das abas visíveis
        tabBarActiveTintColor: '#007bff',
        headerStyle: { backgroundColor: '#007bff' }, // Estilo global para cabeçalhos das abas
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
      initialRouteName="index" // Rota inicial DENTRO DAS ABAS é 'index' (app/tabs/index.jsx)
    >
      <Tabs.Screen
        name="team"
        options={{
          title: 'Equipe',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome size={28} name="group" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="team/index" 
        options={{
          title: 'Equipe',
          tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="group" color={color} />,
        }}
      />
      <Tabs.Screen
        name="about" // Rota: app/tabs/about.jsx
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="info-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
