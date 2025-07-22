// --- seeders/20250626-demo-products.js ---
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("Products", [
    {
      product_name: "Oxford Shirt",
      category: "Men",
      image_url: "https://images.unsplash.com/photo-1618354691413-508dfbff9c5e?auto=format&fit=crop&w=400&q=80",
      description: "A breathable stylish oxford shirt.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      product_name: "Denim Jeans",
      category: "Men",
      image_url: "https://images.unsplash.com/photo-1584270354949-5cbbbd2c7730?auto=format&fit=crop&w=400&q=80",
      description: "Classic blue denim jeans.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("Products", null, {});
}
