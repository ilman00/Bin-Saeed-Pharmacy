# Project Setup

## Install dependencies
npm install

## Start the server
nodemon app.js
Replace app.js with your main file.

## Production
node app.js

# Environment Variables
Create a .env file with:
SECRET=your_secret_key
MONGODB_URL=your_mongo_connection_string

# Login Issue
If you cannot log in, remove the middleware from the register route, register a new user, then try again.

# Folder Structure
- views holds EJS templates
- public holds static files
- routes holds route files
- app.js starts the server
