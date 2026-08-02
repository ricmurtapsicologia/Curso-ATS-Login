# Curso ATS — Página de Acesso

Página de entrada para o ambiente de apoio às aulas de **Atendimento a Tentativas de Suicídio (ATS)**.

## Página publicada

https://ricmurtapsicologia.github.io/Curso-ATS-Login/

Após validação da matrícula, o participante é direcionado para:

https://ricmurtapsicologia.github.io/Curso-ATS/

## Objetivo

Oferecer uma porta de entrada simples, responsiva e visualmente coerente com o ambiente principal do curso.

A versão atual segue uma política de **refatoração conservadora**: a lógica de validação e a lista de matrículas autorizadas foram preservadas integralmente, enquanto interface, acessibilidade, responsividade e organização do código foram consolidadas.

## Estrutura

- `index.html` — estrutura semântica da página;
- `styles.css` — identidade visual e responsividade;
- `app.js` — validação de acesso e redirecionamento;
- `README.md` — documentação do projeto.

## Diretrizes visuais

A página utiliza a mesma linguagem do ambiente principal do curso:

- fundo escuro em azul-marinho;
- destaque amarelo/dourado;
- tipografia de sistema;
- superfícies com contraste elevado;
- bordas e raios equivalentes;
- hierarquia tipográfica compatível;
- foco em leitura rápida e acesso por celular.

## Acessibilidade

Foram mantidos ou acrescentados:

- rótulo associado ao campo de matrícula;
- `aria-live` para mensagens de retorno;
- `aria-invalid` em erros de validação;
- foco visível por teclado;
- link “Pular para o acesso”;
- tamanho mínimo adequado para controles;
- suporte a `prefers-reduced-motion`;
- contraste elevado.

## Matrículas

A lista de matrículas da versão anterior foi **preservada integralmente, inclusive ordem e duplicidades**.

Qualquer alteração futura nessa lista deve ser realizada de forma deliberada e validada separadamente das mudanças de interface.

## Segurança e escopo

A página oferece uma barreira leve de acesso em um site estático hospedado no GitHub Pages. Alterações visuais não devem ser confundidas com autenticação de servidor.

Se futuramente for necessário controle de acesso forte, o projeto deverá migrar a validação para uma camada de autenticação com servidor ou provedor de identidade.

## Manutenção

Ao alterar a página:

1. preservar a URL de redirecionamento do curso;
2. não remover matrículas durante refatorações visuais;
3. evitar duplicar breakpoints e regras CSS;
4. testar desktop e mobile;
5. testar matrícula válida, inválida e bloqueio temporário;
6. confirmar o redirecionamento para o ambiente principal;
7. manter a linguagem visual alinhada ao repositório `Curso-ATS`.

## Publicação

A publicação é realizada pelo GitHub Pages a partir do branch padrão do repositório.
