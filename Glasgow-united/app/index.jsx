// app/index.jsx
import { Redirect } from 'expo-router';

export default function App() {
  return <Redirect href="/tabs" />; // Redireciona para o caminho base das suas abas (app/tabs)
}
