A full-stack web application for managing university courses.

Users can log in and create, view, edit and delete their own courses.

## Technologies

Next.js, TypeScript, PostgreSQL, Prisma and Docker.


## Environment Setup

Create a `.env` file in the root of the project and add:

```env
DATABASE_URL="postgresql://admin:password@localhost:5432/unicourses"
The database credentials are already configured in docker-compose.yml, so you do not need to create a database manually.
Start the PostgreSQL database with:

docker compose up -d

## Run the Project
Install the dependencies and start the database and application:

```bash
npm install
docker compose up -d
npx prisma generate
npx prisma migrate deploy
npm run dev

Before running the application, copy .env.example to .env and add the required environment variables.

Then open http://localhost:3000 in your browser


This project was developed as part of university coursework to practice full-stack web development, database integration and CRUD functionality.
