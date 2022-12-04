module.exports = (sequelize, DataTypes) => {

    const cartorders= sequelize.define("cartorder", {///add s at the end
        orderid: {
            // primaryKey:true,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        user:{
            type: DataTypes.STRING,
            allowNull: false
        },

        title: {
            // primaryKey:true,
            type: DataTypes.STRING,
            allowNull: false
        },
       
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
        ,
        subtotal:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
        ,   file_src: {
            type: DataTypes.TEXT
        }
        ,
        priceeach: {
            type: DataTypes.INTEGER
        }
      
     
     
    
    })

    return cartorders

}