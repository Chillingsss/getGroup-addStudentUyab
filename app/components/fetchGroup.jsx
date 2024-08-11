import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FetchGroup = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [contacts, setContacts] = useState([]);

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
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => (
                            <tr key={contact.contact_id}>
                                <td className="py-2 px-4 border-b">{contact.contact_name}</td>
                                <td className="py-2 px-4 border-b">{contact.contact_phone}</td>
                                <td className="py-2 px-4 border-b">{contact.contact_email}</td>
                                <td className='py-2 px-4 border-b'>{contact.contact_address}</td>
                                <td className='py-2 px-4 border-b'>{contact.contact_image}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default FetchGroup
