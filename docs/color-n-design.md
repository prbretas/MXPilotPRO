

**DESIGN**
Aqui fica a parte de cores e design ta aplicação
deverá se basear nas cores do site do MENTE MX.

este site foi criado por mim: 
www.mentemx.com.br
o repositorio do site é este:
https://github.com/prbretas/mentemx

Voce deverá se basear aproximadamente no layout do site para que fique com o mesmo design.

Aqui sao as cores utilizadas no site.
:root {
    --green: #2ecc40;
    --orange: #ff6b00;
    --yellow: #f5c000;
    --black: #0a0a0a;
    --dark: #111;
    --gray: #1a1a1a;
    --light: #f5f5f5
}


Na pasta ./apps/img contém as imagens das logos da marca MenteMX: 
- A logo capacete é apenas o capacete.
- A logo mente mx oficial é onde consta a logo com nome a marca.
- As imagens de Modelo-prototipo são as imagens geradas
por IA como uma forma de visualização das telas.
Não precisa alterar por enquanto as telas do projeto pois eu ainda não as vi, somente a tela de login.
- A Imagem logo capacete deverá ser incluida na tela de loading do app.
- A Imagem mente mx oficial deverá ser incluida na tela de login ao invés de ter a bandeira de corrida.

Por enquanto é só!
Atualize esse arquivo após as alterações, inclua um check no que tiver sido feito.

novas atualizações podem ser inseridas abaixo posteriormente.

---

## ✅ Alterações realizadas (30/05/2026)

- [x] Paleta de cores atualizada em `apps/mobile/src/constants/theme.ts` com as cores do site MenteMX
  - primary: #2ecc40 (verde)
  - secondary: #ff6b00 (laranja)
  - accent: #f5c000 (amarelo)
  - background: #0a0a0a (preto)
  - surface: #1a1a1a (cinza escuro)
  - text: #f5f5f5 (claro)
- [x] Logo capacete incluída na tela de loading (splash screen) do app
- [x] Logo MenteMX oficial incluída na tela de login (substituiu o emoji 🏁)
- [x] Logo MenteMX oficial incluída na tela de ativação (substituiu o emoji 🏁)
- [x] Botão primário agora é verde (#2ecc40) com texto escuro
- [x] Botão secundário agora usa borda laranja (#ff6b00)
- [x] Background do app.json atualizado para #0a0a0a
- [x] Logos copiadas para `apps/mobile/assets/` (logo-capacete.png, logo-mentemx-oficial.png)
