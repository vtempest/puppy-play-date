'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface IntroModalProps {
  onGetStarted: () => void
}

export function IntroModal({ onGetStarted }: IntroModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="mx-4 max-w-sm space-y-6 rounded-3xl border-2 border-primary p-8">
        <div className="text-center">
          <div className="mb-4 text-5xl">🐾</div>
          <h1 className="text-3xl font-bold text-primary">Welcome to PawPal</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The app that helps your dog find their next best friend!
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              1
            </div>
            <div>
              <p className="font-semibold text-foreground">Match by breed & play style</p>
              <p className="text-xs text-muted-foreground">Find compatible pups nearby</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              2
            </div>
            <div>
              <p className="font-semibold text-foreground">Discover & connect</p>
              <p className="text-xs text-muted-foreground">Chat and schedule safe playdates</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              3
            </div>
            <div>
              <p className="font-semibold text-foreground">Build your community</p>
              <p className="text-xs text-muted-foreground">Join meetups and events</p>
            </div>
          </div>
        </div>

        <Button
          onClick={onGetStarted}
          size="lg"
          className="w-full rounded-full bg-primary py-6 text-white hover:bg-primary/90"
        >
          Get Started
        </Button>
      </Card>
    </div>
  )
}
