import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import Stack from '@mui/material/Stack';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { format } from 'date-fns-tz';
import { useAPI } from '../../context/mainContext';
import { useNavigate } from 'react-router-dom';

import SelectMonth from '../../components/selectMonth';
import SelectCategory from '../../components/selectCategory';
import Footer from '../../components/footer';

import BarChart from '../charts/barChart';
import axios from 'axios';

const headCells = [
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Descrição',
  },
  {
    id: 'value',
    numeric: false,
    disablePadding: false,
    label: 'Valor',
  },
  {
    id: 'installments',
    numeric: false,
    disablePadding: false,
    label: 'Parcelamento',
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Data',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Tipo de despesa',
  },
  // {
  //   id: 'ignore',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Ignorar',
  // },
];

function DateFormat(dateToFormat) {
  return format(new Date(dateToFormat), 'dd/MM/yyyy', { timeZone: 'UTC' });
}

function MoneyFormat(valueToFormat) {
  return valueToFormat.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => {
          return (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, handleDelete, handleEdit, handleFilter } = props;
  const [searchValue, setSearchedValue] = useState('');

  const createDeleteHandler = (property) => (event) => {
    handleDelete(event, property);
  };

  const createEditHandler = (property) => (event) => {
    handleEdit(event, property);
  };

  const createFilterHandler = (value) => {
    setSearchedValue(value);
    handleFilter(value);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected.length > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected.length > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected.length > 0 ? numSelected.length + ' selecionados' : ''}
        </Typography>
      ) : (
        <FormControl
          variant='outlined'
          size='small'
          sx={{
            width: { xs: '100%', sm: '200px', lg: '270px' },
            m: { xs: 0, sm: 1 },
          }}
        >
          <OutlinedInput
            id='outlined-adornment-filter'
            type='text'
            onChange={(e) => createFilterHandler(e.target.value)}
            placeholder='Pesquisa'
            value={searchValue}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='handle filter event'
                  onClick={() => createFilterHandler('')}
                  edge='end'
                >
                  {searchValue !== '' ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            }
            label=''
          />
        </FormControl>
      )}

      {numSelected.length > 0 ? (
        <Stack alignItems='center' direction='row' gap={0}>
          <Tooltip title='Edit'>
            <IconButton
              onClick={createEditHandler(numSelected)}
              disabled={numSelected.length > 1}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Delete'>
            <IconButton onClick={createDeleteHandler(numSelected)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : null}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleFilter: PropTypes.func.isRequired,
};

export default function MainView() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [originalData, setOriginalData] = useState([]); // holds unfiltered data
  const [rows, setRows] = useState([]); // filtered version
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [arrCategories, setArrCategories] = useState([]);
  const [totalRev, setTotalRev] = useState(0);
  const [totalExp, setTotalExp] = useState(0);
  const [difference, setDifference] = useState(0);
  const navigate = useNavigate();

  const {
    selectedCategory,
    setSelectedCategory,
    selectedDate,
    setSelectedDate,
    setMessage,
    reloadKey,
    triggerReload,
  } = useAPI();

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    return stableSort(rows, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [order, orderBy, page, rowsPerPage, rows]);

  async function deleteData(id) {
    await axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/api/data/delete/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setMessage({
            severity: 'info',
            content: 'Deletado com sucesso!',
            show: true,
          });
          triggerReload();
        } else {
          setMessage({
            severity: 'error',
            content: 'Erro ao deletar despesa',
            show: true,
          });
        }
      });
  }

  async function fetchData(params) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/data/getData`,
        params,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { data } = response.data;
      setTotalExp(data.totalExp);
      setTotalRev(data.totalRev);
      setDifference(data.difference);
      setOriginalData(data);
      setRows(data.expenses);

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
      return null;
    }
  }

  async function fetchCategory() {
    try {
      const response = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BACKEND_URL}/api/data/getCategory/`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const { data } = response.data;
        return data;
      } else {
        console.log(error);
      }
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.error);
      }
      return null;
    }
  }

  function GetSelectedCategory(currCategory) {
    const safeCategories = arrCategories || [];

    try {
      const filteredCategory = safeCategories.filter(
        (item) => item.id === currCategory
      );

      return filteredCategory.length > 0
        ? filteredCategory[0].label
        : 'Categoria não encontrada';
    } catch (err) {
      console.error('Erro ao buscar categoria:', currCategory, err);
      return 'Erro';
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (event, id) => {
    id.map((item) => {
      deleteData(item);
    });
    setSelected([]);
  };

  const handleEdit = (event, id) => {
    navigate(`add_expense/${id}`);
  };

  const handleChangeDate = useCallback((newDate) => {
    setSelectedDate(newDate);
  }, []);

  const handleFilter = (searchParam) => {
    const normalizedSearchParam = searchParam
      .replace(/\[\.,]/g, '')
      .toLowerCase();

    if (normalizedSearchParam.length > 0) {
      const filteredData = originalData.expenses.filter((item) => {
        const filteredCategory = GetSelectedCategory(item.categoryId);

        const normalizedType = filteredCategory
          ? filteredCategory.replace(/\[\.,]/g, '').toLowerCase()
          : '';
        const normalizedDescription = item.description
          ? item.description.replace(/\[\.,]/g, '').toLowerCase()
          : '';
        const normalizedValue = item.value
          ? item.value.toString().replace(/\[\.,]/g, '')
          : '';

        return (
          normalizedType.includes(normalizedSearchParam) ||
          normalizedDescription.includes(normalizedSearchParam) ||
          normalizedValue.includes(normalizedSearchParam)
        );
      });

      setRows(filteredData);
    } else {
      setRows(originalData.expenses);
    }
  };

  const getExtpenses = async () => {
    const currentMonth = await fetchData({
      startDate: new Date().toISOString().substring(0, 10),
      categoryIds: '',
    });
  };

  const getCategory = async () => {
    const categoryResponse = await fetchCategory();
    setArrCategories(categoryResponse);
    setSelectedCategory('');
  };

  useEffect(() => {
    if (selectedDate !== '') {
      fetchData({
        startDate: selectedDate.substring(0, 10),
        categoryIds:
          selectedCategory === 'all_categories' ? '' : selectedCategory,
      });
    }
  }, [selectedCategory, selectedDate, reloadKey]);

  useEffect(() => {
    getCategory();
    getExtpenses();
  }, []);

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            px: 2,
            py: 1,
          }}
        >
          <SelectMonth
            currentDate={new Date()}
            handleChangeDate={handleChangeDate}
          />
          {arrCategories && selectedCategory !== undefined && (
            <SelectCategory />
          )}
        </Box>
        <EnhancedTableToolbar
          numSelected={selected}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleFilter={handleFilter}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 650 }}
            aria-labelledby='tableTitle'
            size={'small'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length || 0}
            />
            <TableBody>
              {visibleRows.length > 0 ? (
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='primary'
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell align='left'>{row.description}</TableCell>
                      <TableCell align='left'>
                        {MoneyFormat(row.value)}
                      </TableCell>
                      <TableCell align='left'>
                        {row.currentInstallment !== undefined &&
                        row.totalInstallment !== undefined &&
                        !(
                          row.currentInstallment === 1 &&
                          row.totalInstallment === 1
                        )
                          ? `${row.currentInstallment} de ${row.totalInstallment}`
                          : ''}
                      </TableCell>
                      <TableCell align='left'>{DateFormat(row.date)}</TableCell>
                      <TableCell align='left'>
                        {GetSelectedCategory(row.categoryId)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    Nenhum dado carregado
                  </TableCell>
                </TableRow>
              )}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[15, 30, 50, 100]}
          component='div'
          count={rows?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <BarChart transactions={rows} categories={arrCategories} />
      </Paper>

      <Footer totalRev={totalRev} totalExp={totalExp} difference={difference} />
    </Box>
  );
}
