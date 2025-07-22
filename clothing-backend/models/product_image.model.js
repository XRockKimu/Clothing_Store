export default (sequelize, DataTypes) => {
  const ProductImageModel = sequelize.define('ProductImages', {
    image_id: {
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
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'ProductImages',
    timestamps: false,
  });

  ProductImageModel.associate = ({ Products }) => {
    ProductImageModel.belongsTo(Products, {
      foreignKey: 'product_id',
      as: 'product',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return ProductImageModel;
};