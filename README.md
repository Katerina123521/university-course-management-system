A full-stack web application for managing university courses.

Users can log in and create, view, edit and delete their own courses.

## Technologies

Next.js, TypeScript, PostgreSQL, Prisma and Docker.

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
