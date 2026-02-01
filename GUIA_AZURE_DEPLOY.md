# 🚀 Guia Completo - Deploy no Azure/Microsoft 365

## 📋 Sumário

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Azure AD](#configuração-azure-ad)
3. [Azure SQL Database](#azure-sql-database)
4. [Azure Functions](#azure-functions)
5. [Deploy do Frontend](#deploy-do-frontend)
6. [Configuração de Variáveis](#configuração-de-variáveis)

---

## Pré-requisitos

- [ ] Conta Microsoft 365 Education ativa
- [ ] Acesso ao [Azure Portal](https://portal.azure.com)
- [ ] Permissões para criar recursos no Azure
- [ ] Node.js 18+ instalado
- [ ] Azure Functions Core Tools: `npm install -g azure-functions-core-tools@4`

---

## Configuração Azure AD

### 1. Registrar Aplicação

1. Acesse: [Azure Portal](https://portal.azure.com) → **Azure Active Directory**
2. Clique em **App registrations** → **New registration**
3. Preencha:
   - **Name**: `NatureQuest`
   - **Supported account types**: `Accounts in this organizational directory only (Single tenant)`
   - **Redirect URI**: 
     - Platform: `Single-page application (SPA)`
     - URI: `http://localhost:5173` (desenvolvimento)
     - URI: `https://seu-app.azurewebsites.net` (produção)
4. Clique em **Register**

### 2. Anotar IDs Importantes

Na página da aplicação, anote:
- **Application (client) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Directory (tenant) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 3. Configurar Autenticação

1. Vá em **Authentication** → **Add a platform**
2. Selecione **Single-page application**
3. Adicione URIs de redirecionamento:
   ```
   http://localhost:5173
   https://seu-app.azurewebsites.net
   ```
4. Em **Implicit grant and hybrid flows**, marque:
   - ✅ Access tokens
   - ✅ ID tokens

### 4. Configurar Grupos (Opcional)

Para diferenciar professores e alunos automaticamente:

1. Em **Token configuration** → **Add groups claim**
2. Selecione: `Security groups`
3. Anote os **Object IDs** dos grupos:
   - Grupo de Professores
   - Grupo de Alunos

---

## Azure SQL Database

### 1. Criar Servidor SQL

1. Azure Portal → **Create a resource** → **SQL Database**
2. Clique em **Create** em "SQL databases"
3. Na aba **Basics**:
   - **Subscription**: Sua assinatura
   - **Resource group**: `rg-naturequest` (criar novo)
   - **Database name**: `NatureQuestDB`
   - **Server**: Criar novo
     - **Server name**: `sql-naturequest-unico` (deve ser único global)
     - **Authentication**: `Use both SQL and Azure AD authentication`
     - **Azure AD admin**: Sua conta
   - **Compute + storage**: `Serverless` (custo mais baixo)

### 2. Configurar Firewall

1. No servidor SQL → **Networking**
2. Em **Firewall rules**, adicione:
   - **Allow Azure services and resources to access this server**: ✅ YES
   - **Add your client IPv4 address**: Seu IP (para testes locais)

### 3. Executar Script SQL

1. No banco de dados → **Query editor**
2. Faça login com Azure AD
3. Cole o conteúdo do arquivo `src/database/schema.sql`
4. Clique em **Run**

---

## Azure Functions

### 1. Criar Function App

1. Azure Portal → **Create a resource** → **Function App**
2. **Basics**:
   - **Subscription**: Sua assinatura
   - **Resource group**: `rg-naturequest`
   - **Function App name**: `func-naturequest-api`
   - **Runtime stack**: `Node.js`
   - **Version**: `18 LTS`
   - **Region**: Mesma do SQL Database
   - **Operating system**: `Linux`
   - **Hosting plan**: `Consumption (Serverless)`

3. **Storage**:
   - Criar nova conta de storage: `stnaturequest`

4. Clique em **Review + create** → **Create**

### 2. Configurar Connection String

1. Na Function App → **Configuration** → **Connection strings**
2. Clique em **New connection string**:
   - **Name**: `SQL_CONNECTION_STRING`
   - **Value**: 
     ```
     Server=tcp:sql-naturequest-unico.database.windows.net,1433;Initial Catalog=NatureQuestDB;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication=Active Directory Default;
     ```
   - **Type**: `SQLAzure`
3. Clique em **OK** → **Save**

### 3. Configurar CORS

1. Na Function App → **CORS**
2. Adicione origins:
   ```
   http://localhost:5173
   https://seu-app.azurewebsites.net
   ```
3. **Enable Access-Control-Allow-Credentials**: ✅ Yes

### 4. Deploy das Functions

```bash
# Navegue até a pasta api
cd naturequest/api

# Instale dependências
npm install

# Compile TypeScript
npm run build

# Deploy para Azure (substitua pelo nome da sua Function App)
func azure functionapp publish func-naturequest-api
```

---

## Deploy do Frontend

### Opção 1: Azure Static Web Apps (Recomendado)

1. Azure Portal → **Create a resource** → **Static Web App**
2. **Basics**:
   - **Subscription**: Sua assinatura
   - **Resource group**: `rg-naturequest`
   - **Name**: `stapp-naturequest`
   - **Hosting plan**: `Free`
   - **Region**: Mesma região da Function App

3. **Deployment details**:
   - **Source**: `GitHub` (se usar) ou `Other`
   - Selecione seu repositório

4. **Build details**:
   - **Build presets**: `Vite`
   - **App location**: `/`
   - **Output location**: `dist`

5. Clique em **Review + create** → **Create**

### Opção 2: Azure Blob Storage + CDN

1. Crie uma Storage Account
2. Habilite **Static website**
3. Faça upload dos arquivos da pasta `dist`
4. Configure CDN para HTTPS

---

## Configuração de Variáveis

### Arquivo `.env` (Frontend)

```bash
# Azure AD
VITE_AZURE_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_AZURE_REDIRECT_URI=https://seu-app.azurewebsites.net
VITE_AZURE_POST_LOGOUT_URI=https://seu-app.azurewebsites.net

# Azure Functions API
VITE_API_BASE_URL=https://func-naturequest-api.azurewebsites.net/api

# Feature flags
VITE_USE_AZURE_AUTH=true
VITE_USE_MOCK_DATA=false
VITE_ENABLE_CLOUD_BACKUP=true

# Grupos (opcional)
VITE_AZURE_TEACHER_GROUPS=group-id-1,group-id-2
VITE_AZURE_ADMIN_GROUPS=admin-group-id
```

### Azure Static Web Apps - Environment Variables

1. No portal → **Configuration**
2. Adicione cada variável do `.env`

---

## 🔒 Segurança

### 1. HTTPS Obrigatório

- ✅ Todos os recursos usam HTTPS
- ✅ Cookies `Secure` e `HttpOnly`
- ✅ HSTS habilitado

### 2. Autenticação

- ✅ Apenas emails `@portalsesisp.org.br`
- ✅ Tokens JWT do Azure AD
- ✅ Refresh tokens automáticos

### 3. Autorização

- ✅ Professores só veem suas turmas
- ✅ Alunos só veem seus dados
- ✅ API valida permissões em cada request

---

## 📊 Monitoramento

### Azure Application Insights

1. Crie recurso **Application Insights**
2. Vincule à Function App e Static Web App
3. Configure alertas para:
   - Erros 500
   - Latência alta
   - Falhas de autenticação

---

## 💰 Custos Estimados (Mensal)

| Recurso | Plano | Custo |
|---------|-------|-------|
| Azure SQL | Serverless (até 100 alunos) | **R$ 0,00** |
| Azure Functions | Consumption (até 1M execuções) | **R$ 0,00** |
| Static Web Apps | Free Tier | **R$ 0,00** |
| Storage | Standard (até 5GB) | **R$ 0,00** |
| **TOTAL** | | **R$ 0,00** ✅ |

> Após 100 alunos ativos: ~R$ 50-100/mês

---

## 🆘 Troubleshooting

### Erro: "Invalid client"

- Verifique se o `VITE_AZURE_CLIENT_ID` está correto
- Confirme se a URI de redirecionamento está configurada

### Erro: "CORS policy"

- Adicione a URL do frontend nas configurações CORS da Function App
- Inclua `http://localhost:5173` para desenvolvimento

### Erro: "Login failed"

- Verifique se o domínio do email está na whitelist
- Confirme se o usuário está no diretório correto

### Erro: "Database connection"

- Verifique a connection string
- Confirme se o firewall permite acesso
- Teste a conexão no Azure Data Studio

---

## 📞 Suporte

- **Azure Support**: https://azure.microsoft.com/support
- **MSAL Documentation**: https://docs.microsoft.com/azure/active-directory/develop/msal-overview
- **Azure SQL**: https://docs.microsoft.com/azure/azure-sql

---

## ✅ Checklist Final

- [ ] Azure AD App registrada
- [ ] SQL Database criado e schema executado
- [ ] Function App deployada
- [ ] Static Web App configurada
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado
- [ ] Teste de login com conta Microsoft 365
- [ ] Teste de criação de turma/missão
- [ ] Teste de aluno completando missão
- [ ] Backup configurado

**Pronto para uso! 🎉**
