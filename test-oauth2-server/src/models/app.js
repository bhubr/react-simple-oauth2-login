const apps = [
  {
    id: 1,
    userId: 1,
    name: "Peggy's Sample App",
    clientId: 'peggy-app',
    clientSecret: 'peggy-secret',
    redirectUris: [
      'http://localhost:1234/oauth/callback',
      'http://localhost:8000/oauth/callback',
    ],
    scopes: {
      'user-email': 'Read your email',
      'user-avatar': 'Read your avatar',
    },
    grants: ['authorization_code'],
  },
  {
    id: 2,
    userId: 2,
    name: "Dwight's Sample App",
    clientId: 'dwight-app',
    clientSecret: 'dwight-secret',
    redirectUris: [
      'http://localhost:1234/oauth/callback',
      'http://localhost:8000/oauth/callback',
    ],
    scopes: ['user-email'],
    grants: ['authorization_code'],
  },
];

module.exports = {
  findAll: () => Promise.resolve(apps),

  findByUserId: async (userId) => {
    const app = apps.filter(a => a.userId === userId);
    return app;
  },

  findOneByClientId: async (clientId) => {
    const app = apps.find(a => a.clientId === clientId);
    if (!app) {
      throw new Error(`Invalid client id ${clientId}`);
    }
    return app;
  },

  findOne: async (clientId) => {
    const app = apps.find(a => a.clientId === clientId);
    if (!app) {
      throw new Error(`Invalid client id ${clientId}`);
    }
    return app;
  },
};
