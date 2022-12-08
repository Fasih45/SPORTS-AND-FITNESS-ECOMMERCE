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
        rating:{

            type: DataTypes.FLOAT,
            defaultValue: 0
        },

        quantity:{

            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        desc:{
            type: DataTypes.STRING,
            

        }
     
     
    
    })

    return Product

}