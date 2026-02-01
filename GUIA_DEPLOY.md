# 🚀 Guia de Deploy - NatureQuest

## PARTE 1: Publicar no GitHub

### Opção A: Via Interface Web (Mais Fácil)

1. **Acesse**: https://github.com/new
2. **Preencha**:
   - Repository name: `naturequest`
   - Description: "Plataforma gamificada de ensino de Ciências da Natureza"
   - Visibility: **Public** (ou Private se preferir)
   - ✅ Check "Add a README file"
3. **Clique em**: "Create repository"

4. **Faça upload dos arquivos**:
   - Na página do repositório, clique em **"Add file"** → **"Upload files"**
   - Arraste a pasta `app` inteira (ou use o arquivo ZIP fornecido)
   - Commit message: "Initial commit"
   - Clique em **"Commit changes"**

### Opção B: Via Git (Terminal)

```bash
# Instale o Git se não tiver: https://git-scm.com/download

# No terminal, navegue até a pasta app
cd naturequest/app

# Inicialize o repositório
git init

# Adicione todos os arquivos
git add .

# Commit
git commit -m "Initial commit"

# Conecte ao GitHub (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/naturequest.git

# Envie para o GitHub
git branch -M main
git push -u origin main
```

---

## PARTE 2: Deploy no Vercel

### Método 1: Via Dashboard (Recomendado)

1. **Acesse**: https://vercel.com/dashboard
2. **Clique em**: "Add New..." → "Project"
3. **Importe do GitHub**:
   - Clique em "Import Git Repository"
   - Selecione `naturequest`
   - Clique em "Import"

4. **Configure o Deploy**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Clique em **"Deploy"**

5. **Aguarde** (~2 minutos) e pronto! 🎉

### Método 2: Botão Deploy Instantâneo

Se você já tem no GitHub, use este botão:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## PARTE 3: O que Falta para Uso Real

### 🔴 CRÍTICO (Obrigatório)

#### 1. **Backend + Banco de Dados**

Atualmente os dados são salvos apenas no navegador (localStorage). Para uso real:

**Opção A: Firebase (Gratuito, Mais Fácil)**
```
1. Crie conta em: https://firebase.google.com
2. Crie um novo projeto
3. Ative:
   - Authentication (login dos usuários)
   - Firestore Database (dados)
4. Substitua os hooks useAuth e useGameData
```

**Opção B: Supabase (Gratuito, Open Source)**
```
1. Crie conta em: https://supabase.com
2. Crie um novo projeto
3. Use o banco PostgreSQL incluído
4. Configure Authentication
```

#### 2. **Autenticação Real**

Substituir o mock atual por:
- Emails/senhas reais
- Verificação de email
- Recuperação de senha
- Perfis separados (professor/aluno)

---

### 🟡 IMPORTANTE (Recomendado)

#### 3. **Segurança**
- HTTPS obrigatório (Vercel já faz isso ✅)
- Validação de dados no servidor
- Regras de acesso (professor só vê suas turmas)
- Sanitização de inputs

#### 4. **Funcionalidades Adicionais**
- Upload de arquivos (imagens para missões)
- Sistema de quiz dentro das missões
- Notificações por email
- Relatórios de progresso

---

### 🟢 OPCIONAL (Futuras melhorias)

- App PWA (instalável no celular)
- Chat entre alunos
- Integração com Google Classroom
- Sistema de conquistas/insígnias

---

## 📊 Comparativo de Opções de Backend

| Opção | Preço | Dificuldade | Melhor Para |
|-------|-------|-------------|-------------|
| **Firebase** | Gratuito (até 50k leituras/dia) | ⭐⭐ Fácil | Quer começar rápido |
| **Supabase** | Gratuito (500MB) | ⭐⭐⭐ Médio | Quer código aberto |
| **MongoDB Atlas** | Gratuito (512MB) | ⭐⭐⭐⭐ Difícil | Já conhece Mongo |

---

## 💰 Custos Estimados

### Para começar (até 100 alunos):
- **Vercel**: GRÁTIS ✅
- **Firebase**: GRÁTIS ✅
- **Supabase**: GRÁTIS ✅
- **Total**: **R$ 0,00**

### Se crescer muito (1000+ alunos):
- Firebase: ~R$ 50-100/mês
- Ou migre para servidor próprio

---

## 🆘 Precisa de Ajuda?

Se tiver dificuldades em qualquer passo:

1. **GitHub**: https://docs.github.com/pt/get-started
2. **Vercel**: https://vercel.com/docs
3. **Firebase**: https://firebase.google.com/docs

Ou me pergunte que ajudo! 😊
