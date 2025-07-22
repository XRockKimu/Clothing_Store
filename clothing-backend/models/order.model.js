export default (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
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
      tableName: 'Orders',
      timestamps: true,
    }
  );

  Order.associate = ({ Customer, Order_Item }) => {
    Order.belongsTo(Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });

    Order.hasMany(Order_Item, {
      foreignKey: 'order_id',
      as: 'order_items',
    });
  };

  return Order;
};
