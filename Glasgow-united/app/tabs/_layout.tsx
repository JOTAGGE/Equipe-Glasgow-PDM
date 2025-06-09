// app/tabs/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

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
        name="index" // Rota: app/tabs/index.jsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="team" // <--- CORRIGIDO: Agora o nome da rota da aba é "team" (refere-se à pasta app/tabs/team/index.jsx)
        options={{
          title: 'Equipe',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="group" color={color} />,
        }}
      />
      <Tabs.Screen
        name="about" // Rota: app/tabs/about.jsx
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="info-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
