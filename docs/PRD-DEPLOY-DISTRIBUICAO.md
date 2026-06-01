# 📦 PRD — Deploy e Distribuição do MenteMX Pro

> Como disponibilizar o app para os pilotos e conectar tudo.

---

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    ☁️  SERVIDOR (Backend)                     │
│                                                             │
│   Node.js + Express + PostgreSQL                            │
│   Hospedado em: Railway / Render / AWS / DigitalOcean       │
│   URL: https://api.mentemxpro.com                           │
│                                                             │
│   Responsável por:                                          │
│   - Autenticação (JWT)                                      │
│   - Sincronização de dados                                  │
│   - Geração de License Keys                                 │
│   - Geração de relatórios PDF                               │
│   - Armazenamento central (PostgreSQL)                      │
└──────────────────────┬──────────────────┬───────────────────┘
                       │                  │
                       │ HTTPS            │ HTTPS
                       │                  │
┌──────────────────────▼──────┐  ┌────────▼──────────────────────┐
│  📱 APP MOBILE (Android)     │  │  🖥️  APP DESKTOP (Windows/Mac) │
│                              │  │                                │
│  React Native + Expo         │  │  Electron + React              │
│  Instalado via APK ou        │  │  Instalado via .exe / .dmg     │
│  Google Play                 │  │  Baixado do site               │
│                              │  │                                │
│  Dados salvos localmente     │  │  Conecta ao servidor para      │
│  (SQLite) → sync quando      │  │  puxar dados do mobile         │
│  tiver internet              │  │                                │
└──────────────────────────────┘  └────────────────────────────────┘
```

---

## 1. Como Gerar o APK (Mobile Android)

### Opção A: Expo EAS Build (Recomendado)

O Expo tem um serviço de build na nuvem que gera o APK sem precisar configurar Android Studio.

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login na conta Expo
eas login

# 3. Configurar o build
eas build:configure

# 4. Gerar APK para Android
eas build --platform android --profile preview
```

O APK será gerado na nuvem e você recebe um link para download.

**Perfis de build:**
- `preview` → Gera APK (para testar/distribuir manualmente)
- `production` → Gera AAB (para Google Play)

### Opção B: Build Local (precisa Android Studio)

```bash
cd apps/mobile
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

O APK fica em: `android/app/build/outputs/apk/release/app-release.apk`

### Como distribuir o APK para os pilotos

| Método | Prós | Contras |
|--------|------|---------|
| **WhatsApp/Email** | Rápido, direto | Sem atualização automática |
| **Google Drive** | Link compartilhável | Piloto precisa permitir "fontes desconhecidas" |
| **Google Play (futuro)** | Profissional, auto-update | Precisa conta de dev ($25 uma vez) |
| **Firebase App Distribution** | Gratuito, notifica pilotos | Precisa cadastrar emails |

**Para o MVP:** Envie o APK por WhatsApp/Drive. Quando tiver mais pilotos, publique no Google Play.

---

## 2. Como Publicar no Google Play

### Pré-requisitos
1. Conta Google Play Developer ($25 taxa única)
2. Build AAB (não APK) — `eas build --platform android --profile production`
3. Ícone, screenshots, descrição do app

### Passos
1. Acesse [play.google.com/console](https://play.google.com/console)
2. Crie um novo app
3. Preencha: nome, descrição, categoria (Esportes)
4. Upload do AAB
5. Defina preço: **Gratuito** (ativação por Key dentro do app)
6. Envie para revisão (1-3 dias)

---

## 3. Onde Hospedar o Backend (Servidor)

O backend precisa estar online 24/7 para que mobile e desktop se comuniquem.

### Opções de Hospedagem

| Serviço | Preço | Facilidade | Recomendação |
|---------|-------|------------|--------------|
| **Railway** | $5/mês | ⭐⭐⭐⭐⭐ | MVP — mais fácil |
| **Render** | $7/mês | ⭐⭐⭐⭐ | Bom custo-benefício |
| **DigitalOcean** | $6/mês | ⭐⭐⭐ | Mais controle |
| **AWS (EC2)** | $10+/mês | ⭐⭐ | Escalável, complexo |
| **Vercel** | Grátis (limitado) | ⭐⭐⭐⭐ | Só para APIs simples |

### Deploy no Railway (Recomendado para MVP)

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Criar projeto
railway init

# 4. Adicionar PostgreSQL
railway add --plugin postgresql

# 5. Deploy
railway up
```

