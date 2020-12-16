"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a value for 'title'",
          },
          notEmpty: {
            msg: "Please provide a value for 'title'",
          },
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a value for 'author'",
          },
          notEmpty: {
            msg: "Please provide a value for 'author'",
          },
        },
      },
      genre: DataTypes.STRING,
      // year: DataTypes.STRING,
      // add a validator to check character length is 4
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a value for 'year'",
          },
          notEmpty: {
            msg: "Please provide a value for 'year'",
          },
          len: [4, 4],
        },
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
