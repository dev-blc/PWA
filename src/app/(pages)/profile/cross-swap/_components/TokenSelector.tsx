import { Input } from '@/app/_components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/_components/ui/sheet'
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import type { OKXNetwork, OKXToken } from '../types'
import { useSheetDrag } from './hooks/useSheetDrag'

export interface TokenSelectorProps {
    isOpen: boolean
    onClose: () => void
    filteredTokens: OKXToken[]
    selectedNetwork: string
    searchQuery: string
    onSearchChange: (value: string) => void
    onNetworkSelect: (network: string) => void
    onTokenSelect: (token: OKXToken) => void
    networks: OKXNetwork[]
}

export const TokenSelector = ({
    isOpen,
    onClose,
    filteredTokens,
    selectedNetwork,
    searchQuery,
    onSearchChange,
    onNetworkSelect,
    onTokenSelect,
    networks,
}: TokenSelectorProps) => {
    const { sheetRef, handleDragStart, handleDrag, handleDragEnd } = useSheetDrag(onClose)

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent ref={sheetRef} side='bottom' className='h-[85vh] touch-none rounded-t-[24px] p-4'>
                <div
                    className='absolute left-1/2 top-2.5 h-1.5 w-12 -translate-x-1/2 cursor-grab touch-none rounded-full bg-gray-300 active:cursor-grabbing'
                    onPointerDown={handleDragStart}
                    onPointerMove={handleDrag}
                    onPointerUp={handleDragEnd}
                    onPointerCancel={handleDragEnd}
                    role='button'
                    aria-label='Drag to close'
                />

                <SheetHeader className='flex flex-row items-center justify-between pt-4'>
                    <SheetTitle className='text-[18px] font-bold'>Select Token</SheetTitle>
                    <button onClick={onClose} className='absolute right-6 top-4 text-gray-500 hover:text-gray-700'>
                        <X className='size-6' />
                    </button>
                </SheetHeader>

                {/* Search input */}
                <div className='mt-6'>
                    <div className='relative flex h-[42px] items-center'>
                        <Search className='absolute left-3 z-10 size-5 text-gray-400' />
                        <Input
                            placeholder='Search'
                            className='h-[42px] w-full rounded-full border-gray-200 pl-10'
                            value={searchQuery}
                            onChange={e => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Network selection */}
                <div className='mt-4'>
                    <div className='flex flex-wrap gap-2'>
                        <button
                            onClick={() => onNetworkSelect('all')}
                            className={`rounded-full px-4 py-2 text-sm ${
                                selectedNetwork === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                            All Networks
                        </button>
                        {networks.map(network => (
                            <button
                                key={network.chainId}
                                onClick={() => onNetworkSelect(network.chainId)}
                                className={`rounded-full px-4 py-2 text-sm ${
                                    selectedNetwork === network.chainId
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                {network.chainName}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Token list */}
                <div className='scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-6 space-y-2 overflow-y-scroll'>
                    {filteredTokens.map(token => (
                        <button
                            key={token.tokenContractAddress}
                            onClick={() => onTokenSelect(token)}
                            className='flex w-full items-center justify-between rounded-xl p-3 hover:bg-gray-50'>
                            <div className='flex items-center gap-3'>
                                <div className='size-8 overflow-hidden rounded-full'>
                                    <Image
                                        src={token.tokenLogoUrl || '/placeholder.svg'}
                                        alt={token.tokenSymbol}
                                        width={32}
                                        height={32}
                                        className='size-full object-cover'
                                    />
                                </div>
                                <div className='flex flex-col items-start'>
                                    <span className='font-medium'>{token.tokenSymbol}</span>
                                    <span className='text-sm text-gray-500'>{token.tokenName}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}
