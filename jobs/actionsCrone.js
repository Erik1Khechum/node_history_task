import cron from "node-cron"
import { mongoose } from '../bin/www.js'
import axios from 'axios'

// MongoDB configuration
const dbName = "actions"
const collectionName = "action"

// API configuration
const apiUrl = "https://eos.greymass.com/v1/history/get_actions"
const requestBody = {
    account_name: "eosio",
    pos: -1,
    offset: -100
}

const fetchAndSaveActions = async () => {
    try {
        const db = mongoose.connection.useDb(dbName)
        const collection = db.collection(collectionName)

        // Fetch data from the API
        const response = await axios.post(apiUrl, requestBody)
        const actions = response.data.actions

        // Process each action
        for (const action of actions) {
            const {block_time,block_num} = action
            const {trx_id} = action.action_trace

            // Check if the document already exists
            const existingAction = await collection.findOne({trx_id})
            if (!existingAction) {
                // Insert new document
                await collection.insertOne({
                    trx_id,
                    block_time,
                    block_num
                })
                console.log(`Inserted action with trx_id: ${trx_id}`)
            }
        }
    } catch (error) {
        console.error("Error fetching and saving actions:", error)
    }
}
cron.schedule('* * * * *', fetchAndSaveActions)
