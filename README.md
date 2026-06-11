# SellerAI - Frontend Mobile & Web

Este é o cliente mobile e web do **SellerAI**, desenvolvido em **React Native** (utilizando a plataforma **Expo**) e **TypeScript**, projetado para rodar de forma híbrida e responsiva (Mobile-First) em celulares Android/iOS e navegadores Web.

---

## 🛠️ Tecnologias e Frameworks
- **Framework Principal:** React Native + Expo (SDK 56+)
- **Linguagem:** TypeScript
- **Gerenciamento de Formulários:** `react-hook-form`
- **Validação de Formulários:** Zod (`zod` + `@hookform/resolvers`)
- **Estilização:** Vanilla StyleSheet (com sistema de temas centralizado em `/theme`)
- **Comunicação HTTP:** Axios (cliente estruturado com interceptor de tokens JWT)
- **Navegação:** React Navigation (Stack Navigation)
- **Testes Unitários:** Jest + ts-jest

---

## 📁 Principais Funcionalidades da UI
- **Geração de Anúncios com IA:** Formulário rico para preenchimento de detalhes comerciais e envio à IA do Gemini (para geração automatizada de títulos, copys e tags).
- **Grade de Variações de Estoque:** Interface dinâmica com `useFieldArray` que permite gerenciar Cor, Tamanho, SKU e Preço de custo de forma inline por variação de produto.
- **Canais de Venda / Marketplaces:** Seção no modal de detalhes que permite vincular o produto local a anúncios ativos da Shopee ou Mercado Livre.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão LTS recomendada)
- Gerenciador de pacotes npm

### 1. Instalar as dependências do Node
Na pasta raiz do projeto (`SellerAI2`):
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na pasta raiz do frontend contendo o endereço IP local do seu backend para que os emuladores/dispositivos consigam alcançá-lo (a porta padrão configurada no Docker é a `8080`):
```env
EXPO_PUBLIC_API_URL=http://<SEU_IP_AQUI>:8080
```
*(Se estiver rodando no navegador Web, a API local pode apontar para `http://localhost:8080`).*

### 3. Executar o Servidor de Desenvolvimento do Expo
Inicie o bundler do Metro executando:
```bash
npx expo start
```
No menu interativo no terminal:
- Pressione `w` para rodar na versão **Web** (carregará em `http://localhost:8081`).
- Pressione `a` para rodar no emulador **Android** ou escaneie o QR Code com o aplicativo Expo Go no celular físico.

---

## 🧪 Como Executar os Testes Unitários
Para executar as suítes de testes unitários do Jest:
```bash
npm test
```
Para rodar a verificação estática de tipos do TypeScript (Typecheck):
```bash
npx tsc --noEmit
```
