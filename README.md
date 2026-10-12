# VECONI Company

Landing institucional independente. Fonte canônica futura: https://company.veconi.app.br/.
App operacional: https://veconi.app.br/ (não modificado).

## Desenvolvimento local

Node.js 22+. Nenhuma instalação de dependência necessária.

```sh
npm test
npm run lint
npm run build
npm run dev
```

Servidor somente loopback: http://127.0.0.1:4178. A pasta public contém o site; build copia somente public para dist e ajusta metadados à URL de publicação.

## Publicação inicial — GitHub Pages

Repositório independente: https://github.com/murillocharles97-netizen/veconi-company.
URL inicial: https://murillocharles97-netizen.github.io/veconi-company/.

Settings > Pages > Source: GitHub Actions. O workflow é manual (`workflow_dispatch`), sem publicação automática no push. Ele executa testes, lint, build e publica somente `dist`. `actions/configure-pages` fornece `SITE_URL`; canonical, Open Graph, sitemap, robots e retorno da página 404 usam essa base. Assets relativos funcionam no subcaminho do repositório. O build local usa a URL inicial por padrão e não inclui `CNAME`, mesmo se houver um artefato antigo em dist.

Os CTAs permanecem no aplicativo oficial. Nenhuma configuração do aplicativo principal é compartilhada com o deploy desta landing.

## Domínio futuro — exige autorização separada

1. Após validar a URL inicial, obter autorização explícita para configurar o domínio.
2. Configurar Settings > Pages > Source: GitHub Actions; domínio personalizado company.veconi.app.br.
3. Revisar o ambiente github-pages e executar manualmente o workflow Publish VECONI Company quando houver autorização para publicar. Não há trigger em push.
4. No Registro.br, adicionar somente CNAME company para murillocharles97-netizen.github.io (se esta for a conta proprietária escolhida). Nunca apontar para uma URL com https ou caminho de repositório.
5. Não alterar os registros do apex veconi.app.br, www, e-mail, Firebase ou pagamentos. Revisar conflitos existentes no registro company antes de qualquer troca.
6. Validar domínio e HTTPS no GitHub Pages, aguardar certificado e ativar Enforce HTTPS. Verificar propriedade do domínio para proteger contra takeover.
7. Validar canonical, OG PNG 1200x630, favicon, links e mobile no endereço publicado. O host company é distinto do origin do PWA do app.

O domínio `company.veconi.app.br` não é configurado pela publicação inicial. Nenhuma alteração de DNS deve ser feita nessa etapa. Os metadados do diretório fonte mantêm o destino futuro, substituído no artefato pela URL efetiva do Pages.

## Arquitetura e segurança

HTML semântico, CSS responsivo, ES modules. Sem framework, Firebase, analytics, cookies, armazenamento local, checkout ou service worker. Os CTAs encaminham exclusivamente para o app ou sua tela oficial de planos. A política CSP via meta bloqueia conexões de rede iniciadas pelo site. GitHub Pages não interpreta _headers; deliberadamente não existe configuração fictícia desse tipo. Cabeçalhos de servidor, como frame-ancestors, exigiriam infraestrutura adicional; não são prometidos aqui.

O conteúdo funciona sem JavaScript; preços mensais estão no HTML. JS somente alterna preço/ano com animação cancelável e respeita reduced-motion. FAQ usa details nativo. Preços em centavos: anual = mensal × 12 × 0,8; equivalente = anual ÷ 12. Matriz publicitária não controla entitlements reais. Toda mudança futura de preço exige revisão deste conteúdo contra o catálogo do app.

## Imagens e conteúdo

Logo/favicons copiados dos assets aprovados da VECONI, sem modificar os originais. Hero é mockup HTML/CSS identificado como prévia ilustrativa, não uma captura de produção e não uma promessa de layout idêntico. Nenhum cliente, receita, depoimento ou métrica de adoção real é exposto. A seção Conheça por dentro reserva espaço editorial para provas futuras; publicar relatos e métricas somente após autorização e verificação.

OG usa fonte SVG própria e PNG derivado, já incluído. Nenhuma dependência de renderização de imagens é necessária para servir ou publicar.

## Testes

Unitários/estáticos em tests/site.test.mjs: preços, anual, CTAs, isolamento, planos, assets, SEO, acessibilidade estrutural e workflow. Validação visual manual no navegador em 320, 360, 390, 430, 768, 1440 px é registrada em artifacts/ junto às screenshots locais. Artifacts não é publicado.

Sem alterações em assinaturas, usuários, Firestore, Storage, código ou deploy do aplicativo principal. Rollback futuro da landing é independente: voltar ao commit anterior deste repositório e executar o workflow manual. Não altera o app.
