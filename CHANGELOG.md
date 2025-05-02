# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Suporte para múltiplos usuários com isolamento de dados
- Modelo de dados expandido com planos, assinaturas e pagamentos
- Sistema de lista de espera para novos usuários
- Página de landing para apresentação do produto
- Middleware para verificação de assinatura e controle de acesso
- Integração com PIX para processamento de pagamentos
- Suporte para os primeiros 500 usuários gratuitos

## [1.0.0] - 2023-06-15

### Adicionado
- Autenticação de usuários (registro, login, Google OAuth)
- Gerenciamento de vídeos do Google Drive
- Criação e gerenciamento de playlists
- Sistema de favoritos
- Player de vídeo personalizado
- Interface responsiva
- Suporte para organização de vídeos em pastas
- Busca e filtros de vídeos

### Segurança
- Autenticação JWT
- Integração segura com Google Drive API
- Proteção de rotas no backend e frontend
