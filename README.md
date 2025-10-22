# Svelte MVVM Clean Architecture Boilerplate

This is a SvelteKit boilerplate project that implements the MVVM (Model-View-ViewModel) pattern with Clean Architecture principles.

## Mock API Setup

This project includes a Mockoon configuration file for mocking API endpoints. To use it:

1. Download and install [Mockoon](https://mockoon.com/) desktop application
2. Run the application
3. Click "Import environment from file" and select the `mockoon-config.json` file in this project
4. The mock API will run on `http://localhost:3001` with the following endpoints:
   - `GET /tasks` - Get all tasks
   - `POST /tasks` - Create a new task
   - `GET /tasks/:id` - Get a specific task
   - `PATCH /tasks/:id` - Update a specific task

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
