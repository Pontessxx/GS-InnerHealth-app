# 🔐 Firebase Login – React Native + Expo + TypeScript

Um aplicativo moderno de autenticação desenvolvido com **React Native**, **Expo Router**, e **Firebase Authentication**.  
Este projeto demonstra uma estrutura organizada e escalável para login, registro e troca de tema (claro/escuro), ideal para ser usado como base em futuros apps.

---

## 🧠 Sobre o Projeto

Este app tem como objetivo fornecer uma **base sólida de autenticação com Firebase**, utilizando **boas práticas de arquitetura, tipagem com TypeScript**, e **temas personalizados**.

Inclui:
- Autenticação com **Firebase Auth** (email/senha)
- **Expo Router** para navegação moderna e declarativa
- **Gerenciamento de tema** (Light / Dark)
- **Pasta de constantes (Colors.ts)** para manter o padrão visual global
- Estrutura escalável e limpa para reuso em outros projetos

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
|-------------|------------|
| ⚛️ **React Native** | Framework para apps mobile multiplataforma |
| 🧩 **Expo Router** | Navegação baseada em rotas e filesystem |
| 🔥 **Firebase Auth** | Autenticação via Firebase |
| 💙 **TypeScript** | Tipagem estática e segurança de código |
| 💾 **AsyncStorage** | Armazenamento local de sessão e tema |
| 🎨 **Custom Theme Colors** | Sistema de temas claros e escuros globais |

---

## 📁 Estrutura de Pastas

```bash
firebase-login/
│
├── app/                      # Páginas e rotas (Expo Router)
│   ├── (auth)/               # Rotas de autenticação
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (home)/               # Rotas internas após login
│   │   └── index.tsx
│   └── _layout.tsx           # Layout global do app
│
├── constants/
│   └── Colors.ts             # Paleta de cores global
│   └── Theme.ts              # Seleção das cores visto o thema
│
├── utils/
│   └── firebase.ts           # Configuração do Firebase
│
├── context/
│   └── ThemeContext.ts             # LightTheme e DarkTheme
│
└── App.tsx                   # Ponto inicial do app
```

## Configurar o Firebase

Crie um arquivo .env na raiz do projeto e adicione suas credenciais do Firebase:
```bash
    EXPO_PUBLIC_FIREBASE_API_KEY=____________
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=____________
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=____________
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=____________
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=____________
    EXPO_PUBLIC_FIREBASE_APP_ID=____________
```

## Colors
Pode mudar o hex das cores e ajustar visto o seu projeto
```typescript
// Definição de cores padrão para o aplicativo
export const Colors = {
    // 🎯 Identidade principal
    primary: '#FFD60A',    // amarelo ouro refinado (cor de destaque)
    secondary: '#1E1E1E',  // cinza profundo para contraste elegante
    tertiary: '#3A3A3A',   // cinza médio para fundos e seções
}
```
Aqui voce muda o thmea da aplicação
```typescript

export const LightTheme = {
  background: Colors.backgroundLight,
  text: Colors.textLight,
  inputBackground: "#FFFFFF",
  inputBorder: Colors.border,
  placeholder: Colors.placeholder,
  buttonBackground: Colors.success,
  buttonText: Colors.textDark,
  link: Colors.info,
  primary: Colors.primary,
};

export const DarkTheme = {
  background: Colors.backgroundDark,
  text: Colors.textDark,
  inputBackground: Colors.secondary,
  inputBorder: "#3A3A3A",
  placeholder: "#BBBBBB",
  buttonBackground: Colors.success,
  buttonText: Colors.textLight,
  link: Colors.primary,
  primary: Colors.primary,
};

```

