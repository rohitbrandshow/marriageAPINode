// controller/atlasSearchController.js
const axios = require('axios');

const createAtlasSearchIndex = async () => {
  try {
    const projectId = '65097a8d7f27624c6c19bbc0';
    // Step 1: Get the cluster name
    const clusterNameEndpoint = `clusters`;
    const clusterEndpoint = `groups/${projectId}/${clusterNameEndpoint}`;

    const clusterResponse = await axios.get(`https://cloud.mongodb.com/api/atlas/v1.0/${clusterEndpoint}`, {
      auth: {
        username: 'vercel-admin-user',
        password: 'Fieindia2023',
      },
    });

    const clusterName = clusterResponse.data.results[0].name;

    // Step 2: Create the Atlas Search index (Use POST request)
    const createIndexEndpoint = `groups/${projectId}/${clusterNameEndpoint}/${clusterName}/fts/indexes`;

    const indexResponse = await axios.post(`https://cloud.mongodb.com/api/atlas/v1.0/${createIndexEndpoint}`, {
      collectionName: "users",
      database: "matrimonial_app",
      mappings: {
        dynamic: true,
      },
      name: "default",
    }, {
      auth: {
        username: 'vercel-admin-user',
        password: 'Fieindia2023',
      },
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        pretty: true,
      },
    });

    console.log("Atlas Search index created successfully:", indexResponse.data);
  } catch (error) {
    console.error("Error creating Atlas Search index:", error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { createAtlasSearchIndex };
