'use strict'
const { Model } = require('sequelize')

// Include all protected attributes
const PROTECTED_ATTRIBUTES = ['password']

module.exports = (sequelize, DataTypes) => {
    class UserProfile extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                as: 'user_profile',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
        }
        toJSON() {
            const attributes = { ...this.get() }
            for (const x of PROTECTED_ATTRIBUTES) {
                delete attributes[x]
            }
            return attributes
        }
    }
    UserProfile.init(
        {
            user_profile_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[users].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'First name should not be null.' },
                    notEmpty: { msg: 'First Name should not be empty.' },
                },
            },
            middle_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Last name should not be null.' },
                    notEmpty: { msg: 'Last Name should not be empty.' },
                },
            },
            extension_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            full_name: {
                type: DataTypes.STRING,
                set(value) {
                    if (this.middle_name == null && this.extension_name == null) {
                        // walang middle name at walang extension name
                        this.setDataValue('full_name', `${this.first_name} ${this.last_name}`)
                    } else if (this.middle_name == null && this.extension_name != null) {
                        // walang middle name pero may extension name
                        this.setDataValue(
                            'full_name',
                            `${this.first_name} ${this.last_name} ${this.extension_name}`
                        )
                    } else if (this.middle_name != null && this.extension_name == null) {
                        // may middle name pero walang extension name
                        this.setDataValue(
                            'full_name',
                            `${this.first_name} ${this.middle_name.charAt(0).toUpperCase()}. ${
                                this.last_name
                            }`
                        )
                    } else {
                        this.setDataValue(
                            'full_name',
                            `${this.first_name} ${this.middle_name.charAt(0).toUpperCase()}. ${
                                this.last_name
                            } ${this.extension_name}`
                        )
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'UserProfile',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            freezeTableName: true,
        }
    )
    return UserProfile
}
