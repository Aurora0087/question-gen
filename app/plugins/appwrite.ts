import { Client, Account } from 'appwrite'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    const client = new Client();

    client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('6762d83a000a5a57e98c');

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