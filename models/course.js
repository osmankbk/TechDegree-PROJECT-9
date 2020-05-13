const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model{};
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER
        },
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {sequelize});
    Course.associate = (models) => {
        Course.belongsTo(models.User);
    }
    return Course;
}