// models/product_variant.model.js
export default (sequelize, DataTypes) => {
  const ProductVariant = sequelize.define(
    'Product_Variant',
    {
      variant_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
        get() {
          const value = this.getDataValue('price');
          return value === null ? null : parseFloat(value);
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
      tableName: 'Product_Variants',
      timestamps: true,
    }
  );

  ProductVariant.associate = ({ Product }) => {
    ProductVariant.belongsTo(Product, { foreignKey: 'product_id' });
  };

  return ProductVariant;
};