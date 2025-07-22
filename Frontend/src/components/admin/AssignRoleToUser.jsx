// components/admin/AssignRoleToUser.jsx
import { useState, useEffect } from "react";

export default function AssignRoleToUser() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/users`)
      .then((res) => res.json())
      .then(setUsers);
    fetch(`${import.meta.env.VITE_API_URL}/admin/roles`)
      .then((res) => res.json())
      .then(setRoles);
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/assign-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, role_id: roleId }),
      });
      const data = await res.json();
      alert(data.message || "Role assigned!");
    } catch (err) {
      console.error(err);
      alert("Failed to assign role");
    }
  };

  return (
    <form onSubmit={handleAssign} className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Assign Role to User</h2>
      <select value={userId} onChange={(e) => setUserId(e.target.value)} className="border p-2 w-full mb-3">
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.user_id} value={user.user_id}>
            {user.username}
          </option>
        ))}
      </select>
      <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="border p-2 w-full mb-3">
        <option value="">Select Role</option>
        {roles.map((role) => (
          <option key={role.role_id} value={role.role_id}>
            {role.role}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Assign Role
      </button>
    </form>
  );
}
