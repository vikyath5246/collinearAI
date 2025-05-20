# Hugging Face Dataset Explorer - Frontend

This is the frontend application for the Hugging Face Dataset Explorer, built with Next.js and styled according to Collinear AI's design.

## Features

- User authentication (sign up, sign in)
- Dataset exploration
- Dataset following
- Impact assessment visualization
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (default: http://localhost:8000)

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Create a `.env.local` file based on `.env.example`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Update the environment variables in `.env.local` if needed.

5. Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker

### Building the Docker Image

\`\`\`bash
docker build -t hf-dataset-explorer-frontend \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 .
\`\`\`

### Running the Docker Container

\`\`\`bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  hf-dataset-explorer-frontend
\`\`\`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | URL of the backend API | http://localhost:8000 |

## Deployment

The application can be deployed to any platform that supports Node.js applications, such as Vercel, Netlify, or a custom server.

### Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel
3. Set the environment variables
4. Deploy

## Advanced System Design Considerations

### Deployment Strategies

- **CI/CD Pipeline**: Implement automated testing and deployment using GitHub Actions or similar tools
- **Blue-Green Deployment**: Use this strategy to minimize downtime during updates
- **Containerization**: Docker containers for consistent environments across development and production

### Scaling the APIs

- **Load Balancing**: Distribute traffic across multiple instances
- **Caching**: Implement client-side and CDN caching for static assets and API responses
- **Serverless Functions**: Use serverless functions for API routes to handle scaling automatically

### Database Scaling

- **Connection Pooling**: Optimize database connections
- **Read Replicas**: Distribute read operations across multiple database instances
- **Sharding**: Partition data across multiple databases for horizontal scaling

### Monitoring and Debugging

- **Logging**: Implement structured logging with tools like Winston or Pino
- **Error Tracking**: Use services like Sentry to track and notify about errors
- **Performance Monitoring**: Implement Real User Monitoring (RUM) to track frontend performance

### Query Optimization

- **Pagination**: Implement cursor-based pagination for large datasets
- **Selective Loading**: Only fetch required fields from the API
- **Indexing**: Ensure proper database indexes are in place for frequent queries

## License

This project is licensed under the MIT License.
