import {
  OAuthAuthCode,
  OAuthClient,
  OAuthScope,
  OAuthToken,
  OAuthUser,
} from "@jmondi/oauth2-server";

import { users } from "./models/user";
import { apps } from "./models/app";

export interface InMemory {
  users: { [id: string]: OAuthUser };
  clients: { [id: string]: OAuthClient };
  authCodes: { [id: string]: OAuthAuthCode };
  tokens: { [id: string]: OAuthToken };
  scopes: { [id: string]: OAuthScope };

  flush(): void;
}

export const inMemoryDatabase: InMemory = {
  clients: {
    // @ts-ignore
    "peggy-app": apps[0],
  },
  authCodes: {},
  tokens: {},
  scopes: {
    "user-email": { name: "user-email" },
  },
  users: {
    "uuid-0001": users[0],
    "uuid-0002": users[1],
  },
  flush() {
    this.clients = {};
    this.authCodes = {};
    this.tokens = {};
    this.scopes = {};
    this.users = {};
  },
};
