import { Client, Account } from 'appwrite'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {

    const config = useRuntimeConfig();

    const ENDPOINT = String(config.public.appwrite.endPoint || "");
    const PROJECTID = String(config.public.appwrite.projectId || "");

    const client = new Client();

    client
        .setEndpoint(ENDPOINT)
        .setProject(PROJECTID);

    const account = new Account(client);

    return {
        provide: {
            appwrite: {
                client,
                account
            }
        }
    }
})