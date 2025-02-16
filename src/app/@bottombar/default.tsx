'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../_client/providers/app-store.provider'

export default function BottomBar() {
    const content = useAppStore(s => s.bottomBarContent)

    if (!content) return null

    return (
        <AnimatePresence presenceAffectsLayout>
            <motion.footer
                initial={{ opacity: 0.7, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.7, y: 100 }}
                transition={{
                    duration: 0.2,
                    ease: 'easeInOut',
                }}
                className='fixed bottom-0 left-0 z-30 w-full'>
                <nav className='flex-center px-safe-or-4 mx-auto h-24 max-w-screen-md rounded-t-3xl bg-neutral-100/50 pb-3 shadow-sm shadow-black/25 backdrop-blur-[32.10px]'>
                    {content}
                </nav>
            </motion.footer>
        </AnimatePresence>
    )
}
