# Police App v2

A Next.js application for police management with criminal and crime tracking capabilities.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create SQLite database:
```bash
npm run db:create
```

3. Seed the database (optional):
```bash
npm run db:seed
```

## Development

### Web Development
```bash
npm run dev
```

### Desktop App Development
```bash
npm run electron:dev
```

## Building

### Web Build
```bash
npm run build
npm start
```

### Desktop App Build
```bash
# Create distributable packages
npm run electron:dist

# Create unpacked app for testing
npm run electron:pack
```

## Database Management

- Create database: `npm run db:create`
- Run migrations: `npm run db:migrate`
- Reset database: `npm run db:reset`
- Open Drizzle Studio: `npm run db:studio`
- Seed database: `npm run db:seed`

## Features

- Criminal search and management
- Crime tracking and categorization
- Responsive web interface
- Desktop application support via Electron
- SQLite database with Drizzle ORM
- Modern UI with shadcn/ui components