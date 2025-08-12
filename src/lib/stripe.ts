'use server'

import {auth} from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY!, {
  apiVersion:"2025-07-30.basil", // replace with correct one from your Stripe dashboard
})


export async function createCheckoutSession(credits:number){
    const {userId}= await auth()
    if(!userId){
        throw new Error('Unauthorized')
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:[
            {
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:`${credits} Pushlab credits`
                    },
                    unit_amount:Math.round((credits/50)*100)
                },
                quantity:1
            }
        ],
        customer_creation:'always',
        mode:'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL?.trim()}/create`,
cancel_url: `${process.env.NEXT_PUBLIC_APP_URL?.trim()}/billing`,

        client_reference_id:userId.toString(),
        metadata:{
            credits
        }

    })


    return redirect(session.url!)
}