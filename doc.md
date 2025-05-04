# Documentação Técnica - Reprodução de Vídeos no DriveTube

## Visão Geral

Este documento descreve a implementação técnica do sistema de reprodução de vídeos no DriveTube, incluindo as tecnologias utilizadas, o fluxo de processamento e as considerações de segurança.

## Tecnologias Utilizadas

### Player de Vídeo
- **React Player**: Utilizamos a biblioteca [react-player](https://github.com/cookpete/react-player) como base para nosso player de vídeo personalizado
- **HLS.js**: Para streaming adaptativo de vídeos no formato HLS (HTTP Live Streaming)
- **Plyr**: Interface customizada para controles de vídeo com suporte a temas claro/escuro

### Integração com Google Drive
- **Google Drive API v3**: Para acessar metadados e conteúdo dos vídeos armazenados
- **Google OAuth 2.0**: Para autenticação e autorização segura

### Backend
- **Fastify**: Framework para criação de endpoints de API eficientes
- **Prisma**: ORM para gerenciamento de metadados de vídeos no banco de dados

## Processo de Reprodução

O processo de reprodução de vídeos no DriveTube segue estas etapas:

1. **Autenticação do Usuário**:
   - O usuário faz login usando credenciais próprias ou Google OAuth
   - O sistema verifica as permissões do usuário (plano de assinatura, acesso a conteúdos específicos)

2. **Solicitação de Vídeo**:
   - Quando o usuário seleciona um vídeo para assistir, o frontend envia uma solicitação para o backend com o ID do vídeo

3. **Geração de URL de Streaming**:
   ```
   Frontend → Backend → Google Drive API → URL Temporária → Frontend
   ```

4. **Processamento no Backend**:
   - O backend verifica se o usuário tem permissão para acessar o vídeo
   - Consulta o Google Drive API para obter uma URL de streaming temporária
   - Registra a visualização no histórico do usuário
   - Retorna a URL de streaming para o frontend

5. **Reprodução no Frontend**:
   - O player de vídeo recebe a URL temporária
   - Inicia o streaming do vídeo diretamente do Google Drive
   - Aplica configurações de qualidade adaptativa baseadas na conexão do usuário

6. **Monitoramento e Analytics**:
   - O sistema registra eventos de reprodução (início, pausa, conclusão)
   - Armazena o progresso de visualização para permitir retomar de onde parou

## Diagrama de Fluxo

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│             │     │             │     │                 │
│   Frontend  │────▶│   Backend   │────▶│  Google Drive   │
│             │     │             │     │      API        │
└─────────────┘     └─────────────┘     └─────────────────┘
       ▲                  │                     │
       │                  │                     │
       └──────────────────┴─────────────────────┘
                 URL de Streaming
```

## Otimizações Implementadas

1. **Streaming Adaptativo**:
   - Ajuste automático da qualidade do vídeo com base na largura de banda disponível
   - Suporte a múltiplas resoluções para diferentes dispositivos

2. **Buffering Inteligente**:
   - Pré-carregamento de segmentos de vídeo para reduzir interrupções
   - Buffer dinâmico baseado no histórico de conexão do usuário

3. **Cache**:
   - Armazenamento em cache de metadados de vídeos frequentemente acessados
   - Cache de URLs de streaming com invalidação programada

4. **Reprodução Offline**:
   - Suporte para download de vídeos para visualização offline (apenas em planos premium)
   - Sincronização de progresso quando o usuário volta a ficar online

## Considerações de Segurança

1. **Proteção de Conteúdo**:
   - URLs de streaming temporárias com expiração automática
   - Tokens de acesso vinculados à sessão do usuário

2. **Controle de Acesso**:
   - Verificação de permissões em cada solicitação de vídeo
   - Respeito às permissões definidas no Google Drive

3. **Prevenção contra Compartilhamento Não Autorizado**:
   - Detecção de múltiplas reproduções simultâneas
   - Limitação de dispositivos por conta (conforme plano de assinatura)

