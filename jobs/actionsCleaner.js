import cron from "node-cron"
import { mongoose } from "../bin/www.js"
// MongoDB configuration
const dbName = "actions"
const collectionName = "action"

// Function to delete all documents from the collection
const deleteAllActions = async () => {
    try {
        // Use the database and collection from mongoose
        const db = mongoose.connection.useDb(dbName)
        const collection = db.collection(collectionName)

        // Delete all documents
        const result = await collection.deleteMany({})
        console.log(`Deleted ${result.deletedCount} documents.`)   
    } catch (error) {
        console.error("Error deleting documents:", error)
    }
}
cron.schedule("5 * * * *", deleteAllActions)