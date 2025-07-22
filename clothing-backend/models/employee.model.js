export default (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      employee_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          is: /[^\s@]+@[^\s@]+\.[^\s@]+/,
        },
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("Admin"),
        allowNull: false,
        defaultValue: "Admin",
      },
      hire_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      tableName: "Employees",
      timestamps: false,
    }
  );
  return Employee;
};