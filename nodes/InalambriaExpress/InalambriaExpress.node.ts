import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestMethods,
  IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class InalambriaExpress implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Inalambria Express',
    name: 'inalambriaExpress',
    icon: 'file:inalambria-express.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Send SMS messages via Inalambria Express API',
    defaults: {
      name: 'Inalambria Express',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'inalambriaExpressApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: 'https://api.inalambria.express/v1',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      // Resource Selection
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Message',
            value: 'message',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Job',
            value: 'job',
          },
        ],
        default: 'message',
      },

      // ==================== MESSAGE OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['message'],
          },
        },
        options: [
          {
            name: 'Send SMS',
            value: 'send',
            description: 'Send same SMS to multiple recipients',
            action: 'Send SMS to multiple recipients',
          },
          {
            name: 'Send Batch',
            value: 'sendBatch',
            description: 'Send different SMS to different groups',
            action: 'Send batch of different SMS messages',
          },
          {
            name: 'Send Template',
            value: 'sendTemplate',
            description: 'Send personalized SMS with template variables',
            action: 'Send personalized SMS with templates',
          },
          {
            name: 'Get History',
            value: 'getHistory',
            description: 'Get message sending history',
            action: 'Get message history',
          },
        ],
        default: 'send',
      },

      // ==================== ACCOUNT OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['account'],
          },
        },
        options: [
          {
            name: 'Get Balance',
            value: 'getBalance',
            description: 'Get current credit balance',
            action: 'Get credit balance',
          },
        ],
        default: 'getBalance',
      },

      // ==================== JOB OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['job'],
          },
        },
        options: [
          {
            name: 'Get Status',
            value: 'getStatus',
            description: 'Get status of an async job',
            action: 'Get job status',
          },
          {
            name: 'Get Pending',
            value: 'getPending',
            description: 'List all pending and processing jobs',
            action: 'Get pending jobs',
          },
        ],
        default: 'getStatus',
      },

      // ==================== SEND SMS FIELDS ====================
      {
        displayName: 'Message Content',
        name: 'content',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['send'],
          },
        },
        description: 'The SMS message text to send to all recipients',
        placeholder: 'Hello! Your order has been confirmed.',
      },
      {
        displayName: 'Recipients',
        name: 'recipients',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['send'],
          },
        },
        description:
          'Comma-separated list of phone numbers in E.164 format (e.g., +5730XXXXXXXX, +5730YYYYYYYY)',
        placeholder: '+5730XXXXXXXX, +5730YYYYYYYY',
      },
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['send'],
          },
        },
        options: [
          {
            displayName: 'Async Mode',
            name: 'async',
            type: 'boolean',
            default: true,
            description:
              'Whether to process asynchronously. When true, returns immediately with a job ID. When false, waits for completion (rate limited to 30 req/min).',
          },
          {
            displayName: 'Schedule At',
            name: 'scheduledAt',
            type: 'dateTime',
            default: '',
            description: 'Schedule the message for future delivery (ISO 8601 format)',
          },
        ],
      },

      // ==================== SEND BATCH FIELDS ====================
      {
        displayName: 'Batch Items',
        name: 'batchItems',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
          minValue: 1,
        },
        default: { items: [] },
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendBatch'],
          },
        },
        description: 'Each item contains a message and its recipients',
        options: [
          {
            name: 'items',
            displayName: 'Items',
            values: [
              {
                displayName: 'Message Content',
                name: 'content',
                type: 'string',
                typeOptions: {
                  rows: 2,
                },
                default: '',
                required: true,
                description: 'The SMS message text for this batch item',
              },
              {
                displayName: 'Recipients',
                name: 'recipients',
                type: 'string',
                default: '',
                required: true,
                description:
                  'Comma-separated phone numbers in E.164 format for this message',
                placeholder: '+5730XXXXXXXX, +5730YYYYYYYY',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Additional Options',
        name: 'batchAdditionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendBatch'],
          },
        },
        options: [
          {
            displayName: 'Async Mode',
            name: 'async',
            type: 'boolean',
            default: true,
            description:
              'Whether to process asynchronously. When true, returns immediately with a job ID.',
          },
          {
            displayName: 'Schedule At',
            name: 'scheduledAt',
            type: 'dateTime',
            default: '',
            description: 'Schedule the batch for future delivery (ISO 8601 format)',
          },
        ],
      },

      // ==================== SEND TEMPLATE FIELDS ====================
      {
        displayName: 'Template Pattern',
        name: 'pattern',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendTemplate'],
          },
        },
        description:
          'Message template with variables in {{variable}} format. Example: Hello {{name}}, your code is {{code}}.',
        placeholder: 'Hello {{name}}! Your verification code is: {{code}}',
      },
      {
        displayName: 'Template Recipients',
        name: 'templateRecipients',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
          minValue: 1,
        },
        default: { recipients: [] },
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendTemplate'],
          },
        },
        description: 'Each recipient with their personalized variables',
        options: [
          {
            name: 'recipients',
            displayName: 'Recipients',
            values: [
              {
                displayName: 'Phone Number',
                name: 'phone',
                type: 'string',
                default: '',
                required: true,
                description: 'Phone number in E.164 format',
                placeholder: '+5730XXXXXXXX',
              },
              {
                displayName: 'Variables',
                name: 'variables',
                type: 'json',
                default: '{}',
                required: true,
                description:
                  'JSON object with variable values. Example: {"name": "John", "code": "1234"}',
                placeholder: '{"name": "John", "code": "1234"}',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Additional Options',
        name: 'templateAdditionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendTemplate'],
          },
        },
        options: [
          {
            displayName: 'Async Mode',
            name: 'async',
            type: 'boolean',
            default: true,
            description:
              'Whether to process asynchronously. When true, returns immediately with a job ID.',
          },
          {
            displayName: 'Schedule At',
            name: 'scheduledAt',
            type: 'dateTime',
            default: '',
            description: 'Schedule the template message for future delivery',
          },
        ],
      },

      // ==================== GET HISTORY FIELDS ====================
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['getHistory'],
          },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 20,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['getHistory'],
            returnAll: [false],
          },
        },
        description: 'Max number of results to return (1-100)',
      },
      {
        displayName: 'Filters',
        name: 'historyFilters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['getHistory'],
          },
        },
        options: [
          {
            displayName: 'Date From',
            name: 'dateFrom',
            type: 'dateTime',
            default: '',
            description: 'Filter messages from this date',
          },
          {
            displayName: 'Date To',
            name: 'dateTo',
            type: 'dateTime',
            default: '',
            description: 'Filter messages until this date',
          },
        ],
      },

      // ==================== JOB STATUS FIELDS ====================
      {
        displayName: 'Job ID',
        name: 'jobId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['job'],
            operation: ['getStatus'],
          },
        },
        description: 'The job ID returned from an async send operation',
        placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: unknown;

        // ==================== MESSAGE RESOURCE ====================
        if (resource === 'message') {
          // Send SMS
          if (operation === 'send') {
            const content = this.getNodeParameter('content', i) as string;
            const recipientsString = this.getNodeParameter('recipients', i) as string;
            const additionalOptions = this.getNodeParameter('additionalOptions', i) as {
              async?: boolean;
              scheduledAt?: string;
            };

            const recipients = recipientsString
              .split(',')
              .map((r) => r.trim())
              .filter((r) => r);

            const body: Record<string, unknown> = {
              content,
              recipients,
            };

            if (additionalOptions.async !== undefined) {
              body.async = additionalOptions.async;
            }
            if (additionalOptions.scheduledAt) {
              body.scheduledAt = additionalOptions.scheduledAt;
            }

            responseData = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'inalambriaExpressApi',
              {
                method: 'POST' as IHttpRequestMethods,
                url: '/messages/send',
                body,
                json: true,
              },
            );
          }

          // Send Batch
          else if (operation === 'sendBatch') {
            const batchItems = this.getNodeParameter('batchItems', i) as {
              items: Array<{ content: string; recipients: string }>;
            };
            const additionalOptions = this.getNodeParameter('batchAdditionalOptions', i) as {
              async?: boolean;
              scheduledAt?: string;
            };

            const items = batchItems.items.map((item) => ({
              content: item.content,
              recipients: item.recipients
                .split(',')
                .map((r) => r.trim())
                .filter((r) => r),
            }));

            const body: Record<string, unknown> = { items };

            if (additionalOptions.async !== undefined) {
              body.async = additionalOptions.async;
            }
            if (additionalOptions.scheduledAt) {
              body.scheduledAt = additionalOptions.scheduledAt;
            }

            responseData = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'inalambriaExpressApi',
              {
                method: 'POST' as IHttpRequestMethods,
                url: '/messages/send/batch',
                body,
                json: true,
              },
            );
          }

          // Send Template
          else if (operation === 'sendTemplate') {
            const pattern = this.getNodeParameter('pattern', i) as string;
            const templateRecipients = this.getNodeParameter('templateRecipients', i) as {
              recipients: Array<{ phone: string; variables: string }>;
            };
            const additionalOptions = this.getNodeParameter('templateAdditionalOptions', i) as {
              async?: boolean;
              scheduledAt?: string;
            };

            const recipients = templateRecipients.recipients.map((r) => ({
              phone: r.phone,
              variables: typeof r.variables === 'string' ? JSON.parse(r.variables) : r.variables,
            }));

            const body: Record<string, unknown> = {
              pattern,
              recipients,
            };

            if (additionalOptions.async !== undefined) {
              body.async = additionalOptions.async;
            }
            if (additionalOptions.scheduledAt) {
              body.scheduledAt = additionalOptions.scheduledAt;
            }

            responseData = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'inalambriaExpressApi',
              {
                method: 'POST' as IHttpRequestMethods,
                url: '/messages/send/template',
                body,
                json: true,
              },
            );
          }

          // Get History
          else if (operation === 'getHistory') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('historyFilters', i) as {
              dateFrom?: string;
              dateTo?: string;
            };

            const qs: Record<string, string | number> = {};

            if (filters.dateFrom) {
              qs.dateFrom = filters.dateFrom;
            }
            if (filters.dateTo) {
              qs.dateTo = filters.dateTo;
            }

            if (returnAll) {
              // Paginate through all results
              const allResults: unknown[] = [];
              let offset = 0;
              const limit = 100;
              let hasMore = true;

              while (hasMore) {
                const response = (await this.helpers.httpRequestWithAuthentication.call(
                  this,
                  'inalambriaExpressApi',
                  {
                    method: 'GET' as IHttpRequestMethods,
                    url: '/messages/history',
                    qs: { ...qs, limit, offset },
                    json: true,
                  },
                )) as { consumptions: unknown[]; total: number };

                allResults.push(...response.consumptions);
                offset += limit;
                hasMore = offset < response.total;
              }

              responseData = { consumptions: allResults, total: allResults.length };
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              qs.limit = limit;
              qs.offset = 0;

              responseData = await this.helpers.httpRequestWithAuthentication.call(
                this,
                'inalambriaExpressApi',
                {
                  method: 'GET' as IHttpRequestMethods,
                  url: '/messages/history',
                  qs,
                  json: true,
                },
              );
            }
          }
        }

        // ==================== ACCOUNT RESOURCE ====================
        else if (resource === 'account') {
          if (operation === 'getBalance') {
            responseData = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'inalambriaExpressApi',
              {
                method: 'GET' as IHttpRequestMethods,
                url: '/messages/balance',
                json: true,
              },
            );
          }
        }

        // ==================== JOB RESOURCE ====================
        else if (resource === 'job') {
          // Get Job Status
          if (operation === 'getStatus') {
            const jobId = this.getNodeParameter('jobId', i) as string;

            responseData = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'inalambriaExpressApi',
              {
                method: 'GET' as IHttpRequestMethods,
                url: `/messages/job/${jobId}`,
                json: true,
              },
            );
          }

          // Get Pending Jobs
          else if (operation === 'getPending') {
            responseData = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'inalambriaExpressApi',
              {
                method: 'GET' as IHttpRequestMethods,
                url: '/messages/jobs/pending',
                json: true,
              },
            );
          }
        }

        // Format output
        if (Array.isArray(responseData)) {
          returnData.push(
            ...responseData.map((item) => ({
              json: item as IDataObject,
              pairedItem: { item: i },
            })),
          );
        } else {
          returnData.push({
            json: responseData as IDataObject,
            pairedItem: { item: i },
          });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
