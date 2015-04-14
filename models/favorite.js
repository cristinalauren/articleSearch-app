"use strict";
module.exports = function(sequelize, DataTypes) {
  var FavoriteArticle= sequelize.define("FavoriteArticle", {
    article: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.User);
        // associations can be defined here
      }
    }
  });
  return FavoriteArticle;
};