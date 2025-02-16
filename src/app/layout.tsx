import { inter } from '@/lib/utils/fonts'
import { headers } from 'next/headers'
import { Providers } from './_client/providers'
import MainWrapper from './_components/main-wrapper'
import './global.css'
// import InstallPromptDrawer from '@/components/install-prompt-drawer'

export { metadata, viewport } from './_lib/utils/metadata'

export const fetchCache = 'default-cache'

type Props = React.PropsWithChildren<LayoutWithSlots<'topbar' | 'bottombar' | 'modal' | 'transactionprogressmodal'>>

export default async function RootLayout({ children, bottombar, modal, transactionprogressmodal }: Props) {
    const headersList = await headers()
    const wagmiCookie = headersList.get('cookie')

    return (
        <html lang='en' className={inter.variable}>
            <head>
                <link rel='preload' href='/_next/static/css/app/layout.css' as='style' crossOrigin='anonymous' />
            </head>
            <body className='flex min-h-dvh flex-col antialiased'>
                <Providers cookie={wagmiCookie}>
                    <MainWrapper>{children}</MainWrapper>
                    {modal}
                    {bottombar}
                    {transactionprogressmodal}
                    {/* <InstallPromptDrawer /> */}
                </Providers>
            </body>
        </html>
    )
}
