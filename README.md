# CyberBot AI

A cybersecurity education chatbot powered by AI, designed to teach users about defensive security practices and threat mitigation.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Requirements](#requirements)
- [Installation Instructions](#installation-instructions)
- [Usage Instructions](#usage-instructions)
- [Documentation](#documentation)
- [Security Features](#security-features)
- [License](#license)

## Project Description

CyberBot AI is an interactive cybersecurity assistant that helps users learn about:
- Types of cyber attacks (phishing, DDoS, ransomware, SQL injection, etc.)
- How to detect and prevent security threats
- Malware removal and incident response
- Security best practices and system hardening
- Ethical hacking for penetration testing
- Privacy protection and data security

The application features a modern React frontend with a Flask backend, supporting multiple AI models including OpenAI GPT, Ollama (local models), and Hugging Face transformers.

## Features

- **Multi-Model AI Support**: Choose from GPT-4, GPT-3.5-turbo, Llama 3.2, Mistral, or SecureBERT
- **Real-time Streaming**: Token-by-token response streaming for better UX
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Chat History**: Encrypted message storage with MongoDB
- **Role-Based Access**: User, Admin, and Super Admin roles
- **Subscription Management**: Optional Stripe integration for paid features
- **End-to-End Encryption**: AES-256-CBC encryption for chat messages
- **Responsive Design**: Modern UI built with React and Styled Components
- **Security Headers**: CSP, XSS protection, and other security best practices

## Technologies Used

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **Framer Motion** - Animation library

### Backend
- **Flask 3.0** - Python web framework
- **PostgreSQL** - User authentication database
- **MongoDB** - Chat history storage
- **OpenAI API** - GPT models integration
- **Ollama** - Local AI model support
- **Hugging Face Transformers** - SecureBERT and GLM-4.6 models
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Cryptography** - AES-256 encryption
- **Stripe** - Payment processing (optional)

### DevOps
- **Gunicorn** - WSGI HTTP server
- **Bash Scripts** - Application lifecycle management
- **Git** - Version control

## Requirements

### System Requirements
- **Python 3.8+** (tested with 3.9+)
- **Node.js 16+** and npm
- **PostgreSQL 12+**
- **MongoDB 4.4+**
- **Ollama** (optional, for local models)

### Python Dependencies
See [requirements.txt](requirements.txt):
```
Flask==3.0.0
flask-cors==4.0.0
PyJWT==2.8.0
bcrypt==4.1.2
cryptography==41.0.7
python-dotenv==1.0.0
pymongo==4.6.1
psycopg2-binary==2.9.9
openai==1.6.1
stripe==7.9.0
gunicorn==21.2.0

# Optional: For local AI models
# transformers==4.47.1
# torch==2.1.2
# accelerate==1.2.1
```

### Node.js Dependencies
See [package.json](package.json) for the complete list.

## Installation Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Cyber Bot AI"
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the root directory:
```bash
# Database Configuration
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=cyberbotdb
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# MongoDB
MONGO_URI=mongodb://localhost:27017/cyberbot

# JWT & Encryption
JWT_SECRET=your_jwt_secret_key_here
ENCRYPTION_KEY=your_32_character_encryption_key

# OpenAI (Optional - for GPT models)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Ollama (Optional - for local models)
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b
OLLAMA_TIMEOUT=60

# Stripe (Optional - for subscriptions)
STRIPE_SECRET_KEY=sk_test_your_stripe_key

# Server
PORT=5001
```

#### Setup PostgreSQL Database
```bash
# Create database
createdb cyberbotdb

# Connect to database
psql -d cyberbotdb

# Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_subscribed BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Setup MongoDB
```bash
# Start MongoDB service
brew services start mongodb-community  # macOS
# or
sudo systemctl start mongod  # Linux
```

#### Install Ollama (Optional)
```bash
# macOS
brew install ollama
brew services start ollama

# Pull a model
ollama pull llama3.2:1b
```

### 3. Frontend Setup

#### Install Node.js Dependencies
```bash
npm install
```

#### Configure Frontend Environment
Update API endpoints in `src/config.ts` if needed:
```typescript
export const API_BASE_URL = 'http://localhost:5001/api';
```

## Usage Instructions

### Starting the Application

#### Option 1: Using the Start Script (Recommended)
```bash
chmod +x start-app.sh
./start-app.sh
```

This will start:
- Backend server on `http://localhost:5001`
- Frontend dev server on `http://localhost:3000`

#### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
source venv/bin/activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev -- --port 3000
```

### Stopping the Application
```bash
chmod +x stop-app.sh
./stop-app.sh
```

### Using the Application

1. **Register an Account**
   - Navigate to `http://localhost:3000`
   - Click "Register" and create an account
   - Login with your credentials

2. **Start Chatting**
   - Select an AI model from the dropdown (GPT-4, Llama, Mistral, etc.)
   - Type your cybersecurity question
   - Receive real-time streaming responses

3. **Manage Chats**
   - View chat history in the sidebar
   - Rename chats for better organization
   - Delete old conversations

4. **Admin Features** (if configured)
   - Access admin dashboard
   - Manage users and subscriptions
   - View system analytics

## Documentation

Additional documentation is available in the project:

- **[QUICK_START.md](QUICK_START.md)** - Quick setup guide
- **[OLLAMA_CONFIG.md](OLLAMA_CONFIG.md)** - Ollama configuration guide
- **[DATABASE_FIX.md](DATABASE_FIX.md)** - Database troubleshooting
- **[STREAMING_FIX.md](STREAMING_FIX.md)** - Streaming implementation details
- **[CHAT_NAMING_FIX.md](CHAT_NAMING_FIX.md)** - Chat naming feature documentation
- **[BOT_RESPONSE_FIX.md](BOT_RESPONSE_FIX.md)** - Bot response formatting guide
- **[ADMIN_SETUP.md](ADMIN_SETUP.md)** - Admin role configuration
- **[SUPER_ADMIN_SETUP.md](SUPER_ADMIN_SETUP.md)** - Super admin configuration

### API Endpoints

#### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/subscription-status` - Check subscription status

#### Chat
- `POST /api/chat` - Send message (streaming)
- `GET /api/chat-history/:userId` - Get chat history
- `POST /api/save-chat-history` - Save chat
- `POST /api/update-chat-name` - Rename chat
- `DELETE /api/delete-chat/:userId/:chatId` - Delete chat

#### Subscriptions
- `POST /api/create-checkout-session` - Create Stripe session

## Security Features

### Implemented Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum password requirements enforced
   - Secure password storage

2. **Data Encryption**
   - AES-256-CBC encryption for chat messages
   - Encrypted data at rest in MongoDB
   - Secure key management via environment variables

3. **Authentication**
   - JWT tokens with expiration
   - HTTP-only cookies (when applicable)
   - Protected routes with middleware

4. **HTTP Security Headers**
   - Content Security Policy (CSP)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection enabled

5. **CORS Configuration**
   - Restricted origins
   - Credentials support
   - Method and header restrictions

6. **Input Validation**
   - Server-side validation for all inputs
   - SQL injection prevention via parameterized queries
   - XSS protection

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in the `/docs` folder
- Review troubleshooting guides in the `.md` files

## Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude assistance
- Ollama for local model support
- Hugging Face for transformer models
- The open-source community

---

**Note**: This is a cybersecurity education tool designed for defensive purposes only. Users should follow ethical guidelines and use the knowledge gained responsibly.
