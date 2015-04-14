"use strict";
var bcrypt= require('bcrypt');
var salt= bcrypt.genSaltSync(10);

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: {
      type:DataTypes.STRING,
      unique:true,
      validate:{
        len:[6,30]
      }
    },
    password: {
      type:DataTypes.STRING,
      validate:{
        notEmpty:true
      }
    }
  }, {
    instanceMethods:{
      checkPassword: function(password){
        return bcrypt.compareSync(password,this.password);
      }
    },
    classMethods: {
      encryptPassword: function(email,password){
        if (password.length <6){
          throw new Error("Password too short");
        }
        return this.create({
          email:email,
          password: this.encryptPassword(password)
        });
      },
      authenticate: function(email,password){
        return this.find({
          wher:{
            email:email
          }
        })
        .then(function(user){
          if (user===null){
            throw new Error("Username does not exist");
          }
          else if (user.checkPassword(password)){
            return  user;
          }else{
            return false;
          }
        })
      },
        associate: function(models) {
        // associations can be defined here
      }
    }
    });
return User;



};