# CS440 Movie Database - Layered Version
This project is a refactored version of the movie database system implementing a Layered Architectural style. 
This version of the app utilizes:
- Node JS
- Express JS
- PostgreSQL

The reason for these technology choices is not only are they commonly used for developing web applications, but I am very familiar in using them, so why not use them for this project.

# Requirements
Before starting, the following must be installed:

- Node.js and npm
- PostgreSQL installed and setup on system

# Setup Instructions
Clone the repository containing the layered architecture: <br>
`git clone -b refactor-layered-arch https://github.com/heb229/CS440-Project.git`

Navigate to the app directory:
`cd CS440-Project/layered-architecture`

Install dependencies:
`npm i`
or
`npm install`

# Database Setup
Validate if PostgreSQL is installed: `psql --version`

  If not, here is the website to install PostgreSQL for your OS: `https://www.postgresql.org/download/`

Once Postgres is installed, run: `touch .env`

Fill in the .env file with your database information, here is a template to use:

> #Databse Configuration <br>
DB_HOST="<YOUR_HOST_NAME>" <br>
DB_PORT=<YOUR_PORT> <br>
DB_USER="<YOUR_USER_NAME>" <br>
DB_PASSWORD="<YOUR_PASSWORD>" <br>
DB_NAME="<YOUR_DB_NAME>" <br>

# Run the Application
Now run: `node server.js`

For confirmation it's working, you should see:
> Listening on port <YOUR_PORT> <br>
Connected to PostgreSQL database.

Open up your browser, and navigate to local host `http://localhost:3000` (For this example, we're using port 3000) 

# Project Structure
> layered-architecture/ <br>
> \- server.js <br>
> \- package.json <br>
>
> \- presentation-layer <br>
> |  - public <br>
> |  - routes <br>
> \- business-logic-layer <br>
> |  - services <br>
> \- persistence-layer <br>
> |  - repositories <br>
> \- database-layer <br>
> |  - db.js <br>
> |  - schema.sql <br>
