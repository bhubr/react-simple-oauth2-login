import { GrantIdentifier } from '@jmondi/oauth2-server';

export const apps = [
  {
    id: 'peggy-app',
    userId: 1,
    name: "Peggy's Sample App",
    clientId: 'implicit-grant-0001',
    secret: 'peggy-secret',
    redirectUris: [
      'http://localhost:5173/oauth/callback',
      'http://localhost:5000/oauth/callback',
    ],
    scopes: [
      {
        name: 'user-email',
      },
      {
        name: 'user-avatar',
      },
    ],
    allowedGrants: ['implicit' as GrantIdentifier],
  },
  {
    id: 'dwight-app',
    userId: 2,
    name: "Dwight's Sample App",
    clientId: 'authorization-code-0002',
    secret: 'dwight-secret',
    redirectUris: [
      'http://localhost:5174/oauth/callback',
      'http://localhost:5000/oauth/callback',
    ],
    scopes: [
      {
        name: 'user-email',
      },
    ],
    allowedGrants: ['authorization_code' as GrantIdentifier],
  },
];

const appModel = {
  findAll: () => Promise.resolve(apps),

  findByUserId: async (userId: number) => {
    const app = apps.filter((a) => a.userId === userId);
    return app;
  },

  findOneByClientId: async (clientId: string) => {
    const app = apps.find((a) => a.clientId === clientId);
    if (!app) {
      throw new Error(`Invalid client id ${clientId}`);
    }
    return app;
  },

  findOne: async (clientId: string) => {
    const app = apps.find((a) => a.clientId === clientId);
    if (!app) {
      throw new Error(`Invalid client id ${clientId}`);
    }
    return app;
  },
};

export default appModel;
