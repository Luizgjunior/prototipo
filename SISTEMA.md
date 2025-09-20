# 📋 Documentação Completa do Sistema - Produtividade MVP

## 🎯 Visão Geral

O **Produtividade MVP** é uma aplicação web moderna e minimalista focada em produtividade pessoal, implementando a técnica Pomodoro e gerenciamento de tarefas com priorização diária.

### Objetivos do Sistema
- Aumentar a produtividade através da técnica Pomodoro
- Gerenciar tarefas com foco em 3 prioridades diárias
- Fornecer métricas de produtividade em tempo real
- Interface limpa e responsiva para máxima usabilidade

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológica
```
Frontend: Next.js 14 + React 18 + TypeScript
Styling: TailwindCSS + Framer Motion
Backend: Next.js API Routes
Database: PostgreSQL (NeonDB)
ORM: Prisma
Authentication: NextAuth.js
Deploy: Vercel
```

### Padrões Arquiteturais
- **App Router**: Next.js 14 com roteamento baseado em arquivos
- **Server Components**: Renderização no servidor para performance
- **Client Components**: Interatividade no cliente
- **API Routes**: Endpoints RESTful para comunicação
- **Middleware**: Proteção de rotas e autenticação

---

## 📊 Estrutura do Banco de Dados

### Schema Prisma

```prisma
model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  passwordHash String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  tasks    Task[]
  sessions Session[]

  @@map("users")
}

model Task {
  id        String   @id @default(cuid())
  title     String
  status    TaskStatus @default(TODO)
  isPriority Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("tasks")
}

model Session {
  id              String   @id @default(cuid())
  date            DateTime @default(now())
  focusMinutes    Int      @default(0)
  cyclesCompleted Int      @default(0)
  createdAt       DateTime @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

enum TaskStatus {
  TODO
  DOING
  DONE
}
```

### Relacionamentos
- **User → Tasks**: 1:N (Um usuário pode ter várias tarefas)
- **User → Sessions**: 1:N (Um usuário pode ter várias sessões)
- **Cascade Delete**: Ao deletar usuário, deleta tarefas e sessões

---

## 🔐 Sistema de Autenticação

### Configuração NextAuth.js
```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validação de credenciais
        // Hash bcrypt para verificação de senha
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string
      return session
    }
  }
}
```

### Segurança
- **Senhas**: Hash bcrypt com 12 rounds
- **JWT**: Tokens seguros para sessões
- **Middleware**: Proteção automática de rotas
- **Validação**: Sanitização de inputs

---

## 🎨 Interface do Usuário

### Design System

#### Cores
```css
Primary: #3b82f6 (Blue-500)
Primary Hover: #2563eb (Blue-600)
Primary Dark: #1d4ed8 (Blue-700)

Gray Scale:
- 50: #f9fafb (Background)
- 100: #f3f4f6 (Cards)
- 200: #e5e7eb (Borders)
- 300: #d1d5db (Dividers)
- 400: #9ca3af (Placeholders)
- 500: #6b7280 (Secondary text)
- 600: #4b5563 (Primary text)
- 700: #374151 (Headings)
- 800: #1f2937 (Dark mode)
- 900: #111827 (Darkest)

Status Colors:
- Red: #ef4444 (Focus mode)
- Green: #10b981 (Break mode)
- Yellow: #f59e0b (Priority tasks)
```

#### Componentes
```css
.btn-primary: Botão principal com hover states
.btn-secondary: Botão secundário
.input-field: Inputs com focus states
.card: Cards com bordas arredondadas e sombras
```

### Responsividade
- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Grid System**: CSS Grid + Flexbox
- **Touch Friendly**: Botões e inputs otimizados

---

## ⚙️ Funcionalidades Detalhadas

### 1. Autenticação

#### Cadastro
- **Endpoint**: `POST /api/auth/signup`
- **Validações**:
  - Nome obrigatório
  - Email único e válido
  - Senha mínima 6 caracteres
  - Confirmação de senha
- **Processo**:
  1. Validação de dados
  2. Verificação de email único
  3. Hash da senha com bcrypt
  4. Criação do usuário no banco
  5. Redirecionamento para login

#### Login
- **Endpoint**: `POST /api/auth/[...nextauth]`
- **Processo**:
  1. Validação de credenciais
  2. Verificação de hash da senha
  3. Geração de JWT
  4. Criação de sessão
  5. Redirecionamento para dashboard

### 2. Dashboard

#### Layout
```
Header
├── Logo + Nome do App
└── User Info + Logout

Stats Cards
├── Ciclos Pomodoro
├── Tempo Focado
└── Data Atual

Main Grid
├── Pomodoro Timer (Direita)
└── Task List (Esquerda)
```

#### Estatísticas
- **Ciclos Completos**: Contador de ciclos Pomodoro
- **Tempo Focado**: Tempo total em minutos
- **Data Atual**: Data formatada em português

### 3. Sistema de Tarefas

#### CRUD Completo
- **Criar**: `POST /api/tasks`
- **Listar**: `GET /api/tasks`
- **Atualizar**: `PATCH /api/tasks/[id]`
- **Deletar**: `DELETE /api/tasks/[id]`

#### Estados das Tarefas
```typescript
enum TaskStatus {
  TODO    // Tarefa pendente
  DOING   // Tarefa em andamento
  DONE    // Tarefa concluída
}
```

#### Sistema de Prioridades
- **Limite**: Máximo 3 prioridades por dia
- **Validação**: Verificação no backend
- **Visual**: Destaque com cor amarela
- **Persistência**: Campo `isPriority` no banco

