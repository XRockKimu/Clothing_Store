export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("Product_Variants", [
    {
      product_id: 1,
      size: "M",
      color: "White",
      stock: 10,
      price: 29.99,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      product_id: 2,
      size: "L",
      color: "Blue",
      stock: 20,
      price: 39.99,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("Product_Variants", null, {});
}