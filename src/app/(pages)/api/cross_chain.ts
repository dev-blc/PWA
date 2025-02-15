import 'server-only'

import type { NextApiRequest, NextApiResponse } from 'next'
import { API_paths, sendGetRequest } from '../profile/cross-swap/_components/utils'


      try {
        const { address } = req.query;
        const { path, call } = API_paths['history']

        const response = await sendGetRequest(path, { address: address  });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error("Error fetching OKX API:", error);
        res.status(500).json({ error: "Failed to fetch data" });
      }
}