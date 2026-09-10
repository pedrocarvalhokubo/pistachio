# Pistachio · versão 5

Jogo estático publicado em https://pedrocarvalhokubo.github.io/pistachio/.
Personagem criado pela Bela; as três artes aprovadas são preservadas em `assets/catalogo.js`.

## Experiência

- Casa com móveis arrastáveis, posições persistentes por cenário e armário que abre as roupas.
- Roupas no estilo B, prévia antes da compra e até 12 looks salvos.
- Laboratório de contas: multiplicação, divisão exata e divisão com resto, em 3 níveis; pistas e novas tentativas, sem cronômetro.
- Colheita de 60 segundos com pausa, modo tranquilo, toque e teclado.
- Receita de memória (3 etapas) e trilha de enigmas (3 trechos).
- Exploração de 3 lugares, 15 descobertas, álbum, conquistas e missão diária opcional.
- Sem perda de cuidados por ausência. Cookie ilimitado gratuito.

## Salvamento

`assets/estado.js` mantém o formato versionado, validação, migração e geração matemática. A chave antiga `pistachio_bela_estado_v1` é lida sem ser apagada. A nova chave `pistachio_bela_v4` mantém uma cópia anterior e guarda a cópia ilegível separadamente após recuperação confirmada. Conflitos entre abas não sobrescrevem o progresso mais recente silenciosamente. O checksum detecta corrupção acidental, não é um mecanismo de autenticação.

O salvamento desta publicação é **local ao navegador**, com exportação e importação JSON para recuperação/transferência. O serviço de nuvem não foi criado: a plataforma recusou a criação por limite de hospedagem. Não há sincronização remota, conta, promessa de backup remoto ou credencial embutida.

O service worker guarda o jogo e as imagens para abertura offline após a instalação completa. Mudanças nos scripts devem atualizar os parâmetros de versão e o nome do cache.

## Verificação

Execute `node tests/estado.test.cjs` para migração, recuperação, conflitos, falha de armazenamento e invariantes da matemática. Não há etapa de build nem dependências em produção. Arquivos são servidos diretamente pelo GitHub Pages.

A versão foi também exercitada em DOM simulado: compras, guarda-roupa, posição de móveis, rodadas completas dos quatro jogos, coleções e gravação. Essa verificação não substitui avaliação visual em um celular real.

## Atualização de interação (v5)

Cuidados exigem movimento: carinho por trajetória, comida arrastada até a boca, banho com cinco áreas de esponja e enxágue. O passeio move o personagem até os objetos antes de coletá-los. Atividades deixam sujeira, sem penalidade por ausência. Cachecol/laço usam desenhos completos vestidos; acessórios de cabeça têm encaixes próprios e substituem os anteriores.

Todas as telas usam altura da viewport e páginas explícitas para listas/menus. Gestos usam Pointer Events, captura, cancelamento e alternativa por teclado. A bandeja de lanches tem navegação horizontal. O estado continua no formato v4 para preservar as cópias existentes.

Teste adicional: `node tests/gestos.test.cjs`.

## Pizzaria (v6)

Em **Explorar → Trabalhar na pizzaria**, clientes pedem seis receitas que aparecem aos poucos. O preparo usa gestos na bancada: espalhar molho e muçarela, arrastar ou posicionar recheios, empurrar a pizza para o forno, cruzar o centro com o cortador e entregar no balcão. Há controles equivalentes por teclado. O pedido informa os ingredientes e o número de fatias.

- O caixa da pizzaria usa P$ fictícios e compra porções para novos pedidos. Uma porção de cada ingrediente atende uma pizza inteira, independentemente do número de pinceladas/pedaços.
- Satisfação: receita e distribuição (60%), ponto do forno (25%), número de cortes (15%). Pagamento e gorjeta são liquidados uma única vez. A cada três clientes, o jogo principal recebe duas estrelas.
- O forno fica no ponto entre 7 e 12 segundos de atividade. Pausa ao fechar o trabalho ou ocultar a página; após reabrir, exige continuar. Ao atingir 20 segundos ele desliga. Preparação e atendimento não têm cronômetro.
- Pedido, pizza, cortes, tempo de forno, estoque e caixa integram o backup principal (`pizzaria` no formato v4 compatível). Cópias anteriores recebem uma despensa inicial. Não há backend ou pagamento real.
- Um turno de ajuda fornece porções em caso de falta de ingredientes sem caixa suficiente; não apaga o progresso.

Testes: `node tests/pizzaria.test.cjs`, além das suítes de estado e gestos.

Arte original gerada pela ferramenta de imagens: `assets/pizzaria-cozinha.png` (cozinha artesanal em sálvia, creme e madeira, bancada livre, sem personagens/texto) e `assets/pizzaria-clientes.png` (quatro retratos em grade 2×2, traço de lápis, escalas iguais). Pizza, recheios, forno animado, corte e movimento são renderizados pelo jogo; não dependem de emojis.

## Bancada da pizzaria (v7, 09/09/2026)

A cozinha usa uma bancada contínua de madeira, bandejas de ingredientes, massa com borda irregular e textura, molho, muçarela ralada que derrete ao assar, recheios com volume, forno de tijolos e caixa de entrega. A colher e o ingrediente selecionado acompanham o gesto. O pedido permanece visível durante o preparo. A barra duplicada de título sai durante o trabalho para liberar espaço no celular; Balcão continua disponível.

A revisão mantém receitas, preços e o formato/chave do progresso v4. A captura de ingredientes ignora um segundo dedo enquanto outro gesto está em andamento. Os arquivos recebem versão 7.0 e um cache novo para instalar a revisão sem apagar o salvamento.