O Railway dá uma URL tipo: `https://mentemx-pro-production.up.railway.app`

### Variáveis de ambiente no servidor

```
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/mentemx_pro
JWT_SECRET=chave-secreta-forte-aqui
JWT_EXPIRES_IN=7d
```

---

## 4. Como o Desktop se Conecta

O Desktop **NÃO precisa de servidor próprio**. Ele é um app instalado no PC do piloto/equipe que se conecta ao **mesmo backend** que o mobile.

```
Piloto registra volta no MOBILE (pista, offline)
    ↓
Mobile salva localmente (SQLite)
    ↓
Quando tem internet → sync para o SERVIDOR
    ↓
DESKTOP puxa dados do SERVIDOR (GET /sync/pull)
    ↓
Equipe analisa no PC em tela grande
```

### Distribuição do Desktop

| Plataforma | Formato | Como gerar |
|------------|---------|------------|
| Windows | `.exe` | `electron-builder --win` |
| macOS | `.dmg` | `electron-builder --mac` |

```bash
cd apps/desktop
npm run build
npx electron-builder --win --publish never
```

O `.exe` fica em `dist/` — envie por Drive/email para a equipe.

---

## 5. Fluxo Completo do Piloto

```
1. COMPRA
   Piloto compra via site/PIX → recebe License Key por email

2. INSTALAÇÃO MOBILE
   Baixa APK (ou Google Play) → Abre app → Insere Key → Ativa

3. CADASTRO
   Cria conta (nome, email, senha) → Login

4. USO NA PISTA (OFFLINE)
   Inicia sessão → Registra voltas → Encerra → Dados salvos localmente

5. SINCRONIZAÇÃO
   Quando chega em casa (Wi-Fi) → App sincroniza automaticamente

6. ANÁLISE NO DESKTOP (EQUIPE)
   Abre Desktop no PC → Login com Key + email → Vê dados sincronizados
   Analisa MX Score, Radar, histórico em tela grande

7. RELATÓRIO
   Gera PDF → Compartilha com patrocinador/equipe
```

---

## 6. Custos Estimados (Mensal)

| Item | Custo |
|------|-------|
| Servidor (Railway) | R$ 25-50/mês |
| Banco PostgreSQL | Incluído no Railway |
| Domínio (api.mentemxpro.com) | R$ 40/ano |
| Google Play (uma vez) | R$ 130 (taxa única) |
| SSL/HTTPS | Grátis (Railway inclui) |
| **Total mensal** | **~R$ 50/mês** |

---

## 7. Próximos Passos para Produção

### Imediato (antes de distribuir)
- [ ] Criar conta no Railway e fazer deploy do backend
- [ ] Configurar domínio `api.mentemxpro.com`
- [ ] Gerar APK com `eas build`
- [ ] Testar fluxo completo: instalar APK → ativar → registrar voltas → sync
- [ ] Gerar 10 License Keys para os primeiros pilotos

### Curto prazo (1-2 semanas)
- [ ] Criar conta Google Play Developer
- [ ] Publicar app no Google Play (gratuito + ativação por Key)
- [ ] Gerar .exe do Desktop para Windows
- [ ] Criar landing page para venda das Keys

### Médio prazo (1-2 meses)
- [ ] Implementar pagamento automático (Stripe/PIX)
- [ ] Dashboard admin web para gerenciar Keys
- [ ] Push notifications (lembrete de treino)
- [ ] Backup automático dos dados

---

## 8. Segurança

| Aspecto | Implementação |
|---------|---------------|
| Senhas | bcryptjs (hash, nunca texto puro) |
| Autenticação | JWT com expiração 7 dias |
| License Keys | Vinculadas a 1 mobile + 1 desktop |
| HTTPS | Obrigatório em produção |
| Rate limiting | 5 tentativas/minuto por IP |
| Dados offline | SQLite criptografado (futuro) |

---

## Resumo Visual

```
PILOTO compra Key → Instala APK → Ativa → Treina offline → Sync → Analisa no Desktop
                                                                         ↑
EQUIPE ─────────────────────────────────────────────────────────────────┘
                                                                    (mesmo servidor)
```

**Tudo se comunica pelo mesmo backend.** Mobile e Desktop são clientes que falam com a mesma API. O servidor é o ponto central que guarda os dados e permite a sincronização entre dispositivos.

---

*Documento criado para validação — MenteMX Pro*