#### Animações
- **Framer Motion**: Transições suaves
- **Estados**: Hover, focus, loading
- **Microinterações**: Feedback visual

### 4. Timer Pomodoro

#### Configuração
- **Foco**: 25 minutos (1500 segundos)
- **Pausa**: 5 minutos (300 segundos)
- **Ciclos**: Contador automático
- **Persistência**: Salva no banco a cada ciclo

#### Funcionalidades
```typescript
interface PomodoroTimerProps {
  onCycleComplete: (focusMinutes: number, cycles: number) => void
}

// Estados
const [timeLeft, setTimeLeft] = useState(25 * 60)
const [isRunning, setIsRunning] = useState(false)
const [mode, setMode] = useState<'focus' | 'break'>('focus')
const [cycles, setCycles] = useState(0)
```

#### Controles
- **Iniciar**: Inicia o timer
- **Pausar**: Pausa o timer
- **Resetar**: Volta ao estado inicial
- **Auto-switch**: Alterna entre foco e pausa

#### Visual
- **Círculo de Progresso**: SVG animado
- **Cores**: Vermelho (foco), Verde (pausa)
- **Tempo**: Formato MM:SS
- **Estatísticas**: Tempo total e ciclos

---

## 🔌 API Endpoints

### Autenticação
```
POST /api/auth/signup
POST /api/auth/[...nextauth]
```

### Tarefas
```
GET    /api/tasks           # Listar tarefas
POST   /api/tasks           # Criar tarefa
PATCH  /api/tasks/[id]      # Atualizar tarefa
DELETE /api/tasks/[id]      # Deletar tarefa
```

### Sessões
```
GET  /api/sessions          # Buscar sessão do dia
POST /api/sessions          # Salvar progresso
```

### Health Check
```
GET /api/health             # Status da aplicação
```

---

## 🚀 Deploy e Configuração

### Variáveis de Ambiente
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Produção
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### Scripts Disponíveis
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:push": "prisma db push",
  "db:generate": "prisma generate",
  "db:studio": "prisma studio"
}
```

### Deploy na Vercel
1. **Conectar GitHub**: Repositório conectado
2. **Variáveis**: Configurar no painel da Vercel
3. **Build**: Automático via GitHub
4. **Domínio**: Personalizado disponível

---

## 📱 Responsividade

### Breakpoints
```css
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
```

### Layout Adaptativo
- **Mobile**: Stack vertical, cards full-width
- **Tablet**: Grid 2 colunas
- **Desktop**: Grid 2 colunas com sidebar

### Touch Optimization
- **Botões**: Mínimo 44px de altura
- **Inputs**: Tamanho adequado para touch
- **Gestos**: Swipe e tap otimizados

---

## 🔒 Segurança

### Autenticação
- **JWT**: Tokens seguros
- **Bcrypt**: Hash de senhas
- **Middleware**: Proteção de rotas
- **CORS**: Configurado para produção

### Validação
- **Inputs**: Sanitização automática
- **Rate Limiting**: Proteção contra spam
- **SQL Injection**: Prevenido pelo Prisma
- **XSS**: Sanitização de dados

### Dados
- **Cascade Delete**: Limpeza automática
- **Soft Delete**: Preservação de dados
- **Backup**: Recomendado para produção

---

## 📊 Métricas e Monitoramento

### Dados Coletados
- **Ciclos Pomodoro**: Por dia/usuário
- **Tempo Focado**: Em minutos
- **Tarefas Concluídas**: Por status
- **Prioridades**: Uso diário

### Dashboard Analytics
- **Tempo Real**: Atualizações instantâneas
- **Histórico**: Dados persistentes
- **Visualização**: Gráficos e cards

---

## 🧪 Testes

### Estratégia de Testes
- **Unit Tests**: Funções isoladas
- **Integration Tests**: APIs e banco
- **E2E Tests**: Fluxos completos
- **Performance Tests**: Carga e stress

### Cobertura Recomendada
- **APIs**: 90%+
- **Components**: 80%+
- **Utils**: 95%+
- **Overall**: 85%+

---

## 🔧 Manutenção

### Logs
- **Console**: Desenvolvimento
- **Vercel**: Produção
- **Database**: Queries e erros
- **Auth**: Tentativas de login

### Monitoramento
- **Uptime**: Status da aplicação
- **Performance**: Tempo de resposta
- **Errors**: Tratamento de exceções
- **Usage**: Métricas de uso

### Backup
- **Database**: Backup diário
- **Code**: Versionamento Git
- **Config**: Variáveis de ambiente
- **Assets**: Imagens e arquivos

---

## 🚀 Próximas Funcionalidades

### Roadmap V2
- [ ] **Notificações Push**: Lembretes e alertas
- [ ] **Relatórios**: Gráficos e estatísticas
- [ ] **Integração Calendar**: Sincronização
- [ ] **Modo Offline**: PWA capabilities
- [ ] **Temas**: Personalização visual
- [ ] **Export**: Dados em PDF/CSV

### Melhorias Técnicas
- [ ] **Cache**: Redis para performance
- [ ] **CDN**: Assets otimizados
- [ ] **Monitoring**: APM completo
- [ ] **Testing**: Cobertura 100%
- [ ] **CI/CD**: Pipeline automatizado

---

## 📞 Suporte

### Documentação
- **README**: Setup e instalação
- **API Docs**: Endpoints detalhados
- **Deploy Guide**: Vercel e outros
- **Troubleshooting**: Problemas comuns

### Contato
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: suporte@exemplo.com
- **Docs**: Documentação completa

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e TailwindCSS**

*Última atualização: Dezembro 2024*
