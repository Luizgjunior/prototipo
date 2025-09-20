# 🚀 Produtividade MVP

Um app web de produtividade minimalista e elegante, focado em tarefas e técnica Pomodoro.

## ✨ Funcionalidades

- **Autenticação segura** com NextAuth.js e bcrypt
- **Dashboard diário** com 3 prioridades do dia
- **Sistema de tarefas** (todo, doing, done)
- **Timer Pomodoro** (25min foco + 5min pausa) com contador de ciclos
- **Interface responsiva** com dark mode
- **Banco de dados** PostgreSQL com Prisma ORM

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Deploy**: Vercel

## 🚀 Como executar

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd produtividade-mvp
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:

```env
# Database (NeonDB ou PostgreSQL local)
DATABASE_URL="postgresql://username:password@localhost:5432/produtividade?schema=public"

# NextAuth
NEXTAUTH_SECRET="seu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configure o banco de dados
```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar migrações
npm run db:push
```

### 5. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📊 Estrutura do Banco

### Tabelas
- **users**: Dados do usuário (id, name, email, passwordHash)
- **tasks**: Tarefas (id, title, status, isPriority, userId)
- **sessions**: Sessões de foco (id, date, focusMinutes, cyclesCompleted, userId)

### Enums
- **TaskStatus**: TODO, DOING, DONE

## 🎯 Funcionalidades Detalhadas

### Autenticação
- Cadastro com validação de email único
- Login seguro com bcrypt
- Sessões JWT
- Proteção de rotas

### Dashboard
- Estatísticas do dia (ciclos, tempo focado)
- Interface limpa e responsiva
- Dark mode nativo

### Tarefas
- CRUD completo de tarefas
- Sistema de prioridades (máx 3 por dia)
- Status: TODO → DOING → DONE
- Animações suaves com Framer Motion

### Pomodoro
- Timer de 25min foco + 5min pausa
- Contador visual com progresso
- Estatísticas em tempo real
- Persistência no banco

## 🚀 Deploy na Vercel

### 1. Conecte com GitHub
- Faça push do código para GitHub
- Conecte o repositório na Vercel

### 2. Configure variáveis de ambiente
Na Vercel, adicione as variáveis:
- `DATABASE_URL`: String de conexão do NeonDB
- `NEXTAUTH_SECRET`: Chave secreta para JWT
- `NEXTAUTH_URL`: URL da aplicação (ex: https://seu-app.vercel.app)

### 3. Deploy automático
- Push para `main` → Deploy automático
- Build: `npm run build`
- Output: `.next`

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # ESLint
npm run db:push      # Aplicar migrações
npm run db:generate  # Gerar cliente Prisma
npm run db:studio    # Interface visual do banco
```

## 📱 Responsividade

- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Grid System**: CSS Grid + Flexbox
- **Touch Friendly**: Botões e inputs otimizados

## 🎨 Design System

### Cores
- **Primary**: Blue (500, 600, 700)
- **Gray**: Escala completa (50-900)
- **Status**: Red (foco), Green (pausa), Yellow (prioridade)

### Componentes
- **Cards**: Bordas arredondadas, sombras sutis
- **Buttons**: Estados hover, disabled, loading
- **Inputs**: Focus states, validação visual
- **Animations**: Framer Motion para transições

## 🔒 Segurança

- **Senhas**: Hash com bcrypt (12 rounds)
- **JWT**: Tokens seguros com NextAuth
- **CORS**: Configurado para produção
- **Validação**: Inputs sanitizados
- **Rate Limiting**: Proteção contra spam

## 📈 Próximos Passos

- [ ] Notificações push
- [ ] Relatórios semanais
- [ ] Integração com calendário
- [ ] Modo offline
- [ ] Temas personalizáveis
- [ ] Export de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e TailwindCSS**
