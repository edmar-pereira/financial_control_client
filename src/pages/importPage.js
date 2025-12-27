import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
import Loader from '../components/loading';
import { useAPI } from '../context/mainContext';

export default function ImportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { setMessage, triggerReload, setImportedData, importedData } = useAPI();

  const [file, setFile] = useState(null);
  const [isImported, setIsImported] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [saving, setSaving] = useState(false);

  const isFormValid = importedData.every(
    (item) => item.description?.trim() !== ''
  );

  /* ================= FILE + IMPORT ================= */

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setImportLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setImportedData(response.data.data);
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

  const handleDescriptionChange = (e, index) => {
    const updated = [...editedData];
    updated[index].description = e.target.value;
    setEditedData(updated);
  };

  const handleDescriptionBlur = (index) => {
    const updatedImported = [...importedData];
    updatedImported[index].description = editedData[index].description;
    setImportedData(updatedImported);
  };

  const handleRemoveRow = (index) => {
    setImportedData(importedData.filter((_, i) => i !== index));
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/data/insertmany`,
        importedData
      );

      setMessage({
        severity: 'success',
        content: 'Dados salvos com sucesso!',
        show: true,
      });

      triggerReload();

      setTimeout(handleCancel, 800);
    } catch {
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
    setIsImported(false);
    setFile(null);
    navigate(-1);
  };

  useEffect(() => {
    if (isImported) {
      setEditedData(importedData);
    }
  }, [isImported, importedData]);

  /* ================= RENDER ================= */

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant='h5' gutterBottom>
          Importar dados
        </Typography>

        {/* INPUT FILE OCULTO */}
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

        {saving && (
          <Box sx={{ py: 4 }}>
            <Loader label='Salvando dados...' />
          </Box>
        )}

        {isImported && !importLoading && !saving && (
          <>
            <Typography variant='h6' gutterBottom>
              Revise os dados
            </Typography>

            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Desc. Inicial</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {importedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(row.date).toLocaleDateString('pt-BR')}
                      </TableCell>

                      <TableCell>{row.importedEntryType}</TableCell>
                      <TableCell>{row.fantasyName}</TableCell>

                      <TableCell>
                        <TextField
                          fullWidth
                          size='small'
                          value={editedData[index]?.description || ''}
                          onChange={(e) => handleDescriptionChange(e, index)}
                          onBlur={() => handleDescriptionBlur(index)}
                          error={!row.description?.trim()}
                        />
                      </TableCell>

                      <TableCell>
                        <ShiftedCurrencyInput
                          label='Valor'
                          value={Number(row.value) * 100}
                          onChange={(newCents) => {
                            const updated = [...importedData];
                            updated[index].value = (newCents / 100).toFixed(2);
                            setImportedData(updated);
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <SelectCategory
                          rowIndex={index}
                          selectedType={row.type}
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* RODAPÉ */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            mt: 3,
          }}
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
      </Paper>
    </Box>
  );
}
