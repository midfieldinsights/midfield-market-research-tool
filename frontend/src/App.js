import React, { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function App() {
  const [clients, setClients] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [groups, setGroups] = useState([]);

  const [clientName, setClientName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupClientId, setGroupClientId] = useState('');
  const [groupVendorIds, setGroupVendorIds] = useState('');

  useEffect(() => {
    fetchClients();
    fetchVendors();
    fetchGroups();
  }, []);

  async function fetchClients() {
    const res = await fetch(`${apiUrl}/api/clients`, { credentials: 'include' });
    const data = await res.json();
    setClients(data);
  }

  async function fetchVendors() {
    const res = await fetch(`${apiUrl}/api/vendors`, { credentials: 'include' });
    const data = await res.json();
    setVendors(data);
  }

  async function fetchGroups() {
    const res = await fetch(`${apiUrl}/api/groups`, { credentials: 'include' });
    const data = await res.json();
    setGroups(data);
  }

  async function addClient() {
    await fetch(`${apiUrl}/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: clientName }),
    });
    setClientName('');
    fetchClients();
  }

  async function addVendor() {
    await fetch(`${apiUrl}/api/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: vendorName }),
    });
    setVendorName('');
    fetchVendors();
  }

  async function addGroup() {
    await fetch(`${apiUrl}/api/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: groupName, clientId: groupClientId, vendorIds: groupVendorIds.split(',') }),
    });
    setGroupName('');
    setGroupClientId('');
    setGroupVendorIds('');
    fetchGroups();
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>MidField Insights Admin Panel</h1>

      <section>
        <h2>Clients</h2>
        <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Name" />
        <button onClick={addClient}>Add Client</button>
        <ul>{clients.map(c => <li key={c.id}>{c.name}</li>)}</ul>
      </section>

      <section>
        <h2>Vendors</h2>
        <input value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="Vendor Name" />
        <button onClick={addVendor}>Add Vendor</button>
        <ul>{vendors.map(v => <li key={v.id}>{v.name}</li>)}</ul>
      </section>

      <section>
        <h2>Survey Groups</h2>
        <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Group Name" />
        <select value={groupClientId} onChange={e => setGroupClientId(e.target.value)}>
          <option value="">Select Client</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          value={groupVendorIds}
          onChange={e => setGroupVendorIds(e.target.value)}
          placeholder="Vendor IDs comma separated"
        />
        <button onClick={addGroup}>Add Group</button>
        <ul>
          {groups.map(g => (
            <li key={g.id}>
              {g.name} (Client: {g.clientId}, Vendors: {g.vendorIds.join(', ')})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
