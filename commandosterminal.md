# 🏁 Comandos Terminal — MenteMX Pro

> Referência rápida de todos os comandos do projeto para rodar no terminal.

---

## 🔧 Configuração Inicial (rodar uma vez)

```powershell
# Desbloquear execução de scripts no PowerShell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force

# Configurar fnm (gerenciador de versão do Node)
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
fnm use 22

# Instalar dependências do monorepo
cd c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO\src\MenteMX-Pro-App
npm install --legacy-peer-deps
```

---

## 📱 Mobile (Expo Go — desenvolvimento)

```powershell
# Navegar para o app mobile
cd c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO\src\MenteMX-Pro-App\apps\mobile

# Iniciar Expo (mostra QR code para escanear com Expo Go)
npx expo start

# Iniciar com cache limpo (usar quando mudar dependências)
npx expo start --clear

# Usar o script automático (detecta IP e configura API)
cd c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO\src\MenteMX-Pro-App
.\start-mobile.ps1
```

**Key de teste para ativação:** `MXPR-ADMN-2024-TEST`

---

## 📦 Gerar APK (build na nuvem)

```powershell
# Navegar para o app mobile
cd c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO\src\MenteMX-Pro-App\apps\mobile

# Login no Expo (só precisa fazer uma vez)
npx eas-cli login

# Gerar APK de preview (demora ~10-15 min, compila na nuvem)
npx eas-cli build --platform android --profile preview

# Gerar AAB de produção (para Google Play)
npx eas-cli build --platform android --profile production

# Ver builds anteriores
npx eas-cli build:list
```

**Onde fica o APK:** O link aparece no terminal quando termina. Também em: https://expo.dev → Projects → mentemx-pro → Builds

---

## 🖥️ Backend (API)

```powershell
# Navegar para o backend
cd c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO\src\MenteMX-Pro-App\apps\backend

# Iniciar servidor de desenvolvimento
npx tsx src/index.ts

# Ou usar o script automático
cd c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO\src\MenteMX-Pro-App
.\start-backend.ps1
```

---

## 🧪 Testes

```powershell
# Rodar todos os testes do monorepo
cd c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO\src\MenteMX-Pro-App
npm test

# Rodar testes do core (lógica de negócio)
cd c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO\src\MenteMX-Pro-App\packages\core
npx vitest run

# Rodar testes do backend
cd c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO\src\MenteMX-Pro-App\apps\backend
npx vitest run
```

---

## 🔀 Git e GitHub (workflow)

```powershell
# Navegar para a raiz do projeto
cd c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO

# Ver status das alterações
git status

# Criar branch para nova feature
git checkout -b feat/nome-da-feature

# Criar branch para bugfix
git checkout -b fix/nome-do-bug

# Commit com conventional commits
git add .
git commit -m "feat(mobile): descrição da mudança"

# Push da branch
git push -u origin feat/nome-da-feature

# Criar issue via GitHub CLI
gh issue create --title "feat: Título da issue" --body "Descrição" --label "enhancement"

# Criar PR via GitHub CLI
gh pr create --base main --head feat/nome-da-feature --title "feat: Título" --body "Closes #XX"

# Atualizar repo local com o GitHub
git pull origin main
```

---

## 📂 Caminhos Importantes

| O quê | Caminho |
|-------|---------|
| Raiz do projeto | `c:\Users\Philippe\Documents\GITHUB\MenteMX-PRO` |
| Monorepo | `...\src\MenteMX-Pro-App` |
| App Mobile | `...\src\MenteMX-Pro-App\apps\mobile` |
| App Backend | `...\src\MenteMX-Pro-App\apps\backend` |
| App Desktop | `...\src\MenteMX-Pro-App\apps\desktop` |
| Core (lógica) | `...\src\MenteMX-Pro-App\packages\core` |
| Assets/Brand | `...\src\MenteMX-Pro-App\assets\brand` |
| Docs | `...\docs` |

---

## ⚠️ Problemas Comuns

| Erro | Solução |
|------|---------|
| `execução de scripts foi desabilitada` | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force` |
| `npx não reconhecido` | Use `cmd` em vez de PowerShell, ou rode o Set-ExecutionPolicy acima |
| `Cannot find module` | `npm install --legacy-peer-deps` na pasta do monorepo |
| Expo não conecta no celular | Celular e PC na mesma rede Wi-Fi |
| Build EAS falha com "not logged in" | `npx eas-cli login` |
