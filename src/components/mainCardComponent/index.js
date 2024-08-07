import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns-tz';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import IconButton from '@mui/material/IconButton';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AvatarComponent from '../avatarComponent';

import { useAPI } from '../../context/mainContext';

export default function MainCardComponent() {
  const { deleteExpense, expensesType, selectedMonth } = useAPI();
  const navigate = useNavigate();

  function DateFormat(dateToFormat) {
    return format(new Date(dateToFormat), 'dd/MM/yyyy', { timeZone: 'UTC' });
  }

  function GetColor(category) {
    const colorObj = expensesType.filter((item) => item.id === category);
    return colorObj[0].color;
  }1

  function MoneyFormat(valueToFormat) {
    return valueToFormat.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  const { month, year, expenses, pageInfo } = selectedMonth;

  return (
    <Box sx={{ flexGrow: 1 }} alignItems='center'>
      {expenses?.map((data) => {
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
                backgroundColor: GetColor(data.avatarType),
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
                    onClick={(e) => deleteExpense(e.currentTarget.id, data.month, data.year)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              }
            >
              <Box sx={{ m: 2 }}>{AvatarComponent(data.avatarType)}</Box>

              <ListItemText
                primary={`${data.description} - ${MoneyFormat(data.value)}`}
                secondary={`${data.type} - ${DateFormat(data.date)}${
                  data?.ignore ? ' - Ignorado' : ' '
                }  ${
                  data?.installments !== undefined
                    ? ' - ' + data?.installments
                    : ''
                }`}
              />
            </ListItem>
          </List>
        );
      })}
    </Box>
  );
}
