# Abu Bakr As-Siddiq - Central Mosque of Bogota

## Project Overview

This repository hosts the source code for the official website of the **Central Mosque of Bogota (Abu Bakr As-Siddiq)**. It is structured as a monorepo to manage both the frontend and future backend services within a single repository.

## Architecture

This project follows a monorepo structure (though not yet utilizing specific monorepo tooling like Turborepo or Nx).

### 🎨 Frontend

Located in the `/frontend` directory.

- **Framework**: [Astro](https://astro.build/) (v5)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Icons**: Material Symbols Outlined
- **Fonts**: Public Sans (via Google Fonts)

### ⚙️ Backend

*Status*: To Be Decided

- The backend technology stack has not yet been selected.
- Future backend services will be located in the `/backend` directory.

## Getting Started

### Prerequisites

- **Node.js**: v18.14.1 or higher
- **Package Manager**: [pnpm](https://pnpm.io/) (recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd central-mosque-bogota
   ```

2. **Navigate to the frontend**

   ```bash
   cd frontend
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

### Development

To start the local development server for the frontend:

```bash
pnpm run dev
```

The application will be accessible at `http://localhost:4321`.

### Building for Production

To build the static site for production:

```bash
pnpm run build
```

This will generate the production-ready files in the `dist/` directory.

## Project Structure

```shell
central-mosque-bogota/
├── frontend/          # AstroJS Frontend application
│   ├── src/
│   │   ├── components/# Reusable UI components
│   │   ├── layouts/   # Page layouts (Header, Footer, etc.)
│   │   ├── pages/     # Application routes
│   │   └── styles/    # Global styles and Tailwind config
│   └── public/        # Static assets
├── mockups/           # Design mockups and reference HTML/images
└── README.md          # Project documentation
```

## License

**Private & Proprietary**
© 2024 Central Mosque of Bogota. All rights reserved.
Unauthorized copying, distribution, or use of this source code is strictly prohibited.
