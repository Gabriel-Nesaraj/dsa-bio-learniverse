
# DSA Bio Learniverse

DSA Bio Learniverse is an interactive learning platform for Data Structures and Algorithms. Users can explore various algorithms, data structures, and solve programming problems in different categories.

## Project info

**URL**: https://lovable.dev/projects/2a6da6ec-bff0-4c6c-8822-0cb739fd4b1a

## How to Run Locally

Follow these steps to run the application on your local machine:

### Prerequisites

- Node.js (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm (usually comes with Node.js)

### Installation Steps

1. **Clone the repository**

   ```sh
   git clone <YOUR_REPO_URL>
   cd dsa-bio-learniverse
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Start the development server**

   ```sh
   npm run dev
   ```

   This will start the application on [http://localhost:8080](http://localhost:8080)

### Project Structure

- `src/components` - UI components
- `src/pages` - Page components for different routes
- `src/contexts` - React contexts for authentication
- `src/hooks` - Custom React hooks
- `src/services` - API services

### Authentication

This application uses Keycloak for authentication. In the development environment, it connects to a pre-configured Keycloak instance.

## Features

- Explore various algorithms and data structures
- Interactive problem solving interface
- User authentication and profiles
- Progress tracking

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2a6da6ec-bff0-4c6c-8822-0cb739fd4b1a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Keycloak for authentication
- React Router for routing
- TanStack Query for data fetching

## Deployment

Simply open [Lovable](https://lovable.dev/projects/2a6da6ec-bff0-4c6c-8822-0cb739fd4b1a) and click on Share -> Publish.

## Custom Domain

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
