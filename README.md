# n8n-nodes-inalambria-express

This is an n8n community node that allows you to send SMS messages using the [Inalambria Express](https://inalambria.express) API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Availability

| Country | Status |
|---------|--------|
| Colombia | Available |
| Mexico | Coming soon |

> **Note:** Inalambria Express currently operates in Colombia. Support for Mexico is planned for the future.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### npm

```bash
npm install n8n-nodes-inalambria-express
```

### In n8n

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-inalambria-express` and confirm

## Credentials

To use this node, you need an API key from Inalambria Express:

1. Log in to your [Inalambria Express](https://inalambria.express) account
2. Navigate to API settings to obtain your API key
3. In n8n, create new credentials of type **Inalambria Express API**
4. Paste your API key

## Operations

### Message

| Operation | Description |
|-----------|-------------|
| **Send SMS** | Send an SMS to one or multiple recipients |
| **Send Batch** | Send different SMS messages to different groups of recipients |
| **Send Template** | Send personalized SMS using templates with variables |
| **Get History** | Retrieve message history with optional filters |

### Account

| Operation | Description |
|-----------|-------------|
| **Get Balance** | Get current credit balance and usage statistics |

### Job

| Operation | Description |
|-----------|-------------|
| **Get Status** | Get the status of an async job by ID |
| **Get Pending** | List all pending async jobs |

## Usage Examples

### Send SMS

Send a simple SMS to multiple recipients:

1. Add the **Inalambria Express** node
2. Select **Message** resource and **Send SMS** operation
3. Enter your sender ID (e.g., "MyCompany")
4. Add recipient phone numbers (E.164 format: +573001234567)
5. Enter your message content

### Send Template SMS

Send personalized messages using variables:

1. Select **Send Template** operation
2. Set your template message: `Hello {{name}}, your code is {{code}}`
3. Add recipients with their variables as JSON:
   ```json
   {
     "+573001234567": {"name": "Juan", "code": "1234"},
     "+573009876543": {"name": "Maria", "code": "5678"}
   }
   ```

### Async Operations

For large batches, enable async mode:

1. Set **Async** to `true` in additional options
2. The node returns a `jobId`
3. Use **Job > Get Status** to check progress

## Compatibility

- n8n version: 0.200.0 or later
- Node.js version: 18.x or later

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Inalambria Express API documentation](https://api.inalambria.express/docs)

## License

[MIT](LICENSE.md)
