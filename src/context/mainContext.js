import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  useCallback,
} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const MainContext = createContext();

export function APIContextProvider({ children }) {
  // const [arrMonths, setArrMonths] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [arrCategories, setArrCategories] = useState([]);
  const [message, setMessage] = useState({
    severity: '',
    message: '',
    show: false,
  });
  // const [isCategoryFiltered, setIsCategoryFiltered] = useState(false); // This will be used to know when updating the view if is necessary to return to the category filtered
  const [showTableView, setShowTableView] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  const triggerReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleLoadCategory = async () => {
    await axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/data/getCategory/`,
    }).then((response) => {
      if (response.data.status === 200) {
        const { data } = response.data;
        setArrCategories(data);
      }
    });
  };

  const handleSaveCategoryChanges = async (changes) => {
    await axios({
      method: 'put',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/data/updateCategory/`,
      data: changes,
    }).then((response) => {
      if (response.data.status === 200) {
        setMessage({
          severity: 'info',
          content: 'Categoria atualizada com sucesso!',
          show: true,
        });
        // handleLoadCategory();
      } else {
        setMessage({
          severity: 'error',
          content: 'Erro ao atualizar categoria',
          show: true,
        });
      }
    });
  };

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
  };

  const handleChangeTableView = () => {
    setShowTableView(!showTableView);
    localStorage.setItem('tableView', !showTableView);
  };

  useEffect(() => {
    console.log(importedData);
  }, [importedData]);

  const handleChangeCategory = (newCategoryId, rowIndex = null) => {
    if (rowIndex !== null) {
      setImportedData((prevData) =>
        prevData.map((item, i) =>
          i === rowIndex ? { ...item, type: newCategoryId } : item
        )
      );
    } else {
      // Optional: update selectedCategory globally if needed
      setSelectedCategory(newCategoryId);
    }
  };

  useEffect(() => {
    const mode = localStorage.getItem('darkMode');
    setIsDarkMode(mode === null || mode === 'false' ? false : true);

    const savedTableView = localStorage.getItem('tableView');
    setShowTableView(
      savedTableView === null || savedTableView === 'true' ? true : false
    );

    handleLoadCategory();

    // handleLoadData();
  }, []);

  return (
    <MainContext.Provider
      value={{
        arrCategories,
        handleChangeCategory,
        selectedCategory,
        loading,
        message,
        setMessage,
        importedData,
        setImportedData,
        showTableView,
        handleChangeTableView,
        isDarkMode,
        handleThemeChange,
        handleSaveCategoryChanges,
        reloadKey,
        triggerReload,
        selectedCategory,
        setSelectedCategory,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export function useAPI() {
  const context = useContext(MainContext);
  if (context === undefined) {
    throw new Error('Context must be used within a Provider');
  }
  return context;
}

APIContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
