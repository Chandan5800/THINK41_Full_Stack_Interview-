import React from 'react';

function CustomerTable({ customers }) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Order Count</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-2">{c.first_name} {c.last_name}</td>
              <td className="px-4 py-2">{c.email}</td>
              <td className="px-4 py-2">{c.order_count || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTable;
