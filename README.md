<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Simple Real-Time Chat Application

A simple real-time chat application built with NestJS, Socket.IO, and MySQL.

## Features

- User authentication (register, login)
- Create and join chat rooms
- Real-time messaging
- Invite users to chat rooms
- View room members
- Message history

## Technologies Used

- NestJS - Backend framework
- Socket.IO - Real-time communication
- TypeORM - ORM for database interactions
- MySQL - Database
- Bootstrap - Frontend UI
- JWT - Authentication

## Prerequisites

- Node.js (v16+)
- MySQL Server
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd appchat
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the `.env.example` file to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and JWT secret.

### 4. Create the database

Create a MySQL database matching the name in your `.env` file.

### 5. Run the application

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Auth

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/profile` - Get current user profile (protected)

### Users

- `GET /users` - Get all users (protected)
- `GET /users/me` - Get current user (protected)
- `GET /users/:id` - Get user by ID (protected)

### Rooms

- `GET /rooms` - Get all rooms (protected)
- `GET /rooms/my-rooms` - Get rooms for current user (protected)
- `GET /rooms/:id` - Get room by ID (protected)
- `POST /rooms` - Create a new room (protected)
- `PATCH /rooms/:id` - Update room (protected)
- `POST /rooms/:id/members` - Add members to room (protected)

### Messages

- `GET /messages/room/:roomId` - Get messages for a room (protected)
- `POST /messages` - Create a new message (protected)

## WebSocket Events

### Client to Server

- `joinRoom` - Join a chat room
- `leaveRoom` - Leave a chat room
- `sendMessage` - Send a message to a room

### Server to Client

- `newMessage` - Receive a new message

## License

This project is licensed under the MIT License - see the LICENSE file for details.
