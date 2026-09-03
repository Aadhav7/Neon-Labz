const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://visbike098_db_user:69f7vuZnAtAYNkur@neon.agtudfw.mongodb.net/?authSource=admin";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully!");
  } catch (err) {
    console.dir(err);
  } finally {
    await client.close();
  }
}
run();
