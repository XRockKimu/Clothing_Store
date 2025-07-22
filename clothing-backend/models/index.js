import Sequelize from "sequelize";
import sequelize from "../config/database.js";

import ProductModel from "./product.model.js";
import ProductVariantModel from "./product_variant.model.js";
import CustomerModel from "./customer.model.js";
/*import Order_ItemDef from "./order_item.model.js";*/
import OrderItemModel from './order_item.model.js';
import EmployeeModel from "./employee.model.js";
import OrderModel from "./order.model.js";

// Initialize models
const Product = ProductModel(sequelize, Sequelize.DataTypes);
const Product_Variant = ProductVariantModel(sequelize, Sequelize.DataTypes);
const Customer = CustomerModel(sequelize, Sequelize.DataTypes);
/*const Order_Item = Order_ItemDef(sequelize, Sequelize.DataTypes);*/
const Order_Item = OrderItemModel(sequelize, Sequelize.DataTypes);
const Employee = EmployeeModel(sequelize, Sequelize.DataTypes);
const Order = OrderModel(sequelize, Sequelize.DataTypes);

// Set up associations
Product.associate?.({ Product_Variant });
Product_Variant.associate?.({ Product });
/*Order_Item.associate?.({ Product });*/
Employee.associate?.({});
Order_Item.associate?.({ Product, Product_Variant, Order });

// Export models and sequelize instance
const db = {
  sequelize,
  Sequelize,
  Product,
  Product_Variant,
  Customer,
  Order_Item,
  Employee,
};

export default db;
