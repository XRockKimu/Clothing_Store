export default (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'Order_Item',
    {
      order_item_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
        get() {
          const value = this.getDataValue('unit_price');
          return value === null ? null : parseFloat(value); // Ensure number for frontend
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'Order_Items',
      timestamps: true,
    }
  );

  // 🔗 Set up associations here
  OrderItem.associate = ({ Product, Product_Variant, Order }) => {
    OrderItem.belongsTo(Product, {
      foreignKey: 'product_id',
      as: 'product',
    });

    OrderItem.belongsTo(Product_Variant, {
      foreignKey: 'variant_id',
      as: 'variant',
    });

    OrderItem.belongsTo(Order, {
      foreignKey: 'order_id',
      as: 'order',
    });
  };

  return OrderItem;
};
