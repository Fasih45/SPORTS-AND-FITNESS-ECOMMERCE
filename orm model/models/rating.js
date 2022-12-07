module.exports = (sequelize, DataTypes) => {

    const rating= sequelize.define("rating", {
      
        title: {
            // primaryKey:true,
            type: DataTypes.STRING,
            allowNull: false
        },
        user:{
            type: DataTypes.STRING,
            allowNull: false
        },
        rate:{
            type: DataTypes.FLOAT,
            allowNull: false
        }
        
      
     
     
    
    })

    return rating

}