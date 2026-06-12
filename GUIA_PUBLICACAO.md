# GUIA COMPLETO DE PUBLICACAO — COMPRA EFICIENTE

> Documento gerado automaticamente. Siga cada passo na ordem indicada.

---

## VISAO GERAL

O que ja esta pronto:
- Backend API rodando no Railway: `https://compra-eficiente-api-production.up.railway.app`
- Codigo do App React Native no GitHub: `github.com/lilssends/compra-eficiente-app` (branch `develop`)

O que voce precisa fazer agora:
1. Preparar o computador (instalar ferramentas)
2. Configurar o Firebase
3. Baixar e rodar o projeto localmente
4. Gerar o APK assinado
5. Publicar na Google Play Store

---

## PASSO 1 — PREPARAR O COMPUTADOR

### 1.1 Instalar o Node.js

1. Acesse: https://nodejs.org
2. Baixe a versao **LTS** (ex: 20.x)
3. Instale com as opcoes padrao
4. Verifique no terminal:
```
node --version
npm --version
```

### 1.2 Instalar o JDK 17

1. Acesse: https://adoptium.net
2. Baixe o **Temurin JDK 17** para Windows
3. Instale com as opcoes padrao
4. Verifique no terminal:
```
java -version
```

### 1.3 Instalar o Android Studio

1. Acesse: https://developer.android.com/studio
2. Baixe e instale o Android Studio
3. Na primeira abertura, siga o assistente de configuracao
4. Instale o **Android SDK** (versao 34 recomendada)
5. Instale o **Android Emulator**

### 1.4 Configurar variaveis de ambiente

No Windows, adicione ao PATH do sistema:

```
ANDROID_HOME = C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk
```

Adicione tambem ao PATH:
```
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%ANDROID_HOME%\platform-tools
```

Para adicionar no Windows:
- Pesquise "variaveis de ambiente" no menu iniciar
- Clique em "Variaveis de Ambiente"
- Em "Variaveis do Sistema", edite "Path"
- Adicione as linhas acima

Verifique no terminal (feche e reabra):
```
adb --version
```

### 1.5 Instalar o Git

1. Acesse: https://git-scm.com
2. Baixe e instale para Windows
3. Verifique:
```
git --version
```

---

## PASSO 2 — CONFIGURAR O FIREBASE

### 2.1 Criar o projeto no Firebase

1. Acesse: https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Nome: `compra-eficiente`
4. Desative o Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 2.2 Ativar Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Primeiros passos"**
3. Na aba **"Sign-in method"**, ative:
   - **E-mail/senha** → clique, ative o toggle, salve
   - **Google** → clique, ative o toggle, coloque seu email de suporte, salve

### 2.3 Adicionar o app Android

1. Na tela inicial do projeto, clique no icone do **Android** (</> android)
2. **Nome do pacote Android:** `com.compraeficiente`
3. **Apelido do app:** Compra Eficiente
4. Clique em **"Registrar app"**
5. Clique em **"Baixar google-services.json"**
6. **GUARDE ESSE ARQUIVO** — voce vai precisar no Passo 4

### 2.4 Obter o Web Client ID

1. No Firebase Console, va em **"Authentication" > "Sign-in method"**
2. Clique em **Google**
3. Expanda **"Configuracao do SDK da Web"**
4. Copie o **"ID do cliente da Web"** (parece: `XXXX.apps.googleusercontent.com`)
5. Guarde esse valor — voce vai precisar no Passo 4

---

## PASSO 3 — BAIXAR O PROJETO

### 3.1 Clonar o repositorio

Abra o terminal (PowerShell ou CMD) e execute:

```bash
git clone https://github.com/lilssends/compra-eficiente-app.git
cd compra-eficiente-app
git checkout develop
```

### 3.2 Instalar as dependencias

```bash
npm install
```

Aguarde — pode demorar alguns minutos.

---

## PASSO 4 — CONFIGURAR O PROJETO

### 4.1 Inicializar o projeto nativo Android

O React Native precisa de uma pasta `android/` nativa. Execute:

```bash
npx react-native init CompraEficienteTemp --template react-native-template-typescript --skip-install
```

