import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FetchGroup = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [contacts, setContacts] = useState([]);
    const [editContact, setEditContact] = useState(null);

    useEffect(() => {
        axios.post('http://localhost/apiexam/user.php', new URLSearchParams({
            operation: 'getAllGroup'
        }))
            .then(response => {
                console.log("natawag ", response.data);
                if (response.data) {
                    setGroups(response.data);
                } else {
                    console.error('No groups found or invalid JSON response.');
                }
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }, []);

    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value);
    };

    const fetchContacts = () => {
        console.log("gitawag ang contact", selectedGroup);

        axios.post('http://localhost/apiexam/user.php', new URLSearchParams({
            operation: 'getContact',
            groupId: selectedGroup
        }))
            .then(response => {
                console.log("Contacts Response: ", response.data);
                if (response.data) {
                    setContacts(response.data);
                } else {
                    console.error('No contacts found or invalid JSON response.');
                }
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    };

    const handleDelete = (contactId) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            axios.post('http://localhost/apiexam/user.php', new URLSearchParams({
                operation: 'deleteContact',
                contactId: contactId
            }))
                .then(response => {
                    console.log("Delete Response: ", response.data);
                    if (response.data.success) {
                        fetchContacts();
                    } else {
                        alert("Error: " + response.data.error);
                    }
                })
                .catch(error => {
                    console.error('Error deleting contact:', error);
                });
        }
    };

    const handleEdit = (contact) => {
        setEditContact(contact);
    };

    const handleUpdate = () => {
        axios.post('http://localhost/apiexam/user.php', new URLSearchParams({
            operation: 'updateContact',
            contactId: editContact.contact_id,
            contactName: editContact.contact_name,
            contactPhone: editContact.contact_phone,
            contactEmail: editContact.contact_email,
            contactAddress: editContact.contact_address
        }))
            .then(response => {
                console.log("Update Response: ", response.data);
                if (response.data.success) {
                    fetchContacts(); 
                    setEditContact(null); 
                } else {
                    alert("Error: " + response.data.error);
                }
            })
            .catch(error => {
                console.error('Error updating contact:', error);
            });
    };

    const handleInputChange = (e) => {
        setEditContact({
            ...editContact,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <select
                    value={selectedGroup}
                    onChange={handleGroupChange}
                    className="border border-gray-300 rounded-md p-2"
                >
                    <option value="">Select Group</option>
                    {groups.map(group => (
                        <option key={group.grp_id} value={group.grp_id}>
                            {group.grp_name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={fetchContacts}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Go
                </button>
            </div>

            {contacts.length > 0 && (
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Phone</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Address</th>
                            <th className="py-2 px-4 border-b">Image</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => (
                            <tr key={contact.contact_id}>
                                <td className="py-2 px-4 border-b">
                                    {editContact && editContact.contact_id === contact.contact_id ? (
                                        <input
                                            type="text"
                                            name="contact_name"
                                            value={editContact.contact_name}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-1"
                                        />
                                    ) : (
                                        contact.contact_name
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editContact && editContact.contact_id === contact.contact_id ? (
                                        <input
                                            type="text"
                                            name="contact_phone"
                                            value={editContact.contact_phone}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-1"
                                        />
                                    ) : (
                                        contact.contact_phone
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editContact && editContact.contact_id === contact.contact_id ? (
                                        <input
                                            type="email"
                                            name="contact_email"
                                            value={editContact.contact_email}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-1"
                                        />
                                    ) : (
                                        contact.contact_email
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editContact && editContact.contact_id === contact.contact_id ? (
                                        <input
                                            type="text"
                                            name="contact_address"
                                            value={editContact.contact_address}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-1"
                                        />
                                    ) : (
                                        contact.contact_address
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">{contact.contact_image}</td>
                                <td className="py-2 px-4 border-b">
                                    {editContact && editContact.contact_id === contact.contact_id ? (
                                        <button
                                            onClick={handleUpdate}
                                            className="bg-green-500 text-white px-2 py-1 rounded-md"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(contact)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded-md"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(contact.contact_id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded-md ml-2"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default FetchGroup;
