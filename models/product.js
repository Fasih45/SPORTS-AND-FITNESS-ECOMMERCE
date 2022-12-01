module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("product", {
        file_src: {
            type: DataTypes.TEXT
        },
        title: {
            // primaryKey:true,
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER
        },
     
     
    
    })

    return Product

}