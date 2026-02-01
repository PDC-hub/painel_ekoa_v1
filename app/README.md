# 🎮 NatureQuest

Plataforma gamificada de ensino de Ciências da Natureza para ensino fundamental II, com visual steampunk e elementos da cultura indígena brasileira.

![NatureQuest](https://img.shields.io/badge/NatureQuest-v1.0.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-06B6D4?logo=tailwindcss)

## ✨ Funcionalidades

### 👨‍🏫 Para Professores
- ✅ Criar e gerenciar turmas
- ✅ Criar missões com XP e recompensas
- ✅ Adicionar/remover alunos
- ✅ Criar guildas (subgrupos)
- ✅ Aplicar punições quando necessário
- ✅ Resetar senhas dos alunos
- ✅ Exportar/importar dados
- ✅ Backup em nuvem (Google Drive, Dropbox, OneDrive)

### 👨‍🎓 Para Alunos
- ✅ Perfil com nível e XP
- ✅ Inventário de itens com nomes indígenas
- ✅ Sistema de evolução de personagem
- ✅ Missões por disciplina
- ✅ Guildas para trabalho em equipe
- ✅ Ranking da turma

## 🚀 Deploy no Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)
- **shadcn/ui** (componentes)
- **Framer Motion** (animações)
- **Lucide React** (ícones)

## 📦 Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/naturequest.git
cd naturequest

# Instale as dependências
npm install

# Rode em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## ⚙️ Configuração para Uso Real

### 1. Backend/Database
Atualmente a plataforma usa **localStorage** para persistência. Para uso real, você precisa:

- **Opção A (Gratuita)**: Firebase (Firestore + Authentication)
- **Opção B**: Supabase (PostgreSQL + Auth)
- **Opção C**: MongoDB Atlas + qualquer backend

### 2. Autenticação Real
Substituir o mock de login por:
- Firebase Auth
- Auth0
- Supabase Auth
- Ou outro provedor

### 3. Hospedagem
- **Frontend**: Vercel (gratuito)
- **Backend/DB**: Firebase ou Supabase (plano gratuito disponível)

## 📋 Roadmap

- [ ] Integração com backend real
- [ ] Sistema de quizzes dentro das missões
- [ ] Chat entre alunos da mesma guilda
- [ ] Notificações em tempo real
- [ ] App mobile (PWA)
- [ ] Relatórios de progresso para professores

## 📝 Licença

MIT License - Livre para uso educacional.

---

**Desenvolvido com ❤️ para educação**
