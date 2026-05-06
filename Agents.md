# AI Assistant Guidelines for znajdzjubilera Project

## Project Overview
This is a Payload CMS 3.0 project built with Next.js, TypeScript, and MongoDB. The project includes both frontend and admin panel components.

## Technology Stack
- **Framework**: Next.js
- **CMS**: Payload CMS
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB (@payloadcms/db-mongodb)
- **Rich Text**: @payloadcms/richtext-lexical
- **Testing**: Vitest (unit), Playwright (E2E)
- **Linting**: Biome
- **Package Manager**: pnpm

Important:
- Always check `package.json` before start work and check actual versions;

## Development Setup
1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env` and configure environment variables
3. Start development server: `pnpm dev`
4. Access admin panel at `/admin`

## Project Structure
- `/src/app/(frontend)` - Frontend pages and components
- `/src/app/(payload)` - Admin panel and API routes
- `/src/blocks` - Custom block types for Payload
- `/src/utils` - Utility functions
- `/tests` - Test files
- `/public` - Static assets

## Coding Standards
- Use TypeScript strict mode
- Follow existing code formatting (Biome handles this)
- Use functional components with React hooks
- Tailwind CSS for styling (classnames sorted alphabetically)
- Prefer `clsx` for conditional class names
- Export constants and types from dedicated files when reused

## Linting and Formatting
- Run linting: `pnpm check`
- Biome is configured for formatting and linting
- Format on save is recommended in editor settings

## Testing
- Unit tests: `pnpm test:int` (Vitest)
- E2E tests: `pnpm test:e2e` (Playwright)
- All tests: `pnpm test`
- Test files should be placed alongside source files or in `/tests`

## Build and Deployment
- Build for production: `pnpm build`
- Start production server: `pnpm start`
- Development with clean slate: `pnpm devsafe`
- Generate types: `pnpm generate:types`
- Generate import map: `pnpm generate:importmap`

## Payload CMS Specific Guidelines
- Collections are defined in Payload config
- Custom fields and components go in appropriate directories
- Access control should be implemented for all collections
- Use Payload's built-in validation where possible
- Custom React components for fields should be in `/src/app/(payload)/components`

## Common Tasks for AI Assistants
1. When adding new features:
   - Define Payload collections/fields first
   - Create corresponding frontend components
   - Add tests for new functionality
   - Update documentation if needed

2. When fixing bugs:
   - Check both frontend and backend logic
   - Ensure type safety with TypeScript
   - Verify changes don't break existing functionality
   - Add regression tests when appropriate

3. When updating dependencies:
   - Check compatibility with Payload CMS version
   - Run tests after updates
   - Update lockfile with `pnpm install`

## File Naming Conventions
- Components: PascalCase (e.g., `MyComponent.tsx`)
- Utilities: camelCase (e.g., `validateSlug.ts`)
- Pages: lowercase with hyphens for routes (e.g., `[slug]/page.tsx`)
- Config files: lowercase with hyphens (e.g., `payload.config.ts`)
- Test files: same name as source with `.test` suffix

## Git Practices
- Commit messages should be descriptive and in imperative mood
- Branch naming: `feature/`, `bugfix/`, `docs/`, etc.
- Keep commits atomic and focused
- Pull requests should include description of changes

## Environment Variables
Required variables (see `.env.example`):
- `PAYLOAD_SECRET`
- `MONGODB_URI`
- `NEXT_PUBLIC_SERVER_URL`
- Others as needed for integrations