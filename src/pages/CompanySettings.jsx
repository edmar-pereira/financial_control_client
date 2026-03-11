import React, { useEffect, useState } from 'react';

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
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

import EditCompanyModal from './EditCompanyModal';

export default function CompanySettings() {
  const { setMessage, setLoading } = useAPI();
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  async function fetchData() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/category/getAllCategoryInfo`,
      );
      const { data } = response.data;
      setRows(data);
    } catch (error) {
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

  const visibleRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper>
      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Nome Fantasia</TableCell>
              <TableCell>Nome Empresa</TableCell>
              <TableCell>Tipo Pagamento</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.fantasyName}</TableCell>
                <TableCell>{row.companyName}</TableCell>
                <TableCell>{row.categoryId}</TableCell>

                <TableCell>
                  <IconButton onClick={() => setSelectedRow(row)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component='div'
        count={rows.length}
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
