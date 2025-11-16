# InnerHealth app
- API: [link api](https://github.com/Pontessxx/innerhealthapi)
- Docker api: [link DockerHub](https://hub.docker.com/r/pontessx/gsapp)
- Swagger API: [link api](https://rm98036.administradorlinux.com.br:8443/swagger/index.html)
Um aplicativo moderno de autenticação desenvolvido com **React Native**, **Expo Router**, e **Firebase Authentication**.  
Este projeto demonstra uma estrutura organizada e escalável para login, registro e troca de tema (claro/escuro), 

## Integrantes
| Nome | RM |
|------|-----|
| Henrique Pontes Oliveira | RM98036 |
| Rafael Autieri dos Anjos | RM550885 |
| Rafael Carvalho Mattos | RM99874 |

# Passo a passo para rodar
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

Iniciar o projeto:
```cmd
  npx expo start --android
```