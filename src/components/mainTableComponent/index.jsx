import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Stack,
  OutlinedInput,
  FormControl,
  InputAdornment,
  TablePagination,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';

import { useAPI } from '../../context/mainContext';
import SelectMonth from '../SelectMonth';
import SelectCategory from '../SelectCategory';
import Footer from '../Footer';
import BarChart from '../charts/BarChart';

/* ================= HELPERS ================= */

function DateFormat(date) {
  if (!date) return '';

  // If it's ISO string
  const dateStr =
    typeof date === 'string'
      ? date.slice(0, 10)
      : date.toISOString().slice(0, 10);

  const [year, month, day] = dateStr.split('-');

  return `${day}/${month}/${year}`;
}

function MoneyFormat(value) {
  return value.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

/* ================= TABLE HEAD ================= */

const headCells = [
  { id: 'fantasyName', label: 'Nome Fantasia' },
  { id: 'name', label: 'Nome Empresa' },
  { id: 'description', label: 'Descrição' },
  { id: 'value', label: 'Valor' },
  { id: 'installments', label: 'Parcelamento' },
  { id: 'date', label: 'Data' },
  { id: 'type', label: 'Tipo de despesa' },
  { id: 'paymentType', label: 'Tipo de Pagamento' },
];

function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort,
  rowCount,
  numSelected,
  onSelectAllClick,
}) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={(e) => onRequestSort(e, headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

/* ================= MAIN VIEW ================= */

export default function MainView() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const {
    selectedCategory,
    setSelectedCategory,
    selectedDate,
    setSelectedDate,
    arrCategories,
    setMessage,
    reloadKey,
    triggerReload,
    setLoading,
    setCurrentMonth,
    setArrCategories,
  } = useAPI();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [originalData, setOriginalData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [totalRev, setTotalRev] = useState(0);
  const [totalExp, setTotalExp] = useState(0);
  const [difference, setDifference] = useState(0);

  /* ================= DATA ================= */

  async function fetchData(params) {
    try {
      setLoading(true);

      const response = await api.post('/api/data/getData', params);

      const { data } = response.data;

      setOriginalData(data);
      setRows(data.expenses);
      setCurrentMonth(data);
      setTotalExp(data.totalExp);
      setTotalRev(data.totalRev);
      setDifference(data.difference);
    } catch (error) {
      setMessage({
        severity: 'error',
        content: 'Erro ao carregar dados',
        show: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await api.get('/api/category/getCategory');

      if (response.data.status === 200) {
        const { data } = response.data;

        const sortedData = data
          .filter((item) => item.label) // remove itens sem label
          .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

        setArrCategories(sortedData);
      } else {
        setMessage({
          severity: 'error',
          content: 'Erro ao carregar categorias',
          show: true,
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        severity: 'error',
        content: 'Erro ao carregar categorias',
        show: true,
      });
    }
  }

  useEffect(() => {
    if (!arrCategories || arrCategories.length === 0) {
      fetchCategories();
    }
  }, []);

  useEffect(() => {
    setSearchText('');
    const date = selectedDate ? new Date(selectedDate) : new Date();
    fetchData({
      startDate: date.toISOString().substring(0, 10),
      categoryIds:
        selectedCategory === 'all_categories' ? '' : selectedCategory,
    });
  }, [selectedDate, selectedCategory, reloadKey]);

  /* ================= FILTER ================= */

  function GetSelectedCategory(id) {
    const found = arrCategories?.find((c) => c.id === id);
    return found ? found.label : '';
  }

  const handleFilter = (value) => {
    const search = value.replace(/[.,]/g, '').toLowerCase();

    if (!search) {
      setRows(originalData.expenses);
      return;
    }

    const filtered = originalData.expenses.filter((item) => {
      console.log(item);
      const category = GetSelectedCategory(item.categoryId).toLowerCase();
      const desc = item.description?.toLowerCase() || '';
      const val = String(item.value).replace(/[.,]/g, '');
      const fantasyName = item.fantasyName?.toLowerCase() || '';
      const name = item.name?.toLowerCase() || '';
      const paymentType = item.paymentType?.toLowerCase() || '';

      return (
        category.includes(search) ||
        desc.includes(search) ||
        val.includes(search) ||
        fantasyName.includes(search) ||
        name.includes(search) ||
        paymentType.includes(search)
      );
    });

    setRows(filtered);
  };

  /* ================= TABLE ================= */

  const visibleRows = useMemo(() => {
    return stableSort(rows, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [rows, order, orderBy, page, rowsPerPage]);

  /* ================= RENDER ================= */

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ mb: 2 }}>
        {/* 🔥 FILTER BAR — TUDO NA MESMA LINHA */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 2,
            py: 1,
            flexWrap: 'wrap',
          }}
        >
          <SelectMonth
            currentDate={selectedDate}
            handleChangeDate={setSelectedDate}
          />

          <Box
            sx={{
              width: { xs: '100%', sm: 220 },
              flexShrink: 0,
            }}
          >
            <SelectCategory
              selectedType={selectedCategory}
              onChange={setSelectedCategory}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <FormControl
            size='small'
            sx={{
              width: { xs: '100%', sm: 260 },
            }}
          >
            <OutlinedInput
              placeholder='Pesquisar'
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                handleFilter(e.target.value);
              }}
              endAdornment={
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>

          {selected.length > 0 && (
            <Stack direction='row'>
              <Tooltip title='Editar'>
                <IconButton
                  disabled={selected.length > 1}
                  onClick={() => navigate(`add_expense/${selected[0]}`)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title='Excluir'>
                <IconButton
                  onClick={() => {
                    selected.forEach((id) =>
                      api.delete(`/api/data/delete/${id}`),
                    );
                    setSelected([]);
                    triggerReload();
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Box>

        {/* TABLE */}
        <TableContainer>
          <Table size='small'>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={(e, p) => {
                const isAsc = orderBy === p && order === 'asc';
                setOrder(isAsc ? 'desc' : 'asc');
                setOrderBy(p);
              }}
              numSelected={selected.length}
              rowCount={rows.length}
              onSelectAllClick={(e) =>
                setSelected(e.target.checked ? rows.map((r) => r._id) : [])
              }
            />

            <TableBody>
              {visibleRows.map((row) => {
                const isItemSelected = selected.includes(row._id);
                return (
                  <TableRow
                    hover
                    key={row._id}
                    selected={isItemSelected}
                    onClick={() =>
                      setSelected((prev) =>
                        prev.includes(row._id)
                          ? prev.filter((i) => i !== row._id)
                          : [...prev, row._id],
                      )
                    }
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox checked={isItemSelected} />
                    </TableCell>
                    <TableCell>{row.fantasyName}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{MoneyFormat(row.value)}</TableCell>
                    <TableCell>
                      {row.totalInstallment > 1
                        ? `${row.currentInstallment} de ${row.totalInstallment}`
                        : ''}
                    </TableCell>
                    <TableCell>{DateFormat(row.date)}</TableCell>
                    <TableCell>{GetSelectedCategory(row.categoryId)}</TableCell>
                    <TableCell>{row.paymentType}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </Paper>

      <Paper sx={{ mb: 2 }}>
        <BarChart transactions={rows} categories={arrCategories} />
      </Paper>

      <Footer totalRev={totalRev} totalExp={totalExp} difference={difference} />
    </Box>
  );
}
