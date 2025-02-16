'use client'

import { appActions, appStore$ } from '@/app/stores/app.store'
import { getPageTransition } from '@/lib/utils/animations'
import { cn } from '@/lib/utils/tailwind'
import { use$ } from '@legendapp/state/react'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useContext, useEffect, useRef, useState } from 'react'

function FrozenRouter(props: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext ?? {})
    const frozen = useRef(context).current

    return <LayoutRouterContext.Provider value={frozen}>{props.children}</LayoutRouterContext.Provider>
}

// We wrap the component with dynamic to ensure it only renders on the client
const ClientFrozenRouter = dynamic(() => Promise.resolve(FrozenRouter), {
    ssr: false,
})

export default function MainWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const isBottomBarVisible = Boolean(use$(appStore$.settings.bottomBarContent))
    const isRouting = use$(appStore$.settings.isRouting)
    const pathname = usePathname()
    const [currentPath, setCurrentPath] = useState(pathname)
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        if (pathname !== currentPath && !isRouting && !isTransitioning) {
            appActions.setIsRouting(true)
            setCurrentPath(pathname)
        }
    }, [pathname, currentPath, isRouting, isTransitioning])

    const handleDragEnd = (_event: any, info: any) => {
        if (info.offset.x > 100) {
            router.back()
        } else if (info.offset.x < -100) {
            router.forward()
        }
    }

    const pageTransition = getPageTransition(pathname)

    return (
        <main
            className={cn(
                'px-safe-or-2 relative mx-auto flex w-dvw max-w-screen-md flex-1 flex-col overflow-hidden',
                'pb-safe-offset',
                isBottomBarVisible ? 'mb-safe-or-24' : 'mb-safe',
            )}>
            <AnimatePresence
                mode='popLayout'
                initial={false}
                onExitComplete={() => {
                    appActions.setIsRouting(false)
                    setIsTransitioning(false)
                }}>
                <motion.div
                    key={currentPath}
                    className='pt-safe flex flex-1 flex-col'
                    drag={pathname === '/profile' ? 'x' : undefined}
                    dragConstraints={pathname === '/profile' ? { left: 0, right: 0 } : undefined}
                    dragElastic={0.2}
                    onDragEnd={pathname === '/profile' ? handleDragEnd : undefined}
                    onAnimationStart={() => setIsTransitioning(true)}
                    variants={pageTransition.variants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition={pageTransition.transition}>
                    <ClientFrozenRouter>{children}</ClientFrozenRouter>
                </motion.div>
            </AnimatePresence>
        </main>
    )
}
