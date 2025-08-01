import { Client, Account, Databases } from "appwrite";

export const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("68718bd1000edda8e81a"); // Your project ID

export const account = new Account(client);

export const databases = new Databases(client);
