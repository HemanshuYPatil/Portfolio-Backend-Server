const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log('Connected to MongoDB:', client.db().databaseName);
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));


app.get('/api/work', async (req, res) => {
  console.log('Received request to /api/work');
  try {
    console.log('Fetching data from MongoDB...');

    const db = client.db(); 
    const collection = db.collection('work');

    const workData = await collection.find().toArray(); 

    console.log('Raw data from MongoDB:', workData);

    if (!workData || workData.length === 0) {
      console.log('No data found in the "work" collection');
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).json(workData);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`); 
});
