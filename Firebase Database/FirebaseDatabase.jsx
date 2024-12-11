import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, update, remove } from "firebase/database";

export default function FirebaseDatabase() {

    const database = getDatabase();
    const [users, setUsers] = useState([]);

    const [state, setState] = useState({
        username: '',
        email: '',
        id: null
    });

    useEffect(() => {
        SendData();
    }, []);

    function SendData() {
        get(ref(database, 'users'))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const Data = Object.entries(data).map(([id, value]) => ({
                        id,
                        ...value,
                    }));
                    setUsers(Data);
                } else {
                    setUsers([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }

    function GetData() {
        if (state.id) {
            updateUser(state.id);
        } else {
            const newId = users.length ? (parseInt(users[users.length - 1].id) + 1).toString() : "1";

            set(ref(database, `users/${newId}`), {
                username: state.username,
                email: state.email,
            })
                .then(() => {
                    console.log("User created successfully!");
                    setState({ username: '', email: '', id: null });
                    SendData();
                })
                .catch((error) => {
                    console.error("Error creating state:", error);
                });
        }
    }

    function updateUser(userId) {
        update(ref(database, `users/${userId}`), {
            username: state.username,
            email: state.email,
        })
            .then(() => {
                console.log("User updated successfully!");
                setState({ username: '', email: '', id: null });
                SendData();
            })
            .catch((error) => {
                console.error("Error updating state:", error);
            });
    }

    function deleteUser(userId) {
        remove(ref(database, `users/${userId}`))
            .then(() => {
                console.log("User deleted successfully!");
                SendData();
            })
            .catch((error) => {
                console.error("Error deleting state:", error);
            });
    }

    function editUser(state) {
        setState({ username: state.username, email: state.email, id: state.id });
    }

    return (
        <div>
            <br />
            <h1>Firebase CRUD Operations</h1>
            <br />

            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={state.username}
                    onChange={(e) => setState({ ...state, username: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={state.email}
                    onChange={(e) => setState({ ...state, email: e.target.value })}
                />
                <button onClick={GetData}>
                    {
                        state.id ? "Update User" : "Add User"
                    }
                </button>
            </div>

            <br /> <h2>DataBase List</h2> <br />
            <ul style={{ listStyle: "none" }}>
                {
                    users.map((state) => (
                        <li key={state.id}>
                            <p>Username: {state.username}</p>
                            <p>Email: {state.email}</p>
                            <button onClick={() => editUser(state)}>Edit</button>
                            <button onClick={() => deleteUser(state.id)}>Delete</button><br /><br />
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}
