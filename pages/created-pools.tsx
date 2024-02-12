import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import Page from '@/components/page'
import Section from '@/components/section'
import Appbar from '@/components/appbar'

import poolWalletImage from '@/public/images/pool_wallet.png'

import {
	TransactionReceipt,
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'

import { useReadContract, createConfig, http } from 'wagmi'
import { readContract, readContracts } from '@wagmi/core'
import { foundry, hardhat, mainnet, sepolia } from 'viem/chains'
import { Interface, ethers } from 'ethers'

import {
	localChain,
	localnetTokenAddress,
	localnetContractAddress,
} from 'constants/constant'
import { config } from '@/constants/config'

import poolContract from '@/Smart-Contracts/out/Pool.sol/Pool.json'

const CreatedPools = () => {
	const router = useRouter()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()
	let walletAddress = ''

	const [poolsData, setPoolsData] = useState([])

	// Replace this with the message you'd like your user to sign
	// Replace this with the text you'd like on your signature modal,
	// if you do not have `noPromptsOnSignature` enabled

	const getCreatedPoolsData = async () => {
		const abi = new Interface(poolContract.abi)
		const provider = new ethers.JsonRpcProvider()
		const contract = new ethers.Contract(
			localnetContractAddress,
			poolContract.abi,
			provider,
		)
		const poolIds = await contract.getPoolsCreated(walletAddress)
		for (const poolId of poolIds) {
			let newPoolData = await contract.getPoolInfo(poolId)
			// newPoolData.push(poolId)
			let amendNewPoolData = [...newPoolData, poolId]
			console.log(`result: ${amendNewPoolData}`)
			setPoolsData((prevData) => [...prevData, amendNewPoolData])
		}
		// const result = await contract.getPoolIdByName('Hi')
	}

	useEffect(() => {
		// Update the document title using the browser API
		if (ready && authenticated) {
			walletAddress = user!.wallet!.address
			console.log(`Wallet Address ${walletAddress}`)
			getCreatedPoolsData()
		}

		if (ready && !authenticated) {
			// Replace this code with however you'd like to handle an unauthenticated user
			// As an example, you might redirect them to a sign-in page
			router.push('/')
		}
	}, [ready, authenticated])

	const handleClick = (poolId) => {
		router.push(`/pool-id/${poolId}`)
	}

	return (
		<Page>
			<Appbar />

			<Section>
				<div className='flex flex-col pt-16 h-full w-full items-center'>
					{poolsData.map((item, index) => (
						<div
							key={index}
							className=' rounded  w-full h-44 shadow-sm'
							onClick={() => {
								handleClick(item[10])
							}}
						>
							<div className=' w-full h-full p-4'>
								<div>{item[0]}</div>
								<div>{item[1]}</div>
								<div>{item[2]}</div>
								<div>{item[3]}</div>
								<div>{item[4]}</div>
								<div>{item[5]}</div>
								<div>{item[6]}</div>
								<div>{item[7]}</div>
								<div>{item[8]}</div>
								<div>{item[9]}</div>
							</div>
						</div>
					))}
				</div>
			</Section>
		</Page>
	)
}

export default CreatedPools
