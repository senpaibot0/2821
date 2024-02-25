const { getConnection, sql } = require('./SQLServerDB/db.js');

const animauxMarins = [
    "Baleine bleue",
    "Dauphin",
    "Tortue de mer",
    "Grand requin blanc",
    "Baleine à bosse",
    "Orque",
    "Phoque éléphant",
    "Requin tigre",
    "Manchot empereur",
    "Cachalot"
  ];
  
const oceans = [
    "Océan Pacifique",
    "Océan Atlantique",
    "Océan Indien",
    "Océan Arctique",
    "Océan Austral"
  ];

const espece = [
    "Balaenoptera musculus", // Baleine bleue
    "Delphinus delphis", // Dauphin
    "Chelonia mydas", // Tortue de mer (Tortue verte)
    "Carcharodon carcharias", // Grand requin blanc
    "Megaptera novaeangliae", // Baleine à bosse
    "Orcinus orca", // Orque
    "Mirounga leonina", // Phoque éléphant
    "Galeocerdo cuvier", // Requin tigre
    "Aptenodytes forsteri", // Manchot empereur
    "Physeter macrocephalus" // Cachalot
  ];



function generateLongitude(index) {
    return Math.cos(index / 10) * 180;
}

function generateLatitude(index) {
    return Math.sin(index / 10) * 90;
}

async function generateData(nombre_de_Coordonnes) {
  const pool = await getConnection();
  
  for (let i = 0; i < nombre_de_Coordonnes; i++) {
      const animalIndex = Math.floor(Math.random() * animauxMarins.length);
      const animal = animauxMarins[animalIndex];
      const especeAnimal = espece[animalIndex];
      const ocean = oceans[Math.floor(Math.random() * oceans.length)];
      const latitude = generateLatitude(i);
      const longitude = generateLongitude(i);
      
      // Insertion dans Animaux
      const insertAnimalQuery = `INSERT INTO Animaux (AnimalName, Espece) VALUES 
      (@animal, @especeAnimal); SELECT SCOPE_IDENTITY() AS Id;`;
      const animalResult = await pool.request()
          .input('animal', sql.VarChar, animal)
          .input('especeAnimal', sql.VarChar, especeAnimal)
          .query(insertAnimalQuery);
      const animalId = animalResult.recordset[0].Id;

      // Insertion dans Locations
      const insertLocationQuery = `INSERT INTO Locations (Ocean, Latitude, Longitude) 
      VALUES (@ocean, @latitude, @longitude); SELECT SCOPE_IDENTITY() AS IdLocation;`;
      const locationResult = await pool.request()
          .input('ocean', sql.VarChar, ocean)
          .input('latitude', sql.Float, latitude)
          .input('longitude', sql.Float, longitude)
          .query(insertLocationQuery);
      const locationId = locationResult.recordset[0].IdLocation;

      // Insertion dans AnimalLocation
      const insertAnimalLocationQuery = `INSERT INTO AnimalLocation (IdAnimal, IdLocation, DateRegistrement, TempsRegistements) 
      VALUES (@animalId, @locationId, GETDATE(), CONVERT(time, GETDATE()));`;
      await pool.request()
          .input('animalId', sql.Int, animalId)
          .input('locationId', sql.Int, locationId)
          .query(insertAnimalLocationQuery);
  }
}

generateData(10).then(() => console.log('Data generation and insertion complete.'))
.catch(err => console.error(err));

