export default (sequelize, DataTypes) => {
  const InventoryModel = sequelize.define('Inventory', {
    inventory_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'product_id',
      },
    },
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Product_Variants',
        key: 'variant_id',
      },
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Suppliers',
        key: 'supplier_id',
      },
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Employees',
        key: 'employee_id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    last_updated: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    tableName: 'Inventory',
    timestamps: false,
  });

  InventoryModel.associate = ({ Products, Product_Variants, Suppliers, Employees }) => {
    InventoryModel.belongsTo(Products, { foreignKey: 'product_id', as: 'product', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    InventoryModel.belongsTo(Product_Variants, { foreignKey: 'variant_id', as: 'variant', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    InventoryModel.belongsTo(Suppliers, { foreignKey: 'supplier_id', as: 'supplier', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
    InventoryModel.belongsTo(Employees, { foreignKey: 'employee_id', as: 'employee', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
  };

  return InventoryModel;
};