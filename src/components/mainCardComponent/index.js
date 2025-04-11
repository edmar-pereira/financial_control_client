import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns-tz';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import IconButton from '@mui/material/IconButton';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AvatarComponent from '../avatarComponent';
import Footer from '../../components/footer';

import { useAPI } from '../../context/mainContext';

export default function MainCardComponent() {
  const { deleteExpense, expensesType, arrCategories } = useAPI();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [totalRev, setTotalRev] = useState(0);
  const [totalExp, setTotalExp] = useState(0);
  const [difference, setDifference] = useState(0);

  async function fetchData(params) {
    console.log(params);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/data/getData`,
        params, // 🔹 Send as POST body
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { data } = response.data;

      console.log(data);
      // console.log(data);
      setTotalExp(data.totalExp);
      setTotalRev(data.totalRev);
      setDifference(data.difference);

      // setRows(data.expenses);
      setExpenses(data.expenses);

      return data;
    } catch (error) {
      console.log(error.response.data.error);
      if (error.response) {
        setMessage({
          severity: 'error',
          content: error.response.data.error,
          show: true,
        });
      }
      return null; // optional: return null if error happens
    }
  }

  function DateFormat(dateToFormat) {
    return format(new Date(dateToFormat), 'dd/MM/yyyy', { timeZone: 'UTC' });
  }

  function MoneyFormat(valueToFormat) {
    return valueToFormat.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function getCategoryInfo(categoryIdOrLabel) {
    if (!arrCategories || arrCategories.length === 0) return null;

    return arrCategories.find(
      (item) =>
        item.id === categoryIdOrLabel || item.label === categoryIdOrLabel
    );
  }

  const getExtpenses = async () => {
    await fetchData({
      startDate: new Date().toISOString().substring(0, 10),
      categoryIds: '',
    });
  };

  useEffect(() => {
    // getCategory();
    getExtpenses();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }} alignItems='center'>
      {expenses?.map((data) => {
        const categoryInfo = getCategoryInfo(data.categoryId);
        return (
          <List
            key={data._id}
            sx={{
              bgcolor: 'background.paper',
              // maxWidth: '650px',
              margin: 'auto',
            }}
          >
            <ListItem
              style={{
                backgroundColor: categoryInfo?.color || '#ccc', // fallback color
                paddingLeft: '5px',
              }}
              disabled={data?.ignore}
              secondaryAction={
                <div>
                  <IconButton
                    edge='end'
                    aria-label='Edit'
                    id={data._id}
                    onClick={() => {
                      navigate(`add_expense/${data._id}`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge='end'
                    aria-label='Delete'
                    id={data._id}
                    onClick={(e) =>
                      deleteExpense(e.currentTarget.id, data.month, data.year)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              }
            >
              <Box sx={{ m: 2 }}>{AvatarComponent(data.categoryId)}</Box>

              <ListItemText
                primary={`${data.description} - ${MoneyFormat(data.value)}`}
                secondary={`${
                  categoryInfo?.label || 'Categoria não encontrada'
                } - ${DateFormat(data.date)}${
                  data?.ignore ? ' - Ignorado' : ''
                }${
                  data?.installments !== undefined
                    ? ' - ' + data.installments
                    : ''
                }`}
              />
            </ListItem>
          </List>
        );
      })}
      <Footer totalRev={totalRev} totalExp={totalExp} difference={difference} />
    </Box>
  );
}
