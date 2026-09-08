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
