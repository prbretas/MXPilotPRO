---
inclusion: always
---

# Regras do Projeto MenteMX Pro

## Regra 1: Documentação sempre atualizada
Sempre que houver mudanças significativas no projeto (novas features, correções, alterações de dependências, configurações), OBRIGATORIAMENTE:
- Atualizar `docs/GUIA-TESTES-MANUAIS.md` se afetar fluxo de testes
- Atualizar `commandosterminal.md` se novos comandos forem necessários
- Atualizar `docs/color-n-design.md` se afetar design/UI
- Atualizar `README.md` se afetar stack ou estrutura

## Regra 2: Scripts de automação
- Manter `start-mobile.ps1` e `start-backend.ps1` atualizados com versões e instruções corretas
- Incluir key de teste e instruções de ativação nos scripts

## Regra 3: Testes e CI
- Toda lógica de negócio em `packages/core` deve ter testes (property tests com fast-check quando aplicável)
- Rodar testes antes de commitar quando possível
- CI no GitHub Actions valida commits semânticos e testes do core

## Regra 4: Git Workflow
- Nunca commitar direto na `main`
- Sempre criar branch: `feat/`, `fix/`, `docs/`, `chore/`
- Usar Conventional Commits: `feat(escopo): descrição`
- Criar Issue + PR para cada mudança significativa
- Mencionar `Closes #XX` no PR

## Regra 5: Versões e compatibilidade
- Node.js: 22 LTS (recomendado) — Node 24 tem incompatibilidades com Vitest
- Expo SDK: 54
- React Native: 0.81.5
- New Architecture: desabilitada por enquanto (causa falhas no Gradle build)
- Sempre usar `--legacy-peer-deps` no npm install

## Regra 6: Build APK
- Usar EAS Build na nuvem (perfil `preview` para APK de teste)
- Manter `eas.json` atualizado com Node 22 e legacy-peer-deps
- Link do APK aparece no terminal e em expo.dev → Builds
