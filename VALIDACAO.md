# Entrega local — VECONI Company

## Escopo

Projeto Git local independente, em pasta irmã do app. Sem repositório remoto criado, push, deploy ou alteração de DNS. Sem modificação de arquivo do aplicativo principal. O status Git do app foi comparado antes/depois e permaneceu idêntico.

HTML/CSS/JavaScript sem dependências de runtime. GitHub Pages preparado com workflow exclusivamente manual, artefato dist e CNAME company.veconi.app.br. A configuração remota de Pages, domínio e Registro.br fica para uma etapa expressamente autorizada.

## Testes executados

- 19 testes Node: todos passaram.
- Lint/check de sintaxe: aprovado.
- Build: aprovado, apenas public copiado para dist.
- git diff --cached --check: aprovado.
- Navegador Chrome: 320, 360, 390, 430, 768 e 1440 px.
- Sem overflow horizontal de página, imagens quebradas ou recorte interno dos cards de planos nas dimensões verificadas.
- Mensal: 29,90 / 59,90 / 119,90.
- Anual equivalente: 23,92 / 47,92 / 95,92; cobrança anual 287,04 / 575,04 / 1.151,04 explicitada.
- Seletor testado com cliques rápidos, retorno ao mensal e teclado (setas/Home).
- Cancelamento de animações concorrentes e reduced-motion cobertos por teste com ambiente controlado; preferências do sistema operacional não foram alteradas.
- FAQ aberto por clique e fechado por Enter.
- Links de contratação inspecionados/testados estaticamente; nenhum checkout ou pagamento aberto.
- Console sem erros/warnings na validação final.
- Branding, favicon e imagem Open Graph PNG 1200×630 presentes; inspeção visual realizada.

Os testes responsivos são em viewport de navegador, não em aparelhos físicos. Não foi executada auditoria Lighthouse ou de leitor de tela. SEO/OG foram validados localmente; preview em WhatsApp/redes sociais depende de publicação futura.

## Screenshots locais

Em artifacts/ (ignorado pelo Git e excluído do artefato de publicação):

- desktop-final-1440.jpg — Hero desktop final.
- mobile-final-390.jpg — Hero mobile final.
- hero-320.jpg, hero-360.jpg, hero-390.jpg, hero-430.jpg, hero-768.jpg, hero-1440.jpg — ensaios responsivos; o 320 foi atualizado após ajuste de headline.
- plans-desktop-annual.jpg — três planos anuais completos, Gestão destacado.
- plans-mobile-390.jpg — seletor e plano anual mobile.
- resources-desktop.jpg — grade de recursos.
- browser-layouts.json — medidas de overflow e cards por largura.

A captura full-page excedeu o limite do navegador em página mobile longa. Foram salvas capturas por seção, não uma montagem apresentada como screenshot único.

## Arquivos criados

```text
.github/workflows/deploy-pages.yml
.gitignore
README.md
VALIDACAO.md
package.json
public/.nojekyll
public/CNAME
public/index.html
public/404.html
public/robots.txt
public/sitemap.xml
public/assets/css/site.css
public/assets/js/plans.js
public/assets/js/site.js
public/assets/brand/veconi-symbol.svg
public/assets/brand/favicon-32.png
public/assets/brand/apple-touch-icon.png
public/assets/images/og-veconi.svg
public/assets/images/og-veconi.png
scripts/build.mjs
scripts/serve.mjs
tests/site.test.mjs
tests/interactions.test.mjs
```

dist/ é saída local gerada; .git/ contém apenas o repositório local. Não há _headers, pois GitHub Pages não o interpreta. Nenhuma configuração Cloudflare é necessária.

## Conteúdo e privacidade

Hero usa mockup HTML/CSS explicitamente ilustrativo, não screenshot de produção. Sem dados de clientes, métricas de adoção, depoimentos ou prova social fabricados. Seção Conheça por dentro substitui espaços vazios de depoimentos até haver material autorizado. Maquininhas e Fiscal/SEFAZ marcados Em breve; sem promessa de data. Essencial sem Financeiro.

## Revisão antes de futura publicação

Criar/configurar repositório separado, conferir o proprietário GitHub e o DNS existente de company; depois configurar Pages/custom domain, CNAME e HTTPS. Não tocar no apex nem www. Validar o domínio e compartilhamento após a publicação autorizada. Conferir os preços publicitários sempre que o catálogo oficial mudar.

Para abrir novamente localmente: executar npm run dev nesta pasta e acessar http://127.0.0.1:4178. O servidor de QA é encerrado após os testes.
