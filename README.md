# Chizek API

A NestJS-based GraphQL API for the Chizek application, providing forum and chat functionality.

## Features

- GraphQL API with Apollo Server
- MongoDB integration with Mongoose
- Authentication using JWT
- Forum functionality
- Real-time chat

## Prerequisites

### System Requirements

- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- Yarn package manager

### Core Dependencies

- TypeScript (^5.7.3)
- NestJS CLI (^11.0.0)
- NestJS Core (^11.0.6)
- GraphQL (^16.10.0)
- Apollo Server (^4.11.3)
- Mongoose (^8.9.4)
- MongoDB Driver (^6.12.0)

### Authentication & Security

- Passport (^0.7.0)
- JWT (^11.0.0)
- bcrypt (^5.1.1)

### Validation & Transformation

- class-validator (^0.14.1)
- class-transformer (^0.5.1)

### Logging & Monitoring

- nestjs-pino (^4.2.0)
- pino-http (^10.4.0)

### Global Package Installation

Install these packages globally:

```bash
# Install NestJS CLI
yarn global add @nestjs/cli@11.0.0

# Install TypeScript
yarn global add typescript@5.7.3
```

### Development Tools

For the best development experience, ensure your IDE has the following:

- TypeScript support
- ESLint integration (^9.22.0)
- Prettier integration (^3.5.3)
- GraphQL extension

Recommended VS Code extensions:

- ESLint
- Prettier
- GraphQL

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/chizek-api.git
cd chizek-api
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DB_NAME=your_db_name
PORT=
MONGODB_URI=mongodb://your_db_url
TESTDB_URI=mongodb://your_test_db_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=your_duration
AWS_REGION=
AWS_ACCESS_KEY=
AWS_SECRET_ACCESS_KEY=
```

## Running the Database

Start MongoDB locally:

```bash
mongod --dbpath=databases/mongo/data
```

## Running the Application

```bash
# Development mode
yarn start:dev

# Production build
yarn build
yarn start:prod

# Debug mode
yarn start:debug
```

## Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

### Test Configuration

- Jest configuration in `jest.config.ts`
- E2E tests in `test` directory
- Coverage reports in `coverage` directory

## Code Style and Linting

### ESLint Configuration

- Configuration file: `eslint.config.mjs`
- TypeScript-specific rules enabled
- Prettier integration

### Prettier Configuration

- Configuration file: `.prettierrc`
- Consistent code formatting across the project

## Error Handling

The API uses standard HTTP status codes and GraphQL errors:

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the established code style
- Write tests for new features
- Update documentation as needed
- Use meaningful commit messages

## Deployment

### Production Build

```bash
yarn build
yarn start:prod
```

### Production Requirements

- Node.js production environment
- MongoDB instance
- Environment variables properly configured
- Sufficient memory and CPU resources

## Troubleshooting

Common issues and solutions:

1. MongoDB connection issues:

   - Verify MongoDB is running
   - Check connection string
   - Ensure correct credentials

2. GraphQL endpoint issues:
   - Check Apollo Server configuration
   - Verify schema generation
   - Check resolver implementations
