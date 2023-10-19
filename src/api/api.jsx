  import { Client as Appwrite, Databases, Account, Client, Storage} from "appwrite";

  let api = {
    sdk: null,

    provider: () => {
      if (api.sdk) {
        return api.sdk;
      }
      let appwrite = new Appwrite();
      appwrite.setEndpoint(process.env.REACT_APP_ENDPOINT).setProject(process.env.REACT_APP_PROJECT);
      const account = new Account(appwrite);
      const database = new Databases(appwrite);
      const client = new Client(appwrite);
      const storage = new Storage(appwrite);
      api.sdk = { database, account, client, storage};
      return api.sdk;
    },
    
    createAccount: (email, password, name) => {
      return api.provider().account.create("unique()", email, password, name);
    },

    updateAccountName: (name) => {
      return api.provider().account.updateName(name)
    },

    updateAccountPassword: (password, oldPassword) => {
      return api.provider().account.updatePassword(password, oldPassword)
    },

    updateAccountEmail: (email, password) => {
      return api.provider().account.updateEmail(email, password)
    },

    getAccount: () => {
      let account = api.provider().account;
      return account.get();
    },

    createSession: (email, password) => {
      return api.provider().account.createEmailSession(email, password);
    },

    deleteCurrentSession: () => {
      return api.provider().account.deleteSession("current");
    },

    createDocument: (databaseId, collectionId, data, permissions) => {
      return api
        .provider()
        .database.createDocument(databaseId, collectionId, 'unique()', data, permissions);
    },

    listDocuments: (databaseId, collectionId,query) => {
      return api.provider().database.listDocuments(databaseId, collectionId, query);
    },

    updateDocument: (databaseId, collectionId, documentId, data) => {
      return api.provider().database.updateDocument(databaseId, collectionId, documentId, data);
    },

    deleteDocument: (databaseId, collectionId, documentId) => {
      return api.provider().database.deleteDocument(databaseId, collectionId, documentId);
    },

    createImage: (ID, file) => {
      return api.provider().storage.createFile(process.env.REACT_APP_PROFILE_IMAGE, ID, file[0])
    }
  };

  export default api;