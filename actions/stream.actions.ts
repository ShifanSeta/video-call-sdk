"use server"
import { StreamClient } from '@stream-io/node-sdk';

import { currentUser } from "@clerk/nextjs/server";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET_KEY

export const tokenProvider = async() => {
    const user = await currentUser();
    if(!user) throw new Error('User is not authenticated');
    if(!apiKey) throw new Error('no Api key');
    if(!apiSecret) throw new Error('no Api secret');

    const client = new StreamClient(apiKey, apiSecret)

    const exp = Math.round(new Date().getTime() / 1000) +60*60

    const Issued = Math.floor(Date.now() / 1000) - 60

    const Token = client.createToken(user.id, exp, Issued);
    return Token;

    
}