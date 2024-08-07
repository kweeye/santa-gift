
# Santa App

## Overview
The Santa App allows children to submit their Christmas wishes to Santa. The app verifies if the child is registered and under 10 years old before accepting the request. The app also periodically sends emails to Santa with all pending requests.

## Features
- **Form Submission**: Children can enter their ID and a message to Santa.
- **Validation**: The server checks if the child is registered and under 10 years old.
- **Error Handling**: Displays error messages for invalid submissions.
- **Success Handling**: Displays a confirmation message if the request is valid.
- **Email Notifications**: Sends emails to Santa with all pending requests every 15 seconds.

## Folder Structure
```
my-app/
├── client/
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── ...
│   ├── .env
│   ├── package.json
│   └── ...
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── index.ts
│   │   └── ...
│   ├── dist/
│   ├── tsconfig.json
│   ├── package.json
│   └── ...
├── node_modules/
├── package.json
├── .gitignore
└── README.md
```

## Code Quality
- **Readability**: The code is organized and well-commented, making it easy to understand. Functions and variables are named descriptively, indicating their purpose and usage.
- **Use of Modern Syntax**: The project leverages modern JavaScript/TypeScript features such as ES6+ syntax, async/await for asynchronous operations, and ES6 modules for import/export. This makes the code concise and efficient.
- **TypeScript**: The use of TypeScript enhances code quality by providing static typing, which helps in catching errors early during development and improving code maintainability.

## Does the App Work as Designed?
- **Form Submission**: The web app allows children to enter their ID and a message to Santa. Upon submission, the server verifies if the child is registered and below 10 years old using the provided JSON data.
- **Error Handling**: If the child is not registered or is older than 10 years, the app displays an appropriate error message.
- **Success Handling**: If the child is eligible, the app displays a confirmation message indicating that the request has been received.
- **Email Sending**: Every 15 seconds, the server sends an email with all pending requests to Santa. This email includes the child's username, address, and the message they submitted.

## App Architecture
- **Folder Structure**: The project is organized into client and server directories, separating the frontend and backend logic. Each directory has its own `node_modules` and `package.json` for managing dependencies.
  - **Root Directory**: Contains the overall project configuration and scripts to run both client and server concurrently.
  - **Client Directory**: Contains the React application, organized into `public` and `src` directories.
    - **Public Directory**: Holds static files like `index.html`.
    - **Src Directory**: Contains React components, main entry points, and other frontend logic.
  - **Server Directory**: Contains the Express server code, organized into `src` and `dist` directories.
    - **Src Directory**: Holds TypeScript source files, including route handlers and server setup.
    - **Dist Directory**: Contains compiled JavaScript files from TypeScript.
- **Configuration Management**: TypeScript configurations are managed using `tsconfig.json`.

## Documentation
- **Why Packages Were Added or Changed**:
  - **TypeScript**: Added to enable static typing, which improves code quality and maintainability.
  - **Nodemailer**: Used to handle email sending functionality, making it easy to send emails from the server.
  - **Express**: A minimal and flexible Node.js web application framework used for setting up the server and handling routes.
  - **Body-parser**: Middleware for parsing incoming request bodies in a middleware before handling them.
  - **Node-fetch**: A lightweight module that brings `window.fetch` to Node.js, used for making HTTP requests to fetch JSON data.
  - **React-Scripts**: Provides a set of scripts and configuration used by Create React App for building and running the React application.
  - **Concurrently**: Allows running multiple commands concurrently, useful for running both client and server with a single command.
  - **@types Packages**: Type definitions for various libraries to ensure TypeScript compatibility and provide type safety.

## Running the Project
1. **Install Dependencies**:
   ```bash
   npm install
   cd client
   npm install
   cd ../server
   npm install
   cd ..
   ```

2. **Build the Project**:
   ```bash
   cd client
   npm run build
   cd ../server
   npx tsc
   cd ..
   ```

3. **Start the Project**:
   ```bash
   npm start
   ```

## Configuration
- **Client Port**: Configured in `client/.env` to run on port 3001.
- **Server Port**: Configured in `server/src/index.ts` to run on port 3000.

