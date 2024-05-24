import { createClient } from '@supabase/supabase-js'
import { decode } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Parse the request body
	const requestData = await req.body
	const { poolId, walletAddress, jwtString } = requestData

	const walletAddressLower = walletAddress.toLowerCase()

	// Return a response
	const supabaseAdminClient = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_KEY!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		},
	)

	const supabaseRow = {
		participant_address: walletAddressLower,
		status: 0,
		pool_id: poolId,
		// Add other columns as needed
	}

	try {
		const jwtObj = decode(jwtString, { json: true })
		const jwtAddress = jwtObj!.address
		if (jwtAddress.toLowerCase() != walletAddress.toLowerCase()) {
			res.status(401).json({ error: 'Invalid Permissons' })
			return
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to decode Jwt.' })
		throw new Error(`Failed to decode Jwt: ${JSON.stringify(error)}`)
	}

	async function upsertData() {
		const { data: existingData } = await supabaseAdminClient
			.from('participantStatus')
			.select('*')
			.match({
				pool_id: supabaseRow.pool_id,
				participant_address: supabaseRow.participant_address,
			})

		if (existingData?.length === 0) {
			// Insert a new row
			const { error: insertError } = await supabaseAdminClient
				.from('participantStatus')
				.insert([supabaseRow])

			if (insertError) {
				throw new Error('Error inserting data')
			}
			res.status(500).json({ message: 'Success' })

			return
		} else {
			// Update the existing row
			const { error: updateError } = await supabaseAdminClient
				.from('participantStatus')
				.update({ status: supabaseRow.status })
				.match({
					pool_id: supabaseRow.pool_id,
					participant_address: supabaseRow.participant_address,
				})

			if (updateError) {
				res.status(500).json({ message: 'Error upating data' })
				throw new Error('Error upating data')
			}
		}

		// Update the participant count
		const { data: participantCount, error: participantCountError } =
			await supabaseAdminClient
				.from('pool') // replace with your table name
				.select('participant_count')
				.eq('pool_id', poolId)

		if (participantCountError) {
			res.status(500).json({ error: 'Internal Server Error' })
			throw new Error('Error getting participant count')
		}

		const count = participantCount?.[0].participant_count ?? 0
		const { error: updateParticipantCountError } = await supabaseAdminClient
			.from('pool') // replace with your table name
			.update({ participant_count: count - 1 })
			.match({
				pool_id: poolId,
			})
		if (updateParticipantCountError) {
			res.status(500).json({ error: 'Internal Server Error' })
			throw new Error('Error updating participant count')
		}
	}

	await upsertData()
	res.status(200).json({ message: 'Success' })
}
