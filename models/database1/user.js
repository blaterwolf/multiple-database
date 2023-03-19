'use strict'
const { Model } = require('sequelize')

// Bcrypt lib for encrypting password
const bcrypt = require('bcrypt')

// Include all protected attributes
const PROTECTED_ATTRIBUTES = ['password']

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            this.hasMany(models.UserProfile, {
                as: 'user_profiles',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.UserRole, {
                foreignKey: 'user_id',
                as: 'role_assigned_to_user',
                onDelete: 'RESTRICT',
            })

            this.hasOne(models.Patient_Information, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_patient_info',
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
    User.init(
        {
            user_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            user_no: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: { msg: 'User ID already exists.' },
                validate: {
                    notNull: { msg: 'User ID should not be null.' },
                    notEmpty: { msg: 'User ID should not be empty.' },
                },
            },
            user_type: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Student', 'PUP Staff', 'Super Admin']],
                        msg: 'user_type should be Student, PUP Staff or Super Admin.',
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Password should not be null.' },
                    notEmpty: { msg: 'Password should not be empty.' },
                },
            },
            is_blacklist: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'User',
            freezeTableName: true,

            hooks: {
                beforeCreate: user => {
                    // Encrypt user's password before getting sent to the database.
                    user.password = bcrypt.hashSync(user.password, 10)
                },

                afterCreate: () => {
                    if (process.env.ENABLE_MODEL_LOG === 'true') {
                        console.log('A new record has been added to table [users]')
                    }
                },
            },
        }
    )
    return User
}
