function preload() {
    // Load the JSON data from the server
    loadJSON('http://localhost:5000/api/data', (data) => {
      // Organize the data into the required structure
      data.bands.forEach(band => {
        bands[band.name] = {
          band: {
            members: band.members,
          },
        };
      });
  
      data.musicians.forEach(musician => {
        musicians[musician.name] = {
          musician: {
            bands: musician.bands,
          },
        };
      });
  
      // Call setup after data is loaded
      initializeBands();
  
    });
  }

  





