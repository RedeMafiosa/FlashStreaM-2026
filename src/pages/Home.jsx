const db = globalThis.__B44_DB__ || {
  auth: {
    isAuthenticated: async () => false,
    me: async () => null,
    loginViaEmailPassword: async () => {
      throw new Error("DB não inicializada");
    },
    loginWithProvider: async () => {
      throw new Error("DB não inicializada");
    }
  },

  entities: new Proxy({}, {
    get: (_, entityName) => ({
      list: async () => {
        console.warn(`DB não inicializada: ${entityName}.list()`);
        return [];
      },

      filter: async () => {
        console.warn(`DB não inicializada: ${entityName}.filter()`);
        return [];
      },

      get: async () => {
        console.warn(`DB não inicializada: ${entityName}.get()`);
        return null;
      },

      create: async () => {
        console.warn(`DB não inicializada: ${entityName}.create()`);
        return null;
      },

      update: async () => {
        console.warn(`DB não inicializada: ${entityName}.update()`);
        return null;
      },

      delete: async () => {
        console.warn(`DB não inicializada: ${entityName}.delete()`);
        return null;
      }
    })
  }),

  integrations: {
    Core: {
      UploadFile: async () => {
        console.warn("DB não inicializada: UploadFile()");
        return { file_url: "" };
      }
    }
  }
};
