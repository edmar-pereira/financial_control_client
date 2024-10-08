import React, { useContext, useState, useEffect, createContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const MainContext = createContext();

export function APIContextProvider({ children }) {
  const [arrMonths, setArrMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [arrCategory, setArrCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    severity: '',
    message: '',
    show: false,
  });
  const [isCategoryFiltered, setIsCategoryFiltered] = useState(false); // This will be used to know when updating the view if is necessary to return to the category filtered
  const [showTableView, setShowTableView] = useState(true);
  const expensesType = [
    {
      id: 'all_categories',
      label: 'Todas',
      color: 'rgba(15, 99, 71, 0.6)',
      maxValue: 0,
    },
    {
      id: 'bars_and_restaurants',
      label: 'Bares e Restaurantes',
      color: 'rgba(115, 99, 71, 0.6)',
      maxValue: 800.0,
    },
    {
      id: 'credit_card',
      label: 'Cartão de Crédito',
      color: 'rgba(255, 69, 0, 0.6)',
      maxValue: 0,
    },
    {
      id: 'personal_cares',
      label: 'Cuidados Pessoais',
      color: 'rgba(175, 238, 238, 0.6)',
      maxValue: 250.0,
    },
    {
      id: 'education',
      label: 'Educação',
      color: 'rgba(123, 132, 218, 0.6)',
      maxValue: 1250.0,
    },
    {
      id: 'children',
      label: 'Filhos',
      color: 'rgba(32, 178, 170, 0.6)',
      maxValue: 0.0,
    },
    {
      id: 'financing',
      label: 'Financiamento',
      color: 'rgba(173, 255, 47, 0.6)',
      maxValue: 3560.0,
    },
    {
      id: 'miscellaneous_purchases',
      label: 'Gastos Diversos',
      color: 'rgba(255, 69, 0, 0.6)',
      maxValue: 400.0,
    },
    {
      id: 'essential_expenses',
      label: 'Gastos Essenciais',
      color: 'rgba(255, 215, 0, 0.6)',
      maxValue: 1200.0,
    },
    {
      id: 'work_expenses',
      label: 'Gastos com Trabalho',
      color: 'rgba(128, 28, 18, 0.6) ',
      maxValue: 0,
    },
    {
      id: 'taxes_fees',
      label: 'Impostos',
      color: 'rgba(0, 191, 255, 0.6)',
      maxValue: 0,
    },
    {
      id: 'stocks',
      label: 'Investimentos',
      color: 'rgba(211, 3, 252)',
      maxValue: 0,
    },
    {
      id: 'leisure',
      label: 'Lazer',
      color: 'rgba(255, 140, 0, 0.6)',
      maxValue: 400.0,
    },
    {
      id: 'maintence',
      label: 'Manutenção',
      color: 'rgba(127, 125, 22, 0.6)',
      maxValue: 1500.0,
    },
    {
      id: 'uncategorized',
      label: 'Não Categorizado',
      color: 'rgba(255, 159, 64, 0.6)',
      maxValue: 0,
    },
    {
      id: 'gifts',
      label: 'Presentes',
      color: 'rgba(153, 102, 255, 0.6)',
      maxValue: 300.0,
    },
    {
      id: 'revenue',
      label: 'Receita',
      color: 'rgba(75, 192, 12, 0.6)',
      maxValue: 0,
    },
    {
      id: 'cash',
      label: 'Saque',
      color: 'rgba(255, 206, 86, 0.6)',
      maxValue: 100,
    },
    {
      id: 'health',
      label: 'Saúde',
      color: 'rgba(54, 162, 235, 0.6)',
      maxValue: 200.0,
    },
    {
      id: 'supermarket',
      label: 'Supermercado',
      color: 'rgba(255, 99, 132, 0.6)',
      maxValue: 1200.0,
    },
    {
      id: 'fuel',
      label: 'Transporte',
      color: 'rgba(65, 105, 225, 0.6)',
      maxValue: 600,
    },
    {
      id: 'tv',
      label: 'TV Internet',
      color: 'rgba(55, 99, 32, 0.6)',
      maxValue: 400.0,
    },
  ];

  async function fetchData(params) {
    // console.log(params);
    const { year, month, category } = params;
    // setLoading(true);
    const { data } = await axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/data/getData`,
      params: {
        year,
        month,
        category,
      },
    })
      .then((response) => response.data)
      .catch(function err(error) {
        if (error.response) {
          throw error.response;
        }
      });
    return data;
    // setSelectedMonth(data);
    // setLoading(false);
  }

  async function addNewExpense(obj) {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/data/create`, obj)
      .then((response) => {
        if (response.status === 200) {
          fetchData({
            year: obj.year,
            month: obj.month,
          }).then((updatedData) => {
            console.log(updatedData);
            setSelectedMonth(updatedData);
            setLoading(false);
            setMessage({
              severity: 'success',
              content: 'Cadastrado com sucesso!',
              show: true,
            });
          });
        } else {
          setMessage({
            severity: 'error',
            content: 'Erro ao cadastrar despesa',
            show: true,
          });
        }
      });
  }

  async function updateExpense(obj, id) {
    setLoading(true);
    await axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/api/data/update/${id}`, obj)
      .then((response) => {
        if (response.status === 200) {
          fetchData({
            year: obj.year,
            month: obj.month,
          }).then((updatedData) => {
            let newUpdatedData = global.structuredClone(updatedData);

            if (isCategoryFiltered) {
              const filteredExpenses = updatedData.expenses.filter(
                (e) => e.type === obj.type
              );
              newUpdatedData.expenses = filteredExpenses;
              setCurrentCategory(obj.type);
            }
            setSelectedMonth(newUpdatedData);
            setLoading(false);
            setMessage({
              severity: 'info',
              content: 'Atualizado com sucesso!',
              show: true,
            });
          });
        } else {
          setMessage({
            severity: 'error',
            content: 'Erro ao atualizar despesa',
            show: true,
          });
          setLoading(false);
        }
      });
  }

  const handleLoadData = async () => {
    setLoading(true);

    // set month object
    await axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/data/getMonths`,
    }).then((response) => {
      if (response.data.status === 200) {
        setArrMonths(response.data.arrMonths);
      }
    });

    // set category object
    const result = expensesType.map((a) => a.label);
    setArrCategory(result);

    //set expenses category
    const currentArrDate = new Date()
      .toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric',
      })
      .split(' ');

    await fetchData({
      year: currentArrDate[2],
      month:
        currentArrDate[0][0].toLocaleUpperCase() +
        currentArrDate[0].substring(1),
    })
      .then((expenseObj) => {
        setSelectedMonth(expenseObj);
      })
      .catch(function err(error) {
        setLoading(false);

        if (error.response.status === 500) {
          setMessage({
            severity: 'error',
            content: 'Problemas ao conectar com o backend',
            show: true,
          });
        } else {
          throw error.response;
        }
      });

    setLoading(false);
  };

  const handleChangeCategory = async (category) => {
    const filteredCategory = expensesType.filter(
      (item) => item.label === category
    );
    await fetchData({
      year: selectedMonth.year,
      month: selectedMonth.month,
      category:
        filteredCategory[0].id !== 'all_categories'
          ? filteredCategory[0].id
          : null,
    }).then((changedCategory) => {
      setSelectedMonth(changedCategory);
      setCurrentCategory(category);
      setLoading(false);
    });
  };

  const handleChangeMonth = async (month) => {
    setLoading(true);
    const dateObj = month.split('-').map((item) => item.trim());
    await fetchData({ year: dateObj[1], month: dateObj[0] }).then(
      (expenseForMonth) => {
        setSelectedMonth(expenseForMonth);
        setLoading(false);
        setCurrentCategory('');
      }
    );
  };

  const handleChangeYear = async (year) => {
    fetchData({ year });
    setCurrentCategory('');
  };

  async function deleteExpense(id) {
    const { month, year } = selectedMonth;

    await axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/api/data/delete/${id}`)
      .then((response) => {
        if (response.status === 200) {
          fetchData({
            year,
            month,
          }).then((updatedData) => {
            setSelectedMonth(updatedData);
            setLoading(false);
          });

          setMessage({
            severity: 'info',
            content: 'Deletado com sucesso!',
            show: true,
          });
        } else {
          setMessage({
            severity: 'error',
            content: 'Erro ao deletar despesa',
            show: true,
          });
        }
      });
  }

  const handleFilter = async (searchItem) => {
    setLoading(true);
    await fetchData({})
      .then((e) => {
        return e.expenses.filter((item) =>
          item.description?.toString().toLowerCase().includes(searchItem)
        );
      })
      .then((filteredValue) => {
        const categorySum = filteredValue.reduce((accumulator, object) => {
          return accumulator + object.value;
        }, 0);

        setSelectedMonth({
          difference: 0,
          expenses: filteredValue,
          totalExp: categorySum,
          totalRev: 0,
          pageInfo: 'Resultado da pesquisa',
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    handleLoadData();
  }, []);

  return (
    <MainContext.Provider
      value={{
        selectedMonth,
        handleChangeMonth,
        arrMonths,
        addNewExpense,
        updateExpense,
        handleLoadData,
        handleChangeYear,
        deleteExpense,
        loading,
        expensesType,
        handleChangeCategory,
        currentCategory,
        arrCategory,
        message,
        handleFilter,
        isCategoryFiltered,
        setIsCategoryFiltered,
        showTableView,
        setShowTableView,
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
