'use client'

import { Avatar, AvatarImage } from '@/app/_components/ui/avatar'
import { useUserInfo } from '@/hooks/use-user-info'
import { Loader2, User } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'

export default function UserAvatar() {
    const { data: userInfo, isLoading } = useUserInfo()

    return (
        <Avatar className='relative size-8 cursor-pointer overflow-hidden' aria-label='Go to Profile' asChild>
            <Link href='/profile' prefetch>
                <AnimatePresence mode='wait'>
                    {isLoading ? (
                        <motion.div
                            key='loading'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                type: 'spring',
                                bounce: 0.2,
                                duration: 0.2,
                            }}
                            className='absolute inset-0 flex items-center justify-center bg-neutral-200'>
                            <Loader2 className='animate-spin text-blue-500' />
                        </motion.div>
                    ) : userInfo?.avatar ? (
                        <motion.div
                            key='image'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                                type: 'spring',
                                bounce: 0.2,
                                duration: 0.3,
                            }}
                            className='absolute inset-0'>
                            <AvatarImage
                                alt='user avatar'
                                src={userInfo.avatar}
                                fetchPriority='high'
                                className='object-cover'
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key='fallback'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                                type: 'spring',
                                bounce: 0.2,
                                duration: 0.3,
                            }}
                            className='absolute inset-0 flex items-center justify-center bg-neutral-100'>
                            <User className='text-blue-500' />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Link>
        </Avatar>
    )
}
