const MongoClient = require('mongodb').MongoClient; // Import the MongoDB client
const assert = require('assert');

// Connection URL for your MongoDB Atlas cluster
const uri = 'mongodb+srv://vercel-admin-user:Fieindia2023@cluster0.mongodb.net/matrimonial_app?retryWrites=true&w=majority';

// Define your controller function
async function returnOppositeGender(req, res) {
  try {
    const gender = req.gender; // Get the search query parameter

    // Connect to MongoDB Atlas
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
      assert.equal(null, err);

      const matrimonialAppDb = client.db('matrimonial_app'); // Access your database
      const usersCollection = matrimonialAppDb.collection('users'); // Access your collection

      // Define the search query
      const searchQuery = {
        $text: {
          $search: gender, // Use the 'gender' parameter as the search query
        },
      };

      // Execute the search query
      usersCollection.find(searchQuery).toArray((error, searchResults) => {
        if (error) {
          // Handle any errors
          res.status(500).json({ error: error.message });
        } else {
          // Send the search results as a response
          res.json(searchResults);
        }

        client.close(); // Close the MongoDB connection
      });
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  returnOppositeGender,
};
