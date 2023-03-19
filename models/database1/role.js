'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            // define association here
            this.hasMany(models.UserRole, {
                foreignKey: 'role_id',
                as: 'role_assigned_to_user',
                onDelete: 'RESTRICT',
            })
        }
    }
    Role.init(
        {
            role_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            role_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Role should not be null.' },
                    notEmpty: { msg: 'Role should not be empty.' },
                },
            },
            role_description: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Role Description should not be null.' },
                    notEmpty: { msg: 'Role Description should not be empty.' },
                },
            },
            role_for: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Student', 'PUP Staff', 'Both']],
                        msg: 'role_for should be Student, PUP Staff, and Both only.',
                    },
                },
            },
            role_status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Active', 'Inactive', 'Deleted']],
                        msg: 'role_status should be "Active", "Inactive", and "Deleted" only.',
                    },
                },
                defaultValue: 'Active',
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'Role',
            freezeTableName: true,
        }
    )
    return Role
}
