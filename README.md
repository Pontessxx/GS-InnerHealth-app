# 🌿 InnerHealth App  
Aplicativo mobile desenvolvido para o **Global Solutions – FIAP 2025** utilizando **React Native + Expo**, **Firebase Authentication**, **API própria hospedada na Azure**, **tema claro/escuro**, **navegação profissional com Expo Router** e **IA generativa com ChatGPT**.

O InnerHealth App auxilia estudantes e profissionais a manterem uma rotina saudável através de acompanhamento de **hidratação, sono, meditação, atividade física, exposição ao sol e tarefas do dia** — tudo conectado a uma API real e com experiência de usuário fluida.

---

# 👨‍💻 Integrantes  
| Nome | RM |
|------|------|
| Henrique Pontes Oliveira | RM98036 |
| Rafael Autieri dos Anjos | RM550885 |
| Rafael Carvalho Mattos | RM99874 |

---

# 🚀 Tecnologias Utilizadas

### **Frontend – App Mobile**
- React Native (Expo)
- Expo Router (Tabs + Stack)
- Context API (Theme)
- Axios (requisições)
- AsyncStorage
- Firebase Authentication (login/registro)
- IA generativa com ChatGPT (OpenAI)

### **Backend – API Real**
- API própria hospedada na **Azure**
- Certificado SSL ativado
- Endpoints REST:
  - `/water`
  - `/sleep`
  - `/activity`
  - `/sunlight`
  - `/tasks`
  - `/profile`
- Docker Hub oficial:  
  👉 https://hub.docker.com/r/pontessx/gsapp  
- GitHub da API:  
  👉 https://github.com/Pontessxx/innerhealthapi  
- Swagger Online:  
  👉 https://rm98036.administradorlinux.com.br:8443/swagger/index.html

---

# 📱 Funcionalidades Implementadas

### ✔ Login + Registro com Firebase  
- Autenticação segura (persistência AsyncStorage)
- Redirecionamento automático através do `onAuthStateChanged`

### ✔ Dashboard completo com dados reais da API  
- Consumo dinâmico via Axios
- Layout limpo e responsivo

### ✔ CRUDs completos  
- Água (POST/GET/PUT/DELETE)  
- Sono  
- Exposição Solar  
- Meditação  
- Atividade Física  
- Tarefas

### ✔ Tela de Perfil  
- Dados do usuário vindos da API  
- E-mail autenticado pelo Firebase  
- Avatar padrão  
- Botão de Logout funcional

### ✔ Tema Claro / Escuro com persistência  
- Context API  
- Ícones dinâmicos  
- Estilo global por paleta

### ✔ Chat com IA (ChatGPT)  
- Modelo: **gpt-4o-mini**  
- Recomendação inteligente de saúde  
- Implementação direta no app (sem backend intermediário)

### ✔ Navegação profissional  
- Expo Router (Stack + Tabs)  
- Rotas protegidas  
- Animações suaves

### ✔ Tratamento de erros + UX  
- Loading global  
- Toasts para sucesso / erro  
- Empty states

---

# 🌐 Endpoints da API

A aplicação consome a API hospedada na Azure:

🔗 **Swagger:**  
https://rm98036.administradorlinux.com.br:8443/swagger/index.html  

Principais rotas:

| Rota | Método | Descrição |
|------|--------|------------|
| /water | GET/POST/PUT/DELETE | Gerencia hidratação |
| /sleep | GET/POST/PUT/DELETE | Rotina de sono |
| /activity | GET/POST/PUT/DELETE | Atividade física |
| /sunlight | GET/POST/PUT/DELETE | Exposição solar |
| /meditation | GET/POST/PUT/DELETE | Bem-estar |
| /tasks | GET/POST/PUT/DELETE | Tarefas |
| /profile | GET | Perfil do usuário |
# 📱 Funcionalidades Implementadas

### ✔ Login + Registro com Firebase  
- Autenticação segura (persistência AsyncStorage)
- Redirecionamento automático através do `onAuthStateChanged`

### ✔ Dashboard completo com dados reais da API  
- Consumo dinâmico via Axios
- Layout limpo e responsivo

### ✔ CRUDs completos  
- Água (POST/GET/PUT/DELETE)  
- Sono  
- Exposição Solar  
- Meditação  
- Atividade Física  
- Tarefas

### ✔ Tela de Perfil  
- Dados do usuário vindos da API  
- E-mail autenticado pelo Firebase  
- Avatar padrão  
- Botão de Logout funcional

### ✔ Tema Claro / Escuro com persistência  
- Context API  
- Ícones dinâmicos  
- Estilo global por paleta

### ✔ Chat com IA (ChatGPT)  
- Modelo: **gpt-4o-mini**  
- Recomendação inteligente de saúde  
- Implementação direta no app (sem backend intermediário)

### ✔ Navegação profissional  
- Expo Router (Stack + Tabs)  
- Rotas protegidas  
- Animações suaves

### ✔ Tratamento de erros + UX  
- Loading global  
- Toasts para sucesso / erro  
- Empty states

---

# 🌐 Endpoints da API

A aplicação consome a API hospedada na Azure:

🔗 **Swagger:**  
https://rm98036.administradorlinux.com.br:8443/swagger/index.html  


# 🔑 Configuração do Firebase (Obrigatória)

Crie o arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=____
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=____
EXPO_PUBLIC_FIREBASE_PROJECT_ID=____
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=____
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=____
EXPO_PUBLIC_FIREBASE_APP_ID=____
EXPO_PUBLIC_OPENAI_KEY=____
```
▶️ Como Rodar o Projeto
```cmd
npm install
npx expo start --android
```
🔒 Segurança Aplicada

- Firebase Authentication

- Variáveis de ambiente (Expo)

- API Azure com HTTPS + certificado digital

- Nenhum dado sensível salvo no cliente

- Persistência segura com AsyncStorage

## Se por acado do destino a API azure não funcionar, basta rodar localmente

