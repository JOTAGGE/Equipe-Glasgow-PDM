✨ Aplicativo de Gerenciamento de Equipe 🚀
Bem-vindo ao repositório do nosso aplicativo de gerenciamento de equipe, construído com React Native e Expo! Este projeto visa simplificar a organização e a colaboração, permitindo que você gerencie membros da equipe, projetos e tarefas de forma eficiente.

🎯 Visão Geral do Projeto
Este aplicativo é uma solução móvel completa para:

Organizar sua equipe: Cadastre, visualize e edite todos os membros.

Alocar recursos: Associe membros a projetos e tarefas específicas.

Otimizar a descrição de funções: Utilize a inteligência artificial para gerar descrições profissionais.

🌟 Funcionalidades Brilhantes
👥 Gestão de Membros da Equipe (CRUD Completo):

✅ Criar: Adicione novos talentos à sua equipe com facilidade.

✅ Ler: Visualize a lista completa de membros e seus perfis detalhados.

✅ Atualizar: Mantenha as informações dos membros sempre em dia.

✅ Deletar: Remova membros quando necessário.

📂 Visualização de Projetos:

Explore uma lista de projetos ativos e suas descrições.

📋 Visualização de Tarefas:

Acompanhe as tarefas pendentes e concluídas.

🔗 Atribuição Inteligente:

Conecte membros a projetos e tarefas específicas, visualizando quem está trabalhando em quê.

💡 Geração de Descrições com IA:

Use o poder do Google Gemini API para gerar descrições criativas e concisas para as funções da sua equipe.

🛠️ Tecnologias Usadas (O Motor por Trás)
Frontend (Onde a Magia Acontece ✨)
React Native: A fundação do nosso aplicativo móvel.

Expo: O kit de ferramentas que torna o desenvolvimento e a publicação React Native mais fáceis.

Expo Router: Nosso sistema de navegação limpo e eficiente.

Zustand: Nosso gerenciador de estado global, leve e poderoso.

Axios: Para todas as nossas requisições HTTP à API.

react-native-safe-area-context: Para garantir que seu app se ajuste bem a qualquer dispositivo.

@react-native-picker/picker: Para seleções de itens intuitivas.

Backend (O Cérebro da Operação 🧠)
Node.js com Express: Nosso servidor RESTful que gerencia todos os dados.

Nota: Atualmente, os dados são armazenados em memória. Isso significa que, ao reiniciar o servidor, os dados voltam ao estado inicial. Para persistência real, seria necessário um banco de dados (ex: MongoDB, PostgreSQL).

Integração de Inteligência Artificial (O Toque de Gênio 🤖)
Google Gemini API: Utilizado para a geração de descrições inteligentes para as funções dos membros da equipe.

🏃‍♀️ Como Colocar o App Para Rodar (Passo a Passo)
Pré-requisitos
Node.js (versão 18+ recomendada)

npm ou Yarn

Expo CLI: npm install -g expo-cli ou yarn global add expo-cli

EAS CLI: npm install -g eas-cli (Essencial para publicação)

Conexão com a internet (para dependências e API do Gemini)

1. Clonar o Repositório
git clone [LINK_DO_SEU_REPOSITORIO_AQUI]
cd [NOME_DA_PASTA_DO_SEU_PROJETO]

2. Configurar e Iniciar o Backend
Abra um terminal e navegue até a pasta backend:

cd backend
npm install # Instale as dependências
npm run dev # Inicie o servidor

🚨 ATENÇÃO: Se você estiver usando um ambiente como Codespaces, anote o "Forwarded Address" (Endereço Encaminhado) da porta 3000. Este é o URL público do seu backend e será CRÍTICO para o frontend.

3. Configurar e Iniciar o Frontend
Abra um novo terminal e volte para a raiz do projeto principal (onde está o app.json):

cd .. # Se você ainda estiver na pasta 'backend'
npm install # Instale as dependências

🔑 Configurar a URL do Backend:
Abra o arquivo app.json e adicione/atualize a seção extra com o URL do seu backend. Este passo é VITAL para a conexão!

{
  "expo": {
    // ... outras configurações ...
    "extra": {
      "apiBaseUrl": "SEU_URL_PUBLICO_DO_BACKEND_AQUI" 
      // Exemplo: "https://crispy-pancake-rqr64x56wwjhp5w-3000.app.github.dev/"
    }
  }
}

Inicie o aplicativo Expo:

npm start # Inicie o servidor de desenvolvimento do Expo

Isso abrirá uma nova aba no seu navegador ou um menu no terminal. Você pode escanear o QR code com o aplicativo Expo Go no seu celular ou abrir a versão web.

🌐 Publicação do Aplicativo (EAS Update)
Para publicar suas atualizações do app (depois de fazer commits das suas mudanças), utilize o EAS CLI.

Faça login no EAS:

eas login

Configure o projeto para EAS (se for a primeira vez):

eas build:configure

Siga as instruções para gerar o eas.json.

Publique suas atualizações:

eas update

Isso irá gerar uma nova "bundle" do seu código e assets e enviá-la para os servidores da Expo, tornando-a disponível para usuários do Expo Go.

🧑‍💻 Integrantes da Equipe
Gabriel