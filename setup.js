const { execSync } = require('child_process');

// Initialize a new Node.js project
execSync('npm init -y');

// Install dependencies
execSync('npm install express mongoose dotenv cors zod');
execSync('npm install --save-dev typescript @types/express @types/node @types/cors ts-node-dev');

// Initialize TypeScript configuration
execSync('npx tsc --init');

console.log('Project setup complete. Dependencies installed.');

