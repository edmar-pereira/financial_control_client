import React, { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'debounce';
import axios from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { NumericFormatCustom } from '../numericFormatCustom';
import SelectCategory from '../selectCategory';
import { useAPI } from '../../context/mainContext';

const ImportModal = ({ open, onClose }) => {
  const { setMessage, triggerReload, setImportedData, importedData } = useAPI();
  const [file, setFile] = useState(null);
  const [isImported, setIsImported] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = importedData.every(
    (item) => item.description.trim() !== ''
  );

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      setMessage({
        severity: 'info',
        content: 'Favor escolher o arquivo a ser importado!',
        show: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setImportedData(response.data.data);
      setIsImported(true);
      setMessage({
        severity: 'success',
        content: 'Arquivo importado com sucesso',
        show: true,
      });
    } catch (error) {
      setMessage({
        severity: 'error',
        content: `Erro ao importar o arquivo:' ${error}`,
        show: true,
      });
      console.error('Erro ao importar o arquivo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (e, index) => {
    const updatedData = [...importedData];
    updatedData[index].value = e.target.value;
    setImportedData(updatedData);
  };

  const debouncedSetDescription = useMemo(
    () =>
      debounce((index, value) => {
        const updatedData = [...importedData];
        updatedData[index].description = value;
        setImportedData(updatedData);
      }, 300),
    [importedData]
  );

  const handleDescriptionChange = (e, index) => {
    debouncedSetDescription(index, e.target.value);
  };

  const handleRemoveRow = (index) => {
    const updatedData = importedData.filter((_, i) => i !== index);
    setImportedData(updatedData);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/data/insertmany`,
        importedData
      );

      if (response.status === 200) {
        setMessage({
          severity: 'success',
          content: 'Dados salvos com sucesso!',
          show: true,
        });
        handleClose(); // Close modal after success
        triggerReload();
      } else {
        setMessage({
          severity: 'error',
          content: 'Erro ao salvar os dados',
          show: true,
        });
      }
    } catch (error) {
      setMessage({
        severity: 'error',
        content: 'Erro ao salvar os dados',
        show: true,
      });
    }
  };

  const handleClose = () => {
    setImportedData([]);
    setIsImported(false);
    setFile(null);
    onClose();
  };

  // const getCategory = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/data/getCategory/`,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       const { data } = response.data;
  //       const filteredCategories = data.filter(
  //         (item) => item.id !== 'all_categories'
  //       );
  //       setArrCategories(filteredCategories);
  //     }
  //   } catch (err) {
  //     if (err.response) {
  //       setMessage(err.response.data.error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const invalidIndexes = importedData
  //     .map((row, index) => (row.description.trim() === '' ? index : null))
  //     .filter((index) => index !== null);

  //   setInvalidDescriptionIndexes(invalidIndexes);

  //   if (invalidIndexes.length > 0) {
  //     setMessage({
  //       severity: 'info',
  //       content: `Favor preencher as descrições nas linhas: ${invalidIndexes.join(', ')}`,
  //       show: true,
  //     });
  //   }
  // }, [importedData, setMessage]);

  // useEffect(() => {
  //   if (open && importedData.length > 0) {
  //     getCategory();
  //   }
  // }, [open, importedData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={isImported ? 'xl' : 'xl'}
      fullWidth={isImported}
    >
      <DialogTitle>Importar extrato xlsx</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button variant='contained' component='label'>
            Escolha seu arquivo
            <input
              type='file'
              accept='.xlsx, .xls'
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {file && <span>{file.name}</span>}
        </div>

        {loading && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <CircularProgress />
            <p>Importando arquivo...</p>
          </div>
        )}

        {isImported && !loading && (
          <>
            <h3>Revise os dados</h3>
            <TableContainer style={{ maxHeight: '400px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell style={{ width: '25%' }}>
                      Desc. Inicial
                    </TableCell>
                    <TableCell style={{ width: '25%' }}>Descrição</TableCell>
                    <TableCell>Valor gasto</TableCell>
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
                          value={row.description}
                          onChange={(e) => handleDescriptionChange(e, index)}
                          variant='outlined'
                          size='small'
                          error={row.description.trim() === ''}
                          helperText={
                            row.description.trim() === ''
                              ? 'Descrição não pode estar vazia.'
                              : ''
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={row.value}
                          onChange={(e) => handleValueChange(e, index)}
                          variant='outlined'
                          size='small'
                          InputProps={{
                            inputComponent: NumericFormatCustom,
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
                          onClick={() => handleRemoveRow(index)}
                          sx={{ '&:hover': { color: 'red' } }}
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
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color='secondary'
          variant='contained'
          sx={{ backgroundColor: 'red' }}
        >
          Cancelar
        </Button>
        {isImported ? (
          <Button
            onClick={handleSave}
            color='primary'
            variant='contained'
            sx={{ backgroundColor: 'green' }}
            disabled={!isFormValid}
          >
            Salvar
          </Button>
        ) : (
          <Button
            onClick={handleImport}
            color='primary'
            variant='contained'
            disabled={loading}
          >
            Importar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export { ImportModal };
