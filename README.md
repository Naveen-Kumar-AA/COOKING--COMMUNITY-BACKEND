# Cooking Community Backend Service

This is the backend service for Cooking Community, a recipe sharing application. It is built using Node.js and Express.js, and uses PostgreSQL as the database.

## Installation

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Set up the PostgreSQL database and update the connection details in `.env` file.
4. Run `npm start` to start the server.

## Endpoints

The following endpoints are available:

### Authentication

- `POST /check-user-password`: Check user's password during login
- `POST /do-signup`: Create a new user account

### Profile

- `GET /profile/:profile_id`: Get a user's profile
- `POST /edit-profile`: Edit a user's profile

### Posts

- `POST /new-post': Create a new post
- `GET /posts`: Get all posts
- `DELETE /delete-post/:postId`: Delete a post
- `GET /posts/:meal`: Get all posts filtered by meal type
- `GET /search/:value`: Search for posts based on keyword

### Follow

- `POST /do-follow`: Follow a user
- `POST /do-unfollow`: Unfollow a user
- `POST /toggle-follow`: Toggle follow status
- `POST /is-following`: Check if user is following another user

### Likes

- `POST /like-post`: Like a post
- `POST /dislike-post`: Dislike a post
- `POST /update-like-status`: Update the like status of a post
- `GET /no-of-likes/:postID`: Get the number of likes for a post
- `POST /is-liked`: Check if a post is liked by a user

### Comments

- `GET /comments/:postID`: Get all comments for a post
- `GET /comments/no-of-comments/:postID`: Get the number of comments for a post
- `POST /add-comments`: Add a comment to a post

### Saved Posts

- `POST /save`: Save a post
- `POST /unsave`: Unsave a post
- `GET /get-saved-posts/:userID`: Get all saved posts for a user
- `GET /is-saved/:userID/:postID`: Check if a post is saved by a user

## Dependencies

- cors: ^2.8.5
- dotenv: ^16.0.3
- express: ^4.18.1
- joi: ^13.1.0
- jsonwebtoken: ^9.0.0
- nodemon: ^2.0.16
- pg: ^8.10.0
