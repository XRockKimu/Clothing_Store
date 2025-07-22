export default (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM("Men", "Women", "Girls", "Boys", "Accessories"),
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: "Products",
      timestamps: true,
    }
  );

  Product.associate = (models) => {
    Product.hasMany(models.Product_Variant, {
      foreignKey: "product_id",
      as: "variants",
    });
  };

  return Product;
};