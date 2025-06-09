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
          screenOptions={{ headerShown: false }} 
        >
          
          <Stack.Screen name="index" options={{ headerShown: false }} />

          
          <Stack.Screen
            name="team/new"
            options={{
              title: 'Adicionar Membro',
              headerShown: true, 
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              presentation: 'modal', 
            }}
          />
          <Stack.Screen
            name="team/[id]"
            options={{
              title: 'Detalhes do Membro',
              headerShown: true, 
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <Stack.Screen
            name="team/assign" 
            options={{
              title: 'Associar',
              headerShown: true, 
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              presentation: 'modal', 
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
