"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JobApplications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.JobApplications.belongsTo(models.Applicants, {
        foreignKey: "applicantId",
      });
      models.JobApplications.belongsTo(models.Jobs, {
        foreignKey: "jobId",
      });
    }
  }
  JobApplications.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      applicantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Applicants", key: "id" },
      },
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Jobs", key: "id" },
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          "onreview",
          "selected",
          "interview",
          "test",
          "offering",
          "recruited",
          "rejected",
        ],
        defaultValue: "onreview",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "JobApplications",
    }
  );
  return JobApplications;
};
