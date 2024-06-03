
# Chat em Tempo Real

Este é um sistema de chat em tempo real construído com Node.js, Express.js, Socket.IO e armazenamento local de mensagens utilizando o sistema de arquivos (FS).


## Instalação

Clone este repositório:


Na pasta raiz do projeto utilize

```bash
  git clone https://github.com/Mag3s-Tecnologia/chatNode
```

Navegue até o diretório do projeto:

```bash
  cd chatNode
```

Instale as dependências:


```bash
    npm install
```

## Uso

1. Inicie o servidor

```bash
  node server.js
```
ou
```bash
  npm run start
```

2. Insira um nome de usuário e o código da sala para entrar no chat.

3. Envie mensagens para a sala e veja-as atualizadas em tempo real em todos os clientes conectados.

## Estrutura do Projeto
`public/` Contém arquivos estáticos, como HTML, CSS e JavaScript do cliente.
`functions/`: Contém os arquivos com as funções para manipulação das mensagens.


## Funcionalidades
- Envio de Mensagens em Tempo Real: As mensagens enviadas são atualizadas instantaneamente em todos os clientes conectados à mesma sala.
- Armazenamento Local de Mensagens: As mensagens são armazenadas localmente no sistema de arquivos (FS) para persistência de dados.

## API

- getChatMessages(roomId)
Retorna as últimas 50 mensagens da sala especificada.

    - Parâmetros:
    roomId (string): O código da sala.
    - Retorno:
    Um array de objetos de mensagem.


- storeChatMessage(roomId, message)

Armazena uma nova mensagem na sala especificada.


    - Parâmetros:
    roomId (string): O código da sala.
    message (object): Objeto contendo as informações da mensagem, incluindo username e message.
    - Retorno:
    Um objeto com o status da operação e uma mensagem associada.







## Tecnologias Utilizadas

- Node.js: Plataforma para construção do servidor.
- Express.js: Framework para criação de aplicativos web em Node.js.
- Socket.IO: Biblioteca para comunicação em tempo real.
- Moment.js: Biblioteca para manipulação de datas e horas.
# Contribuições

    Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou uma issue para relatar problemas.


