# SMS Module

A flexible SMS service module that supports multiple SMS providers with MSG91 as the default implementation.

## Features

- Support for multiple SMS providers
- Default integration with MSG91
- PostgreSQL database for SMS tracking
- RESTful API endpoints
- Input validation
- Extensible architecture

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and fill in your configuration:
```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sms_module
DB_USER=postgres
DB_PASSWORD=your_password

# MSG91 Configuration (Default Provider)
MSG91_AUTH_KEY=your_msg91_auth_key
MSG91_SENDER_ID=your_sender_id
MSG91_ROUTE=4
```

4. Create the PostgreSQL database:
```sql
CREATE DATABASE sms_module;
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Send SMS

```http
POST /api/sms/send
```

#### Request Body

```json
{
  "to": "+919876543210",
  "message": "Your message here",
  "provider": "msg91",  // Optional, defaults to msg91
  "config": {           // Optional, required for custom providers
    "authKey": "your_auth_key",
    "senderId": "SENDER",
    "sendFunction": "customFunction"  // For custom providers
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "sent",
    "response": {}
  }
}
```

### Get SMS Status

```http
GET /api/sms/:id
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "to": "+919876543210",
    "message": "Your message",
    "provider": "msg91",
    "status": "sent",
    "providerResponse": {},
    "metadata": {},
    "createdAt": "2024-02-20T12:00:00.000Z",
    "updatedAt": "2024-02-20T12:00:00.000Z"
  }
}
```

## Using Custom Providers

To use a custom SMS provider, implement the sending logic in your application and pass it through the `config.sendFunction`:

```javascript
const customConfig = {
  sendFunction: async (to, message) => {
    // Your custom SMS sending logic here
    return {
      success: true,
      response: { /* provider response */ }
    };
  }
};

// Make the API call
const response = await fetch('/api/sms/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+919876543210',
    message: 'Test message',
    provider: 'custom',
    config: customConfig
  })
});
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## License

MIT 