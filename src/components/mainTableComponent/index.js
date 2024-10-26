import * as React from 'react';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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

import BarChart from '../charts/barChart';
import { TrendingUp } from '@material-ui/icons';

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
  const [searchValue, setSearchedValue] = React.useState('');

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
          sx={{ m: 1, width: '200px' }}
          variant='outlined'
          size='small'
        >
          <OutlinedInput
            id='outlined-adornment-filter'
            type={'text'}
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
  numSelected: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleFilter: PropTypes.func.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(TrendingUp);
  const [rows, setRows] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const navigate = useNavigate();

  const {
    deleteExpense,
    expensesType,
    selectedMonth,
    handleLoadData,
    currentCategory,
    setIsCategoryFiltered,
  } = useAPI();

  // const [searched, setSearched] = React.useState('');

  const [userData, setUserData] = React.useState({
    labels: [],
    datasets: [
      {
        label: 'Despesas',
        data: [],
        backgroundColor: [],
      },
    ],
  });

  const GetExpVal = async () => {
    let arrTotals = [];
    let arrColors = [];
    let arrLabels = [];

    const categories = await expensesType.filter(
      (category) =>
        category.id !== 'credit_card' &&
        category.id !== 'revenue' &&
        category.id !== 'all_categories' &&
        category.id !== 'uncategorized' &&
        category.id !== 'stocks' &&
        category.id !== 'children'
    );

    function getColor(percentageToSearch) {
      let colorSearched = '';
      if (percentageToSearch <= 0) {
        colorSearched = '#f44336';
      } else if (percentageToSearch <= 50) {
        colorSearched = '#4caf50';
      } else if (percentageToSearch <= 100) {
        colorSearched = '#ffc107';
      } else if (percentageToSearch > 100) {
        colorSearched = '#f44336';
      }
      return colorSearched;
    }

    async function getSum(item) {
      const objTotal = {};
      const dataFiltered = await selectedMonth.expenses.filter(
        (e) => e.type === item.label
      );

      const categorySum = await dataFiltered.reduce((accumulator, object) => {
        return accumulator + object.value;
      }, 0);

      const percentage = isFinite(
        ((categorySum / item.maxValue) * 100).toFixed(1)
      )
        ? ((categorySum / item.maxValue) * 100).toFixed(1)
        : '0';

      const color = getColor(percentage);

      return {
        categorySum,
        percentage:
          percentage !== 'NaN' || percentage !== 'Infinity' ? percentage : 0,
        color,
        category: item.label,
      };
    }

    const getWithPromiseAll = async () => {
      // console.time('promise all');

      let data = await Promise.all(
        categories.map(async (uniqueLabel) => {
          const result = await getSum(uniqueLabel);
          arrTotals.push(result.categorySum);
          arrColors.push(result.color);
          arrLabels.push(result.category + ' ' + result.percentage + '%');
        })
      );
      // console.timeEnd('promise all');
      setUserData({
        labels: arrLabels,
        datasets: [
          {
            label: 'Gastos ',
            data: arrTotals,
            backgroundColor: arrColors,
          },
        ],
      });
    };

    getWithPromiseAll();
  };

  React.useEffect(() => {
    if (selectedMonth.expenses) {
      setRows(selectedMonth.expenses);
      GetExpVal();
    }
  }, [selectedMonth.expenses]);

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

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleDelete = (event, id) => {
    id.map((item) => {
      deleteExpense(item);
    });
    setSelected([]);
  };

  const handleEdit = (event, id) => {
    if (currentCategory === '' || currentCategory === 'Todas') {
      setIsCategoryFiltered(false);
    } else {
      setIsCategoryFiltered(true);
    }
    navigate(`add_expense/${id}`);
  };

  // React.useEffect(() => {
  //   console.log(selectedMonth.expenses);
  //   if (!selectedMonth.expenses) {
  //     handleLoadData();
  //   }
  //   //
  // }, []);

  const handleFilter = (searchParam) => {
    if (searchParam.length > 0) {
      const filteredData = selectedMonth.expenses.filter(
        (item) =>
          (item.type && item.type.toLowerCase().includes(searchParam.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(searchParam.toLowerCase())) ||
          (item.value && item.value.toString().includes(searchParam.toLowerCase()))
      );
      setRows(filteredData);
    } else {
      setRows(selectedMonth.expenses);
    }
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
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
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
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
                    <TableCell align='left'>{MoneyFormat(row.value)}</TableCell>
                    <TableCell align='left'>{DateFormat(row.date)}</TableCell>
                    <TableCell align='left'>{row.type}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[15, 30, 50, 100]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Espaçamento'
      />

      <Paper sx={{ width: '100%', mb: 2 }}>
        <BarChart chartData={userData} />
      </Paper>
    </Box>
  );
}
