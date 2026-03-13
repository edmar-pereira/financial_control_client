import React, { useState, useRef } from 'react';
import api from '../services/api';
import {
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';

import {
  Delete as DeleteIcon,
  UploadFile as UploadFileIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

import ShiftedCurrencyInput from '../components/ShiftedCurrencyInput';
import SelectCategory from '../components/selectCategory';
import DuplicatedRowsDialog from '../components/DuplicatedRowsDialog';
import Loader from '../components/loading';
import { useAPI } from '../context/mainContext';

export default function ImportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { setMessage, triggerReload, setImportedData, importedData } = useAPI();

  const [file, setFile] = useState(null);
  const [isImported, setIsImported] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [duplicatedRows, setDuplicatedRows] = useState([]);
  const [showDuplicatedDialog, setShowDuplicatedDialog] = useState(false);

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  /* ================= VALIDATION ================= */

  const isFormValid =
    importedData.length > 0 && importedData.every((item) => item.name?.trim());

  /* ================= FILE + IMPORT ================= */

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setDuplicatedRows([]);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setImportLoading(true);

      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const sorted = [...response.data.data].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );

      // console.log(JSON.stringify(sorted));

      setImportedData(sorted);
      setIsImported(true);

      setMessage({
        severity: 'success',
        content: 'Arquivo importado com sucesso',
        show: true,
      });
    } catch {
      setMessage({
        severity: 'error',
        content: 'Erro ao importar o arquivo',
        show: true,
      });
    } finally {
      setImportLoading(false);
    }
  };

  /* ================= EDIT ================= */

  const updateRow = (index, field, value) => {
    setImportedData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveRow = (index) => {
    setImportedData((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await api.post('/api/data/insertmany', importedData);

      // console.log(res.data.data);
      const { inserted, updated } = res.data.data;

      setMessage({
        severity: 'success',
        content: `
        Importação concluída:
        ${inserted} inseridos
        ${updated} atualizados
      `,
        show: true,
      });

      triggerReload();
      setTimeout(handleCancel, 800);
    } catch (err) {
      console.error(err);
      setMessage({
        severity: 'error',
        content: 'Erro ao salvar os dados',
        show: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setImportedData([]);
    setDuplicatedRows([]);
    setIsImported(false);
    setFile(null);
    navigate(-1);
  };

  /* ================= RENDER ================= */

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant='h5' gutterBottom>
          Importar dados
        </Typography>

        <input
          ref={fileInputRef}
          type='file'
          accept='.xlsx,.xls,.csv'
          hidden
          onChange={handleFileChange}
        />

        {importLoading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography>Importando arquivo...</Typography>
          </Box>
        )}

        {saving && <Loader label='Salvando dados...' />}

        {duplicatedRows.length > 0 && (
          <Alert severity='warning' sx={{ my: 2 }}>
            {duplicatedRows.length} registros duplicados foram ignorados.
          </Alert>
        )}

        {isImported && !importLoading && !saving && (
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Nome Fantasia</TableCell>
                  <TableCell>Nome da Empresa</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Parcela</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {importedData.map((row, index) => {
                  // console.log('ROW:', index, row);

                  return (
                    <TableRow key={`${row.date}-${row.fantasyName}-${index}`}>
                      <TableCell>{formatDate(row.date)}</TableCell>

                      <TableCell>{row.paymentType}</TableCell>

                      <TableCell>{row.fantasyName}</TableCell>

                      <TableCell>
                        <TextField
                          fullWidth
                          size='small'
                          value={row.name || ''}
                          onChange={(e) =>
                            updateRow(index, 'name', e.target.value)
                          }
                          error={!row.name?.trim()}
                          helperText={
                            !row.name?.trim() ? 'Campo obrigatório' : ''
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          fullWidth
                          size='small'
                          value={row.description || ''}
                          onChange={(e) =>
                            updateRow(index, 'description', e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <ShiftedCurrencyInput
                          value={Number(row.value) * 100}
                          onChange={(cents) =>
                            updateRow(index, 'value', (cents / 100).toFixed(2))
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {row.totalInstallment > 1 ? (
                          <Typography variant='body2'>
                            {row.currentInstallment} / {row.totalInstallment}
                          </Typography>
                        ) : (
                          <Typography variant='body2' color='text.secondary'>
                            À vista
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <SelectCategory
                          rowIndex={index}
                          selectedType={row.categoryId}
                          onChange={(value) =>
                            updateRow(index, 'categoryId', value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <IconButton
                          size='small'
                          onClick={() => handleRemoveRow(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}
        >
          {!isImported && (
            <Button
              size='small'
              variant='outlined'
              startIcon={<UploadFileIcon />}
              onClick={handleImportClick}
            >
              Importar
            </Button>
          )}

          <Button
            size='small'
            variant='outlined'
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancelar
          </Button>

          {isImported && (
            <Button
              size='small'
              variant='contained'
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!isFormValid}
            >
              Salvar
            </Button>
          )}
        </Box>
        <DuplicatedRowsDialog
          open={showDuplicatedDialog}
          duplicatedRows={duplicatedRows}
          onClose={() => {
            setShowDuplicatedDialog(false);
            triggerReload();
            handleCancel();
          }}
        />
      </Paper>
    </Box>
  );
}
