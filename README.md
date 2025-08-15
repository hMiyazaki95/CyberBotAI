# AntyBoty

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://img.shields.io/github/actions/workflow/status/hMiyazaki95/AntyBoty/main.yml?branch=main)]()

AntyBoty is an AI-powered cybersecurity chatbot designed to help users learn and practice safe online behaviors. Unlike generic bots, it focuses on answering security-related questions with trusted knowledge and structured explanations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [File Structure Overview](#file-structure-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

<!-- TODO: Add screenshots if applicable -->

## ✨ Features
- 💬 Real-time chatbot with AI-powered responses  
- 🔐 Secure chat history (MongoDB + PostgreSQL with encryption)  
- 🕵️ Searchable chat history for quick information retrieval  
- 🤖 LLM model selection option (choose between different AI models at runtime)  
- ⚡ Fast backend built on Node.js + TypeScript  
- 📊 Subscription model with free-tier limits (Stripe integration ready)  
- 🌐 REST API for third-party integrations  
- 📱 Responsive web UI built with React + Tailwind CSS

## Tech Stack

- TypeScript
- JavaScript
- CSS
- HTML
- Node.js (likely, for server-side execution)
- MongoDB (database requirement)
- Postgres (database requirement)

## File Structure Overview

```text
.
├── .vscode/
├── LICENSE
├── README.md
└── antyboty/
```

## Prerequisites

- Node.js (check `package.json` in `antyboty/` for specific version if available)
- npm or yarn
- MongoDB (database requirement)
- Postgres (database requirement)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hMiyazaki95/AntyBoty.git
   ```
2. Navigate to the `antyboty` directory:
   ```bash
   cd AntyBoty/antyboty
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   The `node_modules` will be installed in `~/Desktop/AI/AntyBoty/antyboty`.

## Usage

1.  To run the server with Node.js:
    ```bash
    nodemon server.js
    ```
2. To run the application:
    ```bash
    npm run dev -- --port 3000
    ```

## Configuration

Configure the project by editing the `.env` file in the `antyboty` directory and setting the required environment variables. For example:

```
API_KEY=your_api_key
DATABASE_URL=your_database_url
```

## API Reference

Here's the API I designed:

#### GET /api/data

```http
GET /api/data
```

| Parameter   | Type     | Description                                 |
| :---------- | :------- | :------------------------------------------ |
| `user_token`| `string` | Your API key (I require this for authentication) |

#### POST /api/create

```http
POST /api/create
```

| Body Field | Type   | My Requirements |
| :--------- | :----- | :---------------- |
| title      | string | Required. Item name |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

Distributed under the Apache License 2.0 License. See `LICENSE` file for more information.

## Author

Hajime Miyazaki

## Acknowledgements

<!-- Add any acknowledgements here -->
I'd like to thank all the contributors and supporters of this project.

## Contact

Hajime Miyazaki - [https://github.com/hMiyazaki95/AntyBoty](https://github.com/hMiyazaki95/AntyBoty) - <!-- TODO: add contact email -->
