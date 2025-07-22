// components/admin/AssignPrivileges.jsx
import { useEffect, useState } from "react";

const allPrivileges = ["CREATE", "READ", "UPDATE", "DELETE"];

export default function AssignPrivileges() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/roles`)
      .then((res) => res.json())
      .then(setRoles);
  }, []);

  const togglePrivilege = (priv) => {
    setSelectedPrivileges((prev) =>
      prev.includes(priv) ? prev.filter((p) => p !== priv) : [...prev, priv]
    );
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedRole || selectedPrivileges.length === 0) return alert("Select role and at least one privilege");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/assign-privileges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_id: selectedRole, privileges: selectedPrivileges }),
      });
      const data = await res.json();
      alert(data.message || "Privileges assigned!");
    } catch (err) {
      console.error(err);
      alert("Failed to assign privileges");
    }
  };

  return (
    <form onSubmit={handleAssign} className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Assign Privileges to Role</h2>
      <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="border p-2 w-full mb-3">
        <option value="">Select Role</option>
        {roles.map((role) => (
          <option key={role.role_id} value={role.role_id}>
            {role.role}
          </option>
        ))}
      </select>

      <div className="flex gap-4 mb-3 flex-wrap">
        {allPrivileges.map((priv) => (
          <label key={priv} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedPrivileges.includes(priv)}
              onChange={() => togglePrivilege(priv)}
            />
            {priv}
          </label>
        ))}
      </div>

      <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Assign Privileges
      </button>
    </form>
  );
}
