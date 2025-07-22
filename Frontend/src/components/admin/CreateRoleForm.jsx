// components/admin/CreateRoleForm.jsx
import { useState } from "react";

export default function CreateRoleForm() {
  const [roleName, setRoleName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName) return alert("Please enter a role name");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleName }),
      });
      const data = await res.json();
      alert(data.message || "Role created!");
      setRoleName("");
    } catch (err) {
      console.error("Error creating role:", err);
      alert("Error creating role");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Role</h2>
      <input
        type="text"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
        placeholder="Enter role name"
        className="border p-2 w-full mb-3"
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Create Role
      </button>
    </form>
  );
}
