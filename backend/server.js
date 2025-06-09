import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend rodando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
