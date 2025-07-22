// components/admin/UserRoleList.jsx
import { useEffect, useState } from "react";

export default function UserRoleList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/user-roles`)
      .then((res) => res.json())
      .then(setList);
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">User Role Assignments</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">User</th>
            <th className="border p-2 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, idx) => (
            <tr key={idx}>
              <td className="border p-2">{item.username}</td>
              <td className="border p-2">{item.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
