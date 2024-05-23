const { MongoClient } = require('mongodb');

async function deleteOrder() {
    const uri = "mongodb://username:password@localhost:27017/?replicaSet=rs0";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db("yourDatabaseName");
        const collection = database.collection("orders");

        const query = { customerName: "Max Mustermann" };
        const result = await collection.deleteOne(query);
        console.log(`Deleted ${result.deletedCount} document.`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

deleteOrder();