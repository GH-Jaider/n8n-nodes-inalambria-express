import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class InalambriaExpressApi implements ICredentialType {
  name = 'inalambriaExpressApi';

  displayName = 'Inalambria Express API';

  documentationUrl = 'https://inalambria.express/docs';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Inalambria Express API key for authentication',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.inalambria.express/v1',
      url: '/messages/balance',
      method: 'GET',
    },
  };
}
