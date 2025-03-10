'use client'

import Divider from '@/app/_components/divider'
import { Button } from '@/app/_components/ui/button'
import { Drawer } from '@/app/_components/ui/drawer'
// import { OnrampWithStripe } from '@/app/(pages)/profile/_components/onramps/onramp-stripe'
import { currentTokenAddress } from '@/app/_server/blockchain/server-config'
import type { MoonpayCurrencyCode, MoonpayPaymentMethod } from '@privy-io/react-auth'
import { useFundWallet, useWallets } from '@privy-io/react-auth'
import { useAccount, useBalance } from 'wagmi'

interface OnRampDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    amount?: string
}

const OnRampDialog = ({ open, setOpen, amount }: OnRampDialogProps) => {
    const { address } = useAccount()
    const { data: balance } = useBalance({
        token: currentTokenAddress,
        address,
        query: {
            enabled: Boolean(address),
            refetchInterval: 10_000, // 10 seconds
        },
    })

    const formattedBalance = Number(balance?.value) / Math.pow(10, Number(balance?.decimals))
    // const [open, setOpen] = useState(false)
    // const isDesktop = useMediaQuery('(min-width: 768px)')

    // if (isDesktop) {
    //     return (
    //         <Dialog open={open} onOpenChange={setOpen}>
    //             <Dialog.Trigger asChild></Dialog.Trigger>
    //             <Dialog.Content className='bg-white sm:max-w-[425px]'>
    //                 <Dialog.Header>
    //                     <Dialog.Title>You need to add USDC in order to register for this event.</Dialog.Title>
    //                     <div></div>
    //                 </Dialog.Header>
    //                 <OnRampForm />
    //             </Dialog.Content>
    //         </Dialog>
    //     )
    // }

    const { wallets } = useWallets()
    const { fundWallet } = useFundWallet()
    const fundWithMoonpay = () => {
        const fundWalletConfig = {
            currencyCode: 'USDC_BASE' as MoonpayCurrencyCode, // Purchase ETH on Ethereum mainnet
            quoteCurrencyAmount: Number(amount ?? 10), // Purchase 0.05 ETH
            paymentMethod: 'credit_debit_card' as MoonpayPaymentMethod, // Purchase with credit or debit card
            uiConfig: { accentColor: '#696FFD' }, // Styling preferences for MoonPay's UIs
        }
        fundWallet(wallets[0].address, { config: fundWalletConfig }).catch(error => {
            console.log('fundWallet Error', error)
        })
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild />
            <Drawer.Content className='bg-white'>
                <Drawer.Header className='text-left'>
                    <Drawer.Title className='mb-6 text-xl'>
                        You need to add USDC in order to register for this event.
                    </Drawer.Title>
                    <div>
                        <div className='flex flex-row justify-between text-sm'>
                            <span className='font-medium'>Your current balance:</span>
                            <span className='font-medium'>
                                ${formattedBalance} {balance?.symbol}
                            </span>
                        </div>
                        <Divider className='my-0 h-0 py-0' />
                    </div>

                    <div className='flex w-full flex-col'>
                        {/* <div className='mb-6 flex w-full flex-row items-center justify-between'>
                            <div className='flex flex-col'>
                                <div className='font-semibold'>Buy with Unlimit</div>
                                <div className='text-sm text-gray-500'>
                                    Using cards, banks and international options
                                </div>
                            </div>
                            <Unlimit
                                amount={amount}
                                purchaseCurrency={'USDC-BASE'}
                                setOpen={setOpen}
                                className='h-10 w-20 rounded-[2rem] btn-cta text-center text-xs font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                                On Ramp
                            </Unlimit>
                        </div> */}

                        {/* <div className='mb-6 flex w-full flex-row items-center justify-between'>
                            <div className='flex flex-col'>
                                <div className='font-semibold'>Buy with Coinbase Pay</div>
                                <div className='text-sm text-gray-500'>
                                    Using cards, banks and international options
                                </div>
                            </div> */}
                        {/* <Button className='h-10 w-20 rounded-[2rem] btn-cta text-center text-xs font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                                Buy
                            </Button> */}
                        {/* <OnRampCoinbaseButton className='h-10 w-20 rounded-[2rem] btn-cta text-center text-xs font-semibold leading-normal text-white shadow-button active:shadow-button-push' /> */}
                        {/* </div> */}

                        {/* <div className='mb-6 flex w-full flex-row items-center justify-between'>
                            <div className='flex flex-col'>
                                <div className='font-semibold'>Buy with Stripe</div>
                                <div className='text-sm text-gray-500'>
                                    Using cards, banks and international options
                                </div>
                            </div>
                            <OnrampWithStripe />
                        </div> */}

                        <div className='mb-6 flex w-full flex-row items-center justify-between'>
                            <div className='flex flex-col'>
                                <div className='font-semibold'>Buy with Moonpay</div>
                                <div className='text-sm text-gray-500'>
                                    Using cards, banks and international options
                                </div>
                            </div>

                            <Button
                                onClick={fundWithMoonpay}
                                className='btn-cta h-10 w-20 rounded-[2rem] text-center text-xs font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                                On Ramp
                            </Button>
                        </div>

                        {/* <div className='mb-6 flex w-full flex-row items-center justify-between'>
                            <div className='flex flex-col'>
                                <div className='font-semibold'>External Wallet</div>
                                <div className='text-sm text-gray-500'>Receive from Coinbase, Rainbow or Metamask</div>
                            </div> */}
                        {/* <Button className='h-10 w-20 rounded-[2rem] btn-cta text-center text-xs font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                                Receive
                            </Button> */}
                        {/* <OnRampForm decimalPlaces={BigInt(18)} balance={BigInt(100)} /> */}
                        {/* <ReceiveDialog />
                        </div> */}
                    </div>
                </Drawer.Header>
            </Drawer.Content>
        </Drawer>
    )
}

export default OnRampDialog
