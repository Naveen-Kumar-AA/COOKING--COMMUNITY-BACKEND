# Cooking Community Backend Service

This is the backend service for Cooking Community, a recipe sharing application. It is built using Node.js and Express.js, and uses PostgreSQL as the database.

## Installation

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Set up the PostgreSQL database and update the connection details in `.env` file.
4. Run `npm start` to start the server.

## Endpoints

The following endpoints are available:

- `POST /signup`: Create a new user account.
- `POST /login`: Log in to an existing account.
- `GET /recipes`: Get a list of all recipes.
- `GET /recipes/:id`: Get details of a specific recipe.
- `POST /recipes`: Create a new recipe.
- `PUT /recipes/:id`: Update an existing recipe.
- `DELETE /recipes/:id`: Delete a recipe.
- `POST /recipes/:id/like`: Like a recipe.
- `DELETE /recipes/:id/like`: Unlike a recipe.

## Dependencies

- cors: ^2.8.5
- dotenv: ^16.0.3
- express: ^4.18.1
- joi: ^13.1.0
- jsonwebtoken: ^9.0.0
- nodemon: ^2.0.16
- pg: ^8.10.0
