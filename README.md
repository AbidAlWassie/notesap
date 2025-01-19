# Multi-Tenant Note-Taking App

This is a multi-tenant note-taking application built with **Next.js v15**, **libSQL**, **Prisma**, and **Next-Auth V5**. The app supports multiple users (tenants), each with its own set of notes, users, and workspaces, allowing seamless collaboration and efficient note management.

Deployed to vercel here: [Live Demo](https://notesap-beta.vercel.app)

## Features

- **Multi-Tenant Architecture**: Supports multiple users, where each user can manage its own set of notes.
- **Authentication with Next-Auth**: Secure login with social authentication providers such as Google, GitHub, and Discord.
- **Real-Time Sync**: Notes are synced in real-time across users' devices, enabling collaborative note-taking.
- **Text Editor**: Users can create and edit notes with rich text formatting using **Tiptap**.
- **Custom UI**: TailwindCSS combined with **Shadcn** components for a aesthetic, responsive design.
- **Scalable Database**: User auth and other data is managed using **PostgreSQL** and notes are managed using **libSQL**, providing a scalable solution for multi-tenant applications.
- **Mobile Responsive**: Fully optimized for mobile, tablet, and desktop devices.

## Tech Stack

- **Next.js** v15
- **Next-Auth** V5 for authentication
- **libSQL** for multi-tenant database management
- **Prisma** ORM for database interactions
- **PostgreSQL** for all user auth and interaction
- **Tiptap** for the rich text editor
- **Shadcn** for UI components
- **TailwindCSS** for styling

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v18 or later)
- **pnpm** (recommended for package management)
- **libSQL** for notes

### Installation

1. **Fork** and then **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/notesap.git
   cd notesap
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env` file at the root of your project and add the following environment variables:

   ```bash
   NEXT_PUBLIC_CRUD_API_KEY=YOUR_CRUD_API_KEY
   NEXT_PUBLIC_API_URL=YOUR_API_URL

   GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

   GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
   GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET

   DISCORD_CLIENT_ID=YOUR_DISCORD_CLIENT_ID
   DISCORD_CLIENT_SECRET=YOUR_DISCORD_CLIENT_SECRET

   NEXT_PRIVATE_DEBUG_CACHE=YOUR_DEBUG_CACHE_KEY

   DATABASE_URL=YOUR_DATABASE_URL
   TURSO_DATABASE_URL=YOUR_TURSO_DATABASE_URL
   TURSO_AUTH_TOKEN=YOUR_TURSO_AUTH_TOKEN
   TURSO_API_TOKEN=YOUR_TURSO_API_TOKEN
   TURSO_ORG_ID=YOUR_TURSO_ORG_ID

   NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
   ```

   - Generate the `NEXT_PUBLIC_CRUD_API_KEY` using `openssl rand -hex 32` or `openssl rand -base64 32`.
   - Set `DATABASE_URL` and `TURSO_DATABASE_URL` based on your database provider (libSQL or others).

### Development

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Open `http://localhost:3000` in your browser to access the app.

### Testing Commands

1. To destroy the databases with "user-[id]" using turso cli run:

   ```bash
   turso db list | grep '^user-' | awk '{print $1}' | xargs -I {} turso db destroy {} -y
   ```

### Building for Production

1. Build the application for production:

   ```bash
   pnpm build
   ```

2. Start the production server:

   ```bash
   pnpm start
   ```

## Deployment

You can deploy this app to platforms like **Vercel**, **Netlify**, or any other service that supports Next.js deployments.

### Deployment to Vercel

1. Push your changes to your GitHub repository.
2. Connect the repository to **Vercel**. Vercel will automatically detect the project as a Next.js app.
3. Add the necessary environment variables in the Vercel dashboard.
4. Finally deploy.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next-Auth Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/nextjs)
- [Shadcn UI Documentation](https://ui.shadcn.com/docs/installation/next)
- [TailwindCSS Documentation](https://tailwindcss.com/docs/guides/nextjs)
- [Turso/libSQL Documentation](https://turso.tech/libsql)

## Contributing

We welcome contributions! To contribute to the project:

1. Fork the repository.
2. Create a new branch for your changes.
3. Submit a pull request to the main repository.

## License

This project is licensed under the [Creative Commons Legal Code](LICENSE).