Depois copie a pasta `android/` gerada para dentro do seu projeto:
```bash
xcopy CompraEficienteTemp\android android /E /I
rmdir /S /Q CompraEficienteTemp
```

### 4.2 Configurar o nome do pacote

Edite o arquivo `android/app/build.gradle` e certifique-se que tem:
```gradle
defaultConfig {
    applicationId "com.compraeficiente"
    ...
}
```

### 4.3 Colocar o google-services.json

Copie o arquivo `google-services.json` (baixado no Passo 2.3) para:
```
android/app/google-services.json
```

### 4.4 Configurar o Web Client ID do Google Login

Edite o arquivo `src/screens/LoginScreen.tsx`:

Encontre a linha:
```javascript
webClientId: 'SEU_WEB_CLIENT_ID_AQUI',
```

Substitua pelo ID copiado no Passo 2.4:
```javascript
webClientId: 'SEU_ID_REAL_AQUI.apps.googleusercontent.com',
```

### 4.5 Verificar a URL da API

O arquivo `src/api/api.ts` ja esta apontando para:
```
https://compra-eficiente-api-production.up.railway.app/api/v1
```
**Nenhuma alteracao necessaria aqui.**

---

## PASSO 5 — RODAR O APP LOCALMENTE (TESTE)

### 5.1 Iniciar um emulador Android

1. Abra o **Android Studio**
2. Va em **Tools > Device Manager**
3. Clique em **"Create Device"**
4. Escolha **Pixel 6** (ou similar)
5. Escolha a imagem **API 34 (Android 14)**
6. Clique em "Finish" e depois no botao Play para iniciar

### 5.2 Rodar o app

Com o emulador aberto, execute no terminal (na pasta do projeto):

```bash
npx react-native start
```

Em outro terminal:

```bash
npx react-native run-android
```

O app vai compilar e abrir no emulador. Se tudo estiver certo, voce vera a tela de login do Compra Eficiente.

---

## PASSO 6 — GERAR O APK ASSINADO

### 6.1 Criar a Keystore (chave de assinatura)

**IMPORTANTE:** Guarde essa keystore com seguranca. Sem ela voce nao pode atualizar o app.

No terminal, dentro da pasta do projeto:

```bash
keytool -genkey -v -keystore android/app/compra-eficiente-release.keystore -alias compra-eficiente -keyalg RSA -keysize 2048 -validity 10000
```

Voce sera perguntado:
- **Senha da keystore:** Escolha uma senha forte (ex: `MinhaS3nha@2024`) — ANOTE!
- **Nome e sobrenome:** Seu nome
- **Unidade organizacional:** pode deixar em branco
- **Organizacao:** Seu nome ou empresa
- **Cidade:** Sua cidade
- **Estado:** Seu estado (ex: SP)
- **Pais:** BR
- Confirme com `yes`

### 6.2 Configurar as credenciais de assinatura

Edite o arquivo `android/gradle.properties` e adicione no final:

```
MYAPP_RELEASE_STORE_FILE=compra-eficiente-release.keystore
MYAPP_RELEASE_KEY_ALIAS=compra-eficiente
MYAPP_RELEASE_STORE_PASSWORD=SUA_SENHA_AQUI
MYAPP_RELEASE_KEY_PASSWORD=SUA_SENHA_AQUI
```

### 6.3 Configurar a assinatura no build.gradle

Edite `android/app/build.gradle` e adicione dentro de `android { ... }`:

