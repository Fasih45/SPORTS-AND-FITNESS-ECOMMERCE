module.exports = (sequelize, DataTypes) => {

    const USER = sequelize.define("user", {
        

        username: {
            primaryKey:true,
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Ph:{
            type: DataTypes.INTEGER
        },
        address: {
            type: DataTypes.STRING,
            
        },
        verify:{
            type: DataTypes.STRING,
            defaultValue: "0"
        },
        token:{
            type: DataTypes.STRING,
            
        }
     
    
    })

    return USER

}