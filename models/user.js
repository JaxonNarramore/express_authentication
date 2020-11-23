'use strict';
const bcrypt = require('bcrypt'); // Making a hash password for the user
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1,99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invaild email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [12,99],
          msg: 'Password must be between 12 and 99 characters'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  user.addHook('beforeCreate', function(pendingUser) {
    // Bcrypt hash a password for us
    let hash = bcrypt.hashSync(pendingUser.password, 12);
  
    // Set password to = hash
    pendingUser.password = hash;
  });
  
  user.prototype.validPassword = function(passwordTyped) {
    let correctPassword = bcrypt.compareSync(passwordTyped, this.password);
  
    // Return true or false base on correct password or not
    return correctPassword;
  }
  
  // Remove the password before it gets serialized 
  // removes from the request not the database
  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.password;
    return userData;
  }
  
  return user;
};