```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

### 6.4 Gerar o bundle (.aab) para a Play Store

```bash
cd android
.\gradlew bundleRelease
```

O arquivo gerado estara em:
```
android/app/build/outputs/bundle/release/app-release.aab
```

**Esse e o arquivo que voce vai enviar para a Google Play Store.**

---

## PASSO 7 — PUBLICAR NA GOOGLE PLAY STORE

### 7.1 Criar conta de desenvolvedor

1. Acesse: https://play.google.com/console
2. Faca login com sua conta Google
3. Pague a taxa de registro: **USD 25,00** (pagamento unico)
4. Preencha o cadastro de desenvolvedor

### 7.2 Criar o app na Play Console

1. Clique em **"Criar app"**
2. Preencha:
   - **Nome do app:** Compra Eficiente
   - **Idioma padrao:** Portugues (Brasil)
   - **App ou jogo:** App
   - **Gratuito ou pago:** Gratuito (para comecar)
3. Aceite as politicas e clique em **"Criar app"**

### 7.3 Configurar a ficha da loja

Em **"Presenca na Play Store" > "Ficha principal da loja"**, preencha:

- **Nome curto:** Compra Eficiente
- **Descricao resumida (80 caracteres):**
  `Compare precos, calcule sua inflacao e economize nas compras!`
- **Descricao completa (4000 caracteres):**
  Escreva uma descricao detalhada explicando as funcionalidades: comparacao de precos, historico de compras, calculadora de inflacao pessoal, comunidade colaborativa de precos.
- **Screenshots:** Tire prints do emulador com o app rodando (minimo 2 screenshots)
- **Icone:** Crie um icone 512x512 px (pode usar Canva.com)
- **Imagem de destaque:** 1024x500 px (opcional)
- **Categoria:** Compras
- **Email de contato:** Seu email

### 7.4 Configurar classificacao do conteudo

1. Va em **"Politica e programas" > "Classificacao do conteudo"**
2. Responda o questionario
3. O app deve receber classificacao **"Livre"**

### 7.5 Configurar disponibilidade

1. Va em **"Distribuicao" > "Paises e regioes"**
2. Adicione o **Brasil** (e outros paises se quiser)

### 7.6 Enviar o primeiro build — Teste Interno

Antes de publicar para todos, teste com pessoas reais:

1. Va em **"Testes" > "Teste interno"**
2. Clique em **"Criar nova versao"**
3. Clique em **"Escolher artefato"** e envie o `app-release.aab`
4. Adicione notas de versao (ex: `Versao inicial do Compra Eficiente`)
5. Clique em **"Salvar"** e **"Revisar versao"**
6. Clique em **"Iniciar lancamento para teste interno"**
7. Adicione emails dos testadores

### 7.7 Publicar para producao

Depois de testar e confirmar que esta tudo funcionando:

1. Va em **"Producao"**
2. Clique em **"Criar nova versao"**
3. Envie o mesmo `.aab` ou um novo com melhorias
4. Preencha as notas de versao
5. Clique em **"Revisar versao"** e depois **"Iniciar lancamento para producao"**
6. Aguarde a revisao do Google (geralmente 1 a 3 dias)

---

## PASSO 8 — APOS A PUBLICACAO

### Monitorar o app

- **Crashes:** Play Console > Android vitals > Crashlytics
- **Avaliacoes:** Play Console > Crescimento > Avaliacoes e resenhas
- **Downloads:** Play Console > Estatisticas

### Atualizar o app

Para cada atualizacao:
1. Aumente a versao em `android/app/build.gradle`:
   ```gradle
   versionCode 2        // incrementa 1
   versionName "1.1.0"  // atualiza
   ```
2. Gere novo `.aab` com `./gradlew bundleRelease`
3. Envie na Play Console em "Producao > Criar nova versao"

---

## RESUMO RAPIDO

```
[X] Backend API rodando no Railway
[X] Codigo do app no GitHub

[ ] Instalar Node.js, JDK 17, Android Studio
[ ] Criar projeto no Firebase
[ ] Ativar Email/Senha e Google no Firebase Auth
[ ] Baixar google-services.json
[ ] Clonar o repositorio: git clone ...
[ ] npm install
[ ] Copiar google-services.json para android/app/
[ ] Colocar Web Client ID no LoginScreen.tsx
[ ] npx react-native run-android (testar)
[ ] Criar keystore de assinatura
[ ] ./gradlew bundleRelease (gerar .aab)
[ ] Criar conta Play Console (USD 25)
[ ] Criar app na Play Store
[ ] Enviar .aab na faixa de teste interno
[ ] Testar, ajustar e publicar para producao
```

---

## SUPORTE

- Documentacao React Native: https://reactnative.dev/docs/environment-setup
- Firebase Android Setup: https://firebase.google.com/docs/android/setup
- Play Console Help: https://support.google.com/googleplay/android-developer

---

*Gerado em: Junho de 2026 | App: Compra Eficiente | API: Railway | Frontend: React Native 0.73*
