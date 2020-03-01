import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import "firebase/auth";
import Calendar from "react-calendar";

function onEditSteps(date, steps) {
  const userId = firebase.auth().currentUser.uid;

  var docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("steps")
    .doc(date.toString());

  return docRef
    .set({
      steps: steps
    })
    .then(function() {
      console.log("successfully added steps document");
    })
    .catch(function(error) {
      console.log(error);
    });
}

const SORT_OPTIONS = {
  STEPS_ASC: { column: "steps", direction: "asc" },
  STEPS_DESC: { column: "steps", direction: "desc" }
};

function useSteps(sortBy = "STEPS_DESC") {
  const [steps, setSteps] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("steps")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .onSnapshot(snapshot => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSteps(docs);
      });

    return () => unsubscribe();
  }, []);

  return steps;
}

function showStepCount(date) {}

const EditSteps = () => {
  const [date, setDate] = useState("");
  const [steps, setSteps] = useState(0);
  const [sortBy, setSortBy] = useState("STEPS_DESC");
  const [selectedDate, setSelectedDate] = useState("");

  const savedSteps = useSteps(sortBy);

  return (
    <div>
      <Calendar
        onChange={newDate => setDate(newDate)}
        value={date}
        onClickDay={selectedDate => {
          showStepCount(selectedDate);
          setSelectedDate(selectedDate.toString());
        }}
      />
      <button
        onClick={e => {
          onEditSteps(date, steps);
        }}
      >
        Update
      </button>
      <input
        type="number"
        min="0"
        onChange={event => {
          setSteps(parseInt(event.target.value));
        }}
      />
      <div>
        {savedSteps.map(step =>
          step.id === selectedDate ? (
            <div key={step.id}>
              <div>{`${step.steps} steps`}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default EditSteps;
