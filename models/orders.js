module.exports = (sequelize, DataTypes) => {

    const order= sequelize.define("order", {///add s at the end
        orderid: {
            // primaryKey:true,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        user:{
            type: DataTypes.STRING,
            allowNull: false
        },

        grandtotal:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
        ,
       
      
     
     
    
    })

    return order

}