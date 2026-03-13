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
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import api from '../services/api';
import EditCompanyModal from './EditCompanyModal';

export default function CompanySettings() {
  const { setMessage, setLoading, arrCategories } = useAPI();

  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [search, setSearch] = useState('');

  function GetSelectedCategory(id) {
    const found = arrCategories?.find((c) => c.id === id);
    return found ? found.label : '';
  }

  async function fetchData() {
    try {
      const response = await api.get('/api/category/getAllCategoryInfo');
      const { data } = response.data;
      setRows(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setMessage({
        severity: 'error',
        content: 'Erro ao carregar dados',
        show: true,
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // DELETE
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

      fetchData();
    } catch (error) {
      console.error(error);

      setMessage({
        severity: 'error',
        content: 'Erro ao excluir empresa',
        show: true,
      });
    }
  }

  // 🔎 filtro de pesquisa
  const filteredRows = useMemo(() => {
    if (!search) return rows;

    const term = search.toLowerCase();

    return rows.filter(
      (row) =>
        row.fantasyName?.toLowerCase().includes(term) ||
        row.companyName?.toLowerCase().includes(term) ||
        row.categoryId?.toLowerCase().includes(term),
    );
  }, [rows, search]);

  const visibleRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper>
      {/* 🔎 campo de pesquisa */}
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
        />
      </Box>

      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Nome Fantasia</TableCell>
              <TableCell>Nome Empresa</TableCell>
              <TableCell>Tipo Pagamento</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.fantasyName}</TableCell>
                <TableCell>{row.companyName}</TableCell>
                <TableCell>{GetSelectedCategory(row.categoryId)}</TableCell>

                <TableCell align="right">
                  <IconButton onClick={() => setSelectedRow(row)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    // color="error"
                    onClick={() => handleDelete(row)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component='div'
        count={filteredRows.length}
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
        reload={fetchData}
      />
    </Paper>
  );
}