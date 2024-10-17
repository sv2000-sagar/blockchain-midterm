
# Project Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- Ganache (for local blockchain development)

## 1. Setup Ganache
- Download and install Ganache from [https://trufflesuite.com/ganache/](https://trufflesuite.com/ganache/).
- Open Ganache and create a new workspace.
- Start the local blockchain.
- Copy the RPC server URL (e.g., `http://127.0.0.1:7545`) for use in your project.

## 2. Install Dependencies
Make sure to install all required dependencies for both the server and client.

### 2.1 Install server dependencies
Run the following command in the root of the project:
```
npm install
```

### 2.2 Navigate to the client project directory
Change to the client directory containing the Vite project:
```
cd client/vite-project
```

### 2.3 Install client dependencies
Now, run the following command to install client dependencies:
```
npm install
```

## 3. Start the Development Server
After installing all the dependencies, you can start the development server:
```
npm run dev
```

- The development server should now be running.
- Open your browser and go to the provided URL (usually `http://localhost:3000` or `http://localhost:5173`).

## Notes
- Make sure Ganache is running before you start the development server.
- If you encounter any issues, check the console logs for error messages.
