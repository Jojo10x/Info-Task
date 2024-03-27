import{ useState, useEffect} from 'react';
import '../firebase-config';
import { addDoc, collection, Timestamp, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore"; 
import {db} from "../firebase-config"
import styles from "./Report.module.css";

function DailyReport() {
  const [managerName, setManagerName] = useState("");
  const [pointAddress, setPointAddress] = useState("");
  const [revenue, setRevenue] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [storedValues, setStoredValues] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "myCollection"),
      (snapshot) => {
        const temporaryArr = [];
        snapshot.forEach((doc) => {
          temporaryArr.push({ id: doc.id, ...doc.data() });
        });
        setStoredValues(temporaryArr);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveDataToFirestore = async () => {
    if (selectedItemId) {
      await updateDoc(doc(db, "myCollection", selectedItemId), {
        field1: managerName,
        field2: pointAddress,
        field3: revenue,
        field4: Timestamp.fromDate(currentDate),
      });
      setSelectedItemId(null);
    } else {
      await addDoc(collection(db, "myCollection"), {
        field1: managerName,
        field2: pointAddress,
        field3: revenue,
        field4: Timestamp.fromDate(currentDate),
      });
    }
    setManagerName("");
    setPointAddress("");
    setRevenue("");
  };

  const handleEdit = (item) => {
    setSelectedItemId(item.id);
    setManagerName(item.field1);
    setPointAddress(item.field2);
    setRevenue(item.field3);
    setCurrentDate(item.field4.toDate());
  };

  const deleteFromFirestore = async (id) => {
    await deleteDoc(doc(db, "myCollection", id));
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setCurrentDate(newDate);
  };

  const todayReports = storedValues.filter((value) => {
    const valueDate = value.field4 && value.field4.toDate();
    const today = new Date();
    return (
      valueDate.getDate() === today.getDate() &&
      valueDate.getMonth() === today.getMonth() &&
      valueDate.getFullYear() === today.getFullYear()
    );
  });

  const thisMonthReports = storedValues.filter((value) => {
    const valueDate = value.field4 && value.field4.toDate();
    const today = new Date();
    return (
      valueDate.getMonth() === today.getMonth() &&
      valueDate.getFullYear() === today.getFullYear()
    );
  });

  const oldReports = storedValues.filter((value) => {
    const valueDate = value.field4 && value.field4.toDate();
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    return valueDate < oneMonthAgo;
  });

  return (
    <div className={styles.container}>
      <div className={styles.title}>Save </div>
      <input type="date" onChange={handleDateChange} className={styles.input} />
      <input
        type="text"
        placeholder="Manager's Name"
        value={managerName}
        onChange={(e) => setManagerName(e.target.value)}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Point Address"
        value={pointAddress}
        onChange={(e) => setPointAddress(e.target.value)}
        className={styles.input}
      />
      <input
        type="number"
        placeholder="Revenue"
        value={revenue}
        onChange={(e) => setRevenue(e.target.value)}
        className={styles.input}
      />
      <button onClick={saveDataToFirestore} className={styles.button}>
        {selectedItemId ? "Update" : "Save"}
      </button>

      <div className={styles.title}>Todays Reports</div>
      <ul className={styles.list}>
        {todayReports.map((value, index) => (
          <li key={index} className={styles.reportItem}>
            <div>
              <span className={styles.label}>Date:</span>{" "}
              {value.field4 && value.field4.toDate().toLocaleDateString()}
            </div>
            <div>
              <span className={styles.label}>Manager:</span> {value.field1}
            </div>
            <div>
              <span className={styles.label}>Address:</span> {value.field2}
            </div>
            <div>
              <span className={styles.label}>Revenue:</span> {value.field3}
            </div>
            <div>
              <button
                onClick={() => deleteFromFirestore(value.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(value)}
                className={styles.editButton}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.title}>Reports of the Month</div>
      <ul className={styles.list}>
        {thisMonthReports.map((value, index) => (
          <li key={index} className={styles.reportItem}>
            <div>
              <span className={styles.label}>Date:</span>{" "}
              {value.field4 && value.field4.toDate().toLocaleDateString()}
            </div>
            <div>
              <span className={styles.label}>Manager:</span> {value.field1}
            </div>
            <div>
              <span className={styles.label}>Address:</span> {value.field2}
            </div>
            <div>
              <span className={styles.label}>Revenue:</span> {value.field3}
            </div>
            <div>
              <button
                onClick={() => deleteFromFirestore(value.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(value)}
                className={styles.editButton}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.title}>Old Reports</div>
      <ul className={styles.list}>
        {oldReports.map((value, index) => (
          <li key={index} className={styles.reportItem}>
            <div>
              <span className={styles.label}>Date:</span>{" "}
              {value.field4 && value.field4.toDate().toLocaleDateString()}
            </div>
            <div>
              <span className={styles.label}>Manager:</span> {value.field1}
            </div>
            <div>
              <span className={styles.label}>Address:</span> {value.field2}
            </div>
            <div>
              <span className={styles.label}>Revenue:</span> {value.field3}
            </div>
            <div>
              <button
                onClick={() => deleteFromFirestore(value.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(value)}
                className={styles.editButton}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DailyReport;
