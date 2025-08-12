'use client'

import { Info } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { createCheckoutSession } from '~/lib/stripe'
import { api } from '~/trpc/react'
// Import the Slider (assuming from ShadCN UI or Radix)
import { Slider } from '~/components/ui/slider'

const BillingPage = () => {
  const { data: user } = api.project.getMycredits.useQuery()

  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100])

  const creditsToBuyAmount = creditsToBuy[0] || 0
  const price = (creditsToBuyAmount / 50).toFixed(2)

  return (
    <div className="text-xl font-semibold">
      <div className="h-2"></div>

      <p className="text-sm text-gray-500">
        You currently have {user?.credits ?? 0} credits.
      </p>

      <div className="h-2"></div>

      <div className="bg-blue-50 px-4 py-2 rounded-md border border-blue-200 text-blue-700">
        <div className="flex items-center gap-2">
          <Info className="size-4" />
          <p className="text-sm">
            Each credit allows you to index 1 file in a repository.
          </p>
        </div>
        <p className="text-sm">
          E.g. If your project has 100 files, you will need 100 credits to index it.
        </p>
      </div>

      <div className="h-4"></div>

      <Slider
        defaultValue={[100]}
        max={1000}
        min={10}
        step={10}
        onValueChange={(value) => setCreditsToBuy(value)}
        value={creditsToBuy}
      />

      <div className="h-4"></div>

      <Button
        onClick={() => {
          if (creditsToBuyAmount > 0) {
            createCheckoutSession(creditsToBuyAmount)
          }
        }}
      >
        Buy {creditsToBuyAmount} credits for ${price}
      </Button>
    </div>
  )
}

export default BillingPage
