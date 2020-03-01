import React, { useState, useEffect } from "react";
import firebase from "../firebase";

const SORT_OPTIONS = {
  STEPS_ASC: { column: "totalSteps", direction: "asc" },
  STEPS_DESC: { column: "totalSteps", direction: "desc" }
};
function useUsers(sortBy = "STEPS_DESC") {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .onSnapshot(snapshot => {
        const newUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setUsers(newUsers);
      });

    return () => unsubscribe();
  }, [sortBy]);

  return users;
}

const UserList = () => {
  const [sortBy, setSortBy] = useState("STEPS_DESC");
  const users = useUsers(sortBy);

  return (
    <div>
      <h2>Steppers - Ranking</h2>
      <div>
        <label>Sort By:</label>
        {` `}
        <select value={sortBy} onChange={e => setSortBy(e.currentTarget.value)}>
          <option value="STEPS_DESC">Steps (most first)</option>
          <option value="STEPS_ASC">Steps (least first)</option>
        </select>
      </div>
      <ol>
        {users.map(user => (
          <li key={user.id}>
            <div>{`${user.displayName} - ${user.totalSteps} steps`}</div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default UserList;
