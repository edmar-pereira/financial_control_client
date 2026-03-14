import React, { useEffect, useState, useMemo } from 'react';
import { useAPI } from '../context/mainContext';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  IconButton,
  TextField,
  Box,
  TableSortLabel,
  InputAdornment,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

import api from '../services/api';
import EditCompanyModal from './EditCompanyModal';

export default function CompanySettings() {
  const { setMessage, setLoading, arrCategories, setArrCategories } = useAPI();

  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [search, setSearch] = useState('');

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('fantasyName');

  function GetSelectedCategory(id) {
    const found = arrCategories?.find((c) => c.id === id);
    return found ? found.label : '';
  }

  async function fetchAllCategoryInfo() {
    try {
      setLoading(true);

      const response = await api.get('/api/category/getAllCategoryInfo');
      const { data } = response.data;

      setRows(data);
    } catch (error) {
      console.log(error);
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
  }

  useEffect(() => {
    fetchCategories();
    fetchAllCategoryInfo();
  }, []);

  /* ================= DELETE ================= */

  async function handleDelete(row) {
    const confirm = window.confirm(
      `Deseja realmente excluir ${row.fantasyName}?`,
    );

    if (!confirm) return;

    try {
      await api.delete(`/api/category/deleteCategoryInfo/${row._id}`);

      setMessage({
        severity: 'success',
        content: 'Empresa removida com sucesso',
        show: true,
      });

      fetchAllCategoryInfo();
    } catch (error) {
      console.error(error);

      setMessage({
        severity: 'error',
        content: 'Erro ao excluir empresa',
        show: true,
      });
    }
  }

  /* ================= FILTER ================= */

  const filteredRows = useMemo(() => {
    if (!search) return rows;

    const term = search.toLowerCase();

    return rows.filter((row) => {
      const category = GetSelectedCategory(row.categoryId).toLowerCase();

      return (
        row.fantasyName?.toLowerCase().includes(term) ||
        row.companyName?.toLowerCase().includes(term) ||
        category.includes(term)
      );
    });
  }, [rows, search, arrCategories]);

  /* ================= SORT ================= */

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
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilized.map((el) => el[0]);
  }

  const sortedRows = useMemo(() => {
    return stableSort(filteredRows, getComparator(order, orderBy));
  }, [filteredRows, order, orderBy]);

  const visibleRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /* ================= RENDER ================= */

  return (
    <Paper>
      {/* SEARCH */}
      <Box p={2}>
        <TextField
          fullWidth
          size='small'
          label='Pesquisar empresa'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          InputProps={{
            endAdornment: search && (
              <InputAdornment position='end'>
                <IconButton
                  size='small'
                  onClick={() => {
                    setSearch('');
                    setPage(0);
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* TABLE */}
      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'fantasyName'}
                  direction={orderBy === 'fantasyName' ? order : 'asc'}
                  onClick={() => handleSort('fantasyName')}
                >
                  Nome Fantasia
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'companyName'}
                  direction={orderBy === 'companyName' ? order : 'asc'}
                  onClick={() => handleSort('companyName')}
                >
                  Nome Empresa
                </TableSortLabel>
              </TableCell>

              <TableCell>Tipo Pagamento</TableCell>

              <TableCell align='right'>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row.fantasyName}</TableCell>

                <TableCell>{row.companyName}</TableCell>

                <TableCell>{GetSelectedCategory(row.categoryId)}</TableCell>

                <TableCell align='right'>
                  <IconButton onClick={() => setSelectedRow(row)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <TablePagination
        component='div'
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <EditCompanyModal
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
        reload={fetchAllCategoryInfo}
      />
    </Paper>
  );
}
