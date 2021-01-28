module.exports = {
  plantValid,
};

function plantValid(plant) {
  return Boolean(
    plant.name && plant.water_frequency && typeof plant.name === "string",
  );
}
