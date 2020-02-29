import React, { useState, useEffect } from "react";
import firebase from "../firebase";

function useUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .onSnapshot(snapshot => {
        const newUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setUsers(newUsers);
      });
  }, []);

  return users;
}

const UserList = () => {
  const users = useUsers();
  console.log(users);
  return (
    <ol>
      {users.map(user => (
        <li key={user.id}>
          <div>{user.displayName}</div>
          <div>
            {user.entries.map(entry => (
              <ol>
                <div>{`${entry.date}:  ${entry.steps} steps`}</div>
              </ol>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default UserList;
