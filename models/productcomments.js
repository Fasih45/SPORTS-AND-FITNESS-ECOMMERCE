module.exports = (sequelize, DataTypes) => {

    const ProductComments = sequelize.define("productcomment", {
      
        title: {
            // primaryKey:true,
            type: DataTypes.STRING,
            allowNull: false
        },
        user:{
            type: DataTypes.STRING,
            allowNull: false
        },
        comments:{
            type: DataTypes.STRING,
            allowNull: false
        }
        
      
     
     
    
    })

    return ProductComments

}