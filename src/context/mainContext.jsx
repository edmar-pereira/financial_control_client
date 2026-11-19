import React, { useContext, useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

const MainContext = createContext();

export function APIContextProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const stored = localStorage.getItem('selectedDate');
    return stored ? new Date(stored) : new Date();
  });

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const storedCategory = localStorage.getItem('selectedCategory');
    return storedCategory ?? 'all_categories';
  });

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
  const [currentMonth, setCurrentMonth] = useState([]);
  const [isBackendReady, setIsBackendReady] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem('selectedDate', selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem('selectedCategory', selectedCategory);
    }
  }, [selectedCategory]);

  const triggerReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleLoadCategory = async () => {
    try {
      const response = await api.get('/api/category/getCategory');

      if (response.data.status === 200) {
        const sorted = response.data.data
          .filter((item) => item.label)
          .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

        setArrCategories(sorted);
      }
    } catch (error) {
      console.log(error);
      setMessage({
        severity: 'error',
        content: 'Erro ao carregar categorias',
        show: true,
      });
    }
  };

const handleSaveCategoryChanges = async (changes) => {
  try {
    const response = await api.put('/api/category/updateCategory', changes);

    if (response.data.status !== 200) {
      setMessage({
        severity: 'error',
        content: 'Erro ao atualizar categoria',
        show: true,
      });
      return false;
    }

    // atualiza o estado global (tabela, gráfico, totais)
    await handleLoadCategory();

    setMessage({
      severity: 'success',
      content: 'Categoria atualizada com sucesso!',
      show: true,
    });

    return true;
  } catch (error) {
    console.error(error);

    setMessage({
      severity: 'error',
      content: 'Erro ao atualizar categoria',
      show: true,
    });

    return false;
  }
};

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
  };

  const handleChangeTableView = () => {
    setShowTableView(!showTableView);
    localStorage.setItem('tableView', !showTableView);
  };

  const handleChangeCategory = (newCategoryId, rowIndex = null) => {
    if (rowIndex !== null) {
      setImportedData((prevData) =>
        prevData.map((item, i) =>
          i === rowIndex ? { ...item, type: newCategoryId } : item,
        ),
      );
    } else {
      // Optional: update selectedCategory globally if needed
      setSelectedCategory(newCategoryId);
    }
  };

  useEffect(() => {
    if (currentMonth.expenses !== undefined) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [currentMonth]);

  useEffect(() => {
    const mode = localStorage.getItem('darkMode');
    setIsDarkMode(mode === null || mode === 'false' ? false : true);

    const savedTableView = localStorage.getItem('tableView');
    setShowTableView(
      savedTableView === null || savedTableView === 'true' ? true : false,
    );

    let interval;

  const checkBackend = async () => {
    try {
      const response = await api.get('/api/health', {
        timeout: 3000,
      });

      // console.log(response)

      if (response.status === 200) {
        setIsBackendReady(true);

        if (interval) {
          clearInterval(interval);
        }
      }
    } catch (error) {
      setIsBackendReady(false);
    }
  };

  checkBackend();

  interval = setInterval(checkBackend, 5000);

  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
    // handleLoadCategory();
  }, []);

  return (
    <MainContext.Provider
      value={{
        arrCategories,
        handleChangeCategory,
        selectedCategory,
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
        setSelectedCategory,
        selectedDate,
        setSelectedDate,
        setLoading,
        loading,
        currentMonth,
        setCurrentMonth,
        setArrCategories,
        handleLoadCategory,
        isBackendReady,
        // setIsBackendReady
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
