import {Client, Account, Databases} from "appwrite"

export const client = new Client();

client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!).setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)

export const account = new Account(client)

export {ID} from 'appwrite'

export const databases = new Databases(client)