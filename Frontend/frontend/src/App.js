import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/customers')
      .then(res => {
        console.log('API Response:', res.data);
        if (Array.isArray(res.data)) {
          setCustomers(res.data);
        } else if (Array.isArray(res.data.customers)) {
          setCustomers(res.data.customers);
        } else if (Array.isArray(res.data.data)) {
          setCustomers(res.data.data);
        } else {
          console.error('Unexpected API format');
          setCustomers([]);
        }
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  const filteredCustomers = customers.filter(customer =>
    (customer.first_name && customer.first_name.toLowerCase().includes(search.toLowerCase())) ||
    (customer.last_name && customer.last_name.toLowerCase().includes(search.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center' }}>Customer List</h2>
      <hr />

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '300px', marginBottom: '1rem' }}
        />
      </form>

      {filteredCustomers.length > 0 ? (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Order Count</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.first_name} {customer.last_name}</td>
                <td>{customer.email}</td>
                <td>{customer.order_count ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No customers found.</p>
      )}
    </div>
  );
}

export default App;
