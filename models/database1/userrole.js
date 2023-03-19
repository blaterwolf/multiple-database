'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class UserRole extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_role',
                onDelete: 'RESTRICT',
            })

            this.belongsTo(models.Role, {
                foreignKey: 'role_id',
                as: 'role_assigned_to_user',
                onDelete: 'RESTRICT',
            })
        }
    }
    UserRole.init(
        {
            user_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            role_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'UserRole',
            freezeTableName: true,
        }
    )
    return UserRole
}
