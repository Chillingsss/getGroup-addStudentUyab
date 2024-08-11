import React, { useState } from 'react';

import axios from 'axios';


const AddStudentUyab = () => {
    const [studentname, setStudentname] = useState("");
    const [uyabname, setUyabname] = useState("");
    const [uyabList, setUyabList] = useState([]);

    const handleAddUyab = () => {
        if (uyabname) {
            setUyabList([...uyabList, uyabname]);
            setUyabname("");
        }
    };

    async function handleAdd(e) {
        e.preventDefault();
        e.stopPropagation();

        try {
            const url = localStorage.getItem("url") + "/user.php";
            const jsonData = {
                studentname: studentname,
                uyabs: uyabList
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "addStudent");

            const res = await axios.post(url, formData);
            console.log("Response from Signup:", res.data);

            if (res.data.success) {
                alert("Signup Successful");
                setStudentname("");
                setUyabList([]);
            } else {
                alert("Invalid Credentials: " + res.data.error);
            }
        } catch (error) {
            console.error("Error occurred during student addition:", error);
            alert("An error occurred while adding the student. Please try again.");
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-4 text-center">Add Student</h1>
            <form onSubmit={handleAdd}>
                <div className="mb-4">
                    <label htmlFor="studentname" className="block text-gray-700 mb-2">Student Name</label>
                    <input
                        value={studentname}
                        onChange={e => setStudentname(e.target.value)}
                        className="appearance-none block w-full bg-gray-200 text-black border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="studentname"
                        type="text"
                        placeholder="Student Name"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="uyabname" className="block text-gray-700 mb-2">Uyab Name</label>
                    <input
                        value={uyabname}
                        onChange={e => setUyabname(e.target.value)}
                        className="appearance-none block w-full bg-gray-200 text-black border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="uyabname"
                        type="text"
                        placeholder="Uyab Name"
                    />
                    <button type="button" onClick={handleAddUyab} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mt-2">
                        Add Uyab
                    </button>
                </div>
                <div className="mb-4">
                    <ul>
                        {uyabList.map((uyab, index) => (
                            <li key={index} className="bg-gray-200 text-black py-2 px-4 rounded mb-2">{uyab}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        Insert
                    </button>
                </div>
            </form>
        </>
    );
}

export default AddStudentUyab
