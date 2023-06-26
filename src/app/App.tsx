import DatePicker from "../components/DatePicker/DatePicker";
import SuperDatePicker from "../components/SuperDatePicker/SuperDatePicker";
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <SuperDatePicker />
    </div>
  );
}

export default App;
