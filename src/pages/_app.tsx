import { AppType } from 'next/app'

import { api } from '~/utils/api'

import '~/styles/globals.css'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { CommandPalette } from '~/components/palette'
import { Toaster } from '~/components/ui/toaster'
import { db } from '~/server/api/db/client'
import { users } from '~/server/api/db/schema'
import { eq } from 'drizzle-orm'

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter()
  const createUser = api.auth.register.useMutation()

  return (
    <DynamicContextProvider
      settings={{
        environmentId: '623758f3-78a6-43fc-9261-9478b74f1d19',
        walletConnectors: [SolanaWalletConnectors],
        appName: 'Rift',
        shadowDOMEnabled: false,
        eventsCallbacks: {
          onAuthSuccess: (args) => {
            void (async () => {
              const dbUser = await db
                .select()
                .from(users)
                .where(eq(users.email, args.user.email!))
                .execute()

              if (dbUser.length === 0) {
                createUser.mutate({
                  email: args.user.email!,
                })
                void router.push('/onboard')
              } else if (!dbUser[0]?.onboarded) {
                void router.push('/onboard')
              } else {
                void router.push('/creator')
              }
            })()
          },
        },
      }}
    >
      <Head>
        <title>Rift - Read. Write. Own.</title>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='194x194'
          href='/favicon-194x194.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='192x192'
          href='/android-chrome-192x192.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#000000' />
        <meta name='msapplication-TileColor' content='#000000' />
        <meta name='msapplication-TileImage' content='/mstile-144x144.png' />
        <meta name='theme-color' content='#000000' />
      </Head>
      <CommandPalette />
      <Toaster />
      <Component {...pageProps} />
    </DynamicContextProvider>
  )
}

export default api.withTRPC(MyApp)
