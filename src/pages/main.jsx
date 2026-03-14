import MainTableComponent from '../components/mainTableComponent';
import MainCardComponent from '../components/mainCardComponent';
import { useAPI } from '../context/mainContext';


export default function Main() {
  const { showTableView } = useAPI();
  return (
    <div>
      <div>
        {showTableView ? <MainTableComponent /> : <MainCardComponent />}
      </div>
    </div>
  );
}
