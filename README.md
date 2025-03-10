<div align="center">
  <img src=" frontend/assets/img/mulakintola-logo.png" alt="Mulakintola" width="220"/>

  <h1>Mulakintola</h1>
  
  <p>Interface amigável para visualização de vídeos e cursos armazenados no Google Drive</p>

  <p>
    <a href="https://nodejs.org/en/"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Version" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Version" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14.0+-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js Version" /></a>
    <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL Version" /></a>
  </p>

  <p>
    <a href="#funcionalidades">Funcionalidades</a> •
    <a href="#tecnologias">Tecnologias</a> •
    <a href="#instalação">Instalação</a> •
    <a href="#desenvolvimento">Desenvolvimento</a> •
    <a href="#sobre-o-projeto">Sobre</a>
  </p>
</div>

## ✨ Funcionalidades

- 🔐 **Autenticação Segura** - Login integrado com Google OAuth
- 📁 **Organização Inteligente** - Listagem de vídeos organizados por pastas
- 🎥 **Player Integrado** - Reprodução de vídeos diretamente na interface
- 📱 **Design Responsivo** - Interface adaptável para todos os dispositivos
- 🌓 **Tema Adaptativo** - Suporte a temas claro e escuro
- 💾 **Cache Local** - Carregamento rápido de conteúdo já visualizado

## 🛠️ Tecnologias

### Backend
- [Node.js](https://nodejs.org/) - Ambiente de execução
- [Fastify](https://www.fastify.io/) - Framework web
- [MySQL](https://www.mysql.com/) - Banco de dados
- [JWT](https://jwt.io/) - Autenticação
- [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação

### Frontend
- [Next.js](https://nextjs.org/) - Framework React
- [React](https://reactjs.org/) - Biblioteca UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação

## 📋 Requisitos

- Node.js 18+
- MySQL 8+
- Conta Google com acesso ao Drive
- Credenciais do Google Cloud Platform

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/mulakintola.git
cd mulakintola
```

2. **Configure o Backend**
```bash
cd backend
npm install
cp .env.example .env
```

3. **Configure o Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
```

4. **Configure as Credenciais**

Edite os arquivos `.env` com suas configurações:

```env
# Backend
DATABASE_URL="mysql://user:password@localhost:3306/mulakintola"
JWT_SECRET="seu_jwt_secret"

# Frontend
GOOGLE_CLIENT_ID="seu_client_id"
GOOGLE_CLIENT_SECRET="seu_client_secret"
NEXTAUTH_SECRET="seu_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 💻 Desenvolvimento

1. **Inicie o Backend**
```bash
cd backend
npm run dev
```

2. **Inicie o Frontend**
```bash
cd frontend
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
mulakintola/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 controllers/
│   │   ├── 📂 database/
│   │   ├── 📂 routes/
│   │   ├── 📂 types/
│   │   └── 📄 server.ts
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
└── 📂 frontend/
    ├── 📂 app/
    │   ├── 📂 components/
    │   ├── 📂 types/
    │   └── 📄 page.tsx
    ├── 📂 public/
    └── 📄 package.json
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 💡 Sobre o Projeto

O Mulakintola nasceu da necessidade de uma interface intuitiva para consumo de conteúdo educacional armazenado no Google Drive. Embora o Drive seja excelente para armazenamento, sua interface não é otimizada para visualização sequencial de vídeos e cursos.

### 🎯 Objetivos

- Facilitar a navegação entre módulos e aulas
- Oferecer experiência similar a plataformas de cursos online
- Manter a organização e segurança do Google Drive
- Proporcionar reprodução de vídeos sem necessidade de download

### 🔧 Configuração do Google Cloud Platform

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Ative a Google Drive API
4. Configure as credenciais OAuth 2.0
5. Adicione as credenciais ao arquivo `.env.local`

### 📚 Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Google Drive API](https://developers.google.com/drive/api)
- [Guia de Contribuição](CONTRIBUTING.md)

---

<div align="center">
  <p>Desenvolvido com 💛 por <a href="https://github.com/seu-usuario">sua equipe</a></p>
  
  <a href="https://github.com/seu-usuario/mulakintola/issues">Reportar Bug</a>
  •
  <a href="https://github.com/seu-usuario/mulakintola/issues">Solicitar Feature</a>
</div>
