# Node.js Express API

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd node-express-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following environment variables:

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Server Configuration
PORT=3000

# Environment
NODE_ENV=development
```

Required variables:
- `MONGODB_URI`: Connection string for MongoDB Atlas.
- `PORT`: Port number for the server (default is 3000).
- `NODE_ENV`: Environment mode (development, production, test).

## Running the Project

To start the server, run:
```
npm start
```

The server will automatically redirect HTTP requests to HTTPS.

## API Endpoints

### Create User

**POST** `/users`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### List Users

**GET** `/users`

Query Parameters:
- `page`: Page number for pagination.
- `limit`: Number of users per page.
- `q`: Search query for filtering by name.
- `sort`: Sort by attribute (e.g., `name`).

### Get User by ID

**GET** `/users/{id}`

### Update User

**PUT** `/users/{id}`

Request Body:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

### Delete User

**DELETE** `/users/{id}`

### User Statistics

**GET** `/users/stats`

Response:
```json
{
  "totalUsers": 120,
  "lastWeekUsers": 15,
  "byDomain": {
    "gmail.com": 80,
    "hotmail.com": 25,
    "yahoo.com": 15
  }
}
```

## Testing

To run unit tests:
```
npm run test:unit
```

To run integration tests:
```
npm run test:integration
```

## Deployment

This project is configured to be deployed on Vercel. Ensure that the environment variables are set in the Vercel dashboard.