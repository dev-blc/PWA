'use client'

import { appStore$ } from '@/app/stores/app.store'
import { getPageTransition } from '@/lib/utils/animations'
import { cn } from '@/lib/utils/tailwind'
import { use$ } from '@legendapp/state/react'
import { AnimatePresence, motion } from 'motion/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MainWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const isBottomBarVisible = Boolean(use$(appStore$.settings.bottomBarContent))
    const pathname = usePathname()
    const [currentPath, setCurrentPath] = useState(pathname)

    useEffect(() => {
        if (pathname !== currentPath) {
            setCurrentPath(pathname)
        }
    }, [pathname, currentPath])

    const handleDragEnd = (_event: unknown, info: { offset: { x: number } }) => {
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
                'relative mx-auto flex w-dvw max-w-screen-md flex-1 flex-col overflow-hidden px-safe-or-2',
                'pb-safe-offset',
                isBottomBarVisible ? 'mb-safe-or-24' : 'mb-safe',
            )}>
            <AnimatePresence mode='popLayout' initial={false}>
                <motion.div
                    key={currentPath}
                    className='flex flex-1 flex-col pt-safe'
                    layout
                    layoutId={pathname === '/profile' ? 'profile-page' : undefined}
                    drag={pathname === '/profile' ? 'x' : undefined}
                    dragConstraints={pathname === '/profile' ? { left: 0, right: 0 } : undefined}
                    dragElastic={0.2}
                    onDragEnd={pathname === '/profile' ? handleDragEnd : undefined}
                    variants={pageTransition.variants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition={pageTransition.transition}>
                    {children}
                </motion.div>
            </AnimatePresence>
        </main>
    )
}
