// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <Stack
          screenOptions={{ headerShown: false }} // Oculta o cabeçalho padrão para o grupo de abas/rotas no nível superior
        >
          {/* A rota "index" (app/index.jsx) será o ponto de entrada e fará o redirecionamento */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Rotas que aparecerão por cima das abas (com cabeçalho e botão de voltar automático) */}
          <Stack.Screen
            name="team/new"
            options={{
              title: 'Adicionar Membro',
              headerShown: true, // Garante que o cabeçalho com botão de voltar esteja visível
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              presentation: 'modal', // Continua como modal
            }}
          />
          <Stack.Screen
            name="team/[id]"
            options={{
              title: 'Detalhes do Membro',
              headerShown: true, // Garante que o cabeçalho com botão de voltar esteja visível
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <Stack.Screen
            name="team/assign" // Rota para o modal de associar projetos/tarefas
            options={{
              title: 'Associar',
              headerShown: true, // Garante cabeçalho com botão de voltar
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              presentation: 'modal', // Continua sendo um modal
            }}
          />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
