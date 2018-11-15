module.exports = function(sequelize, DataTypes) {
  var Listings = sequelize.define("Listings", {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    listingName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Listings;
};