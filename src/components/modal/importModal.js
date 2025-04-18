import React, { useState, useEffect } from 'react';
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
import Loader from '../loading';

const ImportModal = ({ open, onClose }) => {
  const { setMessage, triggerReload, setImportedData, importedData } = useAPI();
  const [file, setFile] = useState(null);
  const [isImported, setIsImported] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [saving, setSaving] = useState(false);

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
      setImportLoading(true);
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
      setImportLoading(false);
    }
  };

  const handleValueChange = (e, index) => {
    const updatedData = [...importedData];
    updatedData[index].value = e.target.value;
    setImportedData(updatedData);
  };

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
    const updatedData = importedData.filter((_, i) => i !== index);
    setImportedData(updatedData);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

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

        triggerReload();

        // Delay modal close so user sees success + loader
        setTimeout(() => {
          handleClose();
        }, 1000); // 1 second delay
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
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setImportedData([]);
    setIsImported(false);
    setFile(null);
    onClose();
  };

  useEffect(() => {
    if (isImported) {
      setEditedData(importedData); // Initialize local copy on import
    }
  }, [isImported, importedData]);

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

        {importLoading && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <CircularProgress />
            <p>Importando arquivo...</p>
          </div>
        )}

        {saving && (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <Loader label='Salvando dados...' />
          </div>
        )}

        {isImported && !importLoading && !saving && (
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
                          value={editedData[index]?.description || ''}
                          onChange={(e) => handleDescriptionChange(e, index)}
                          onBlur={() => handleDescriptionBlur(index)}
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
                          sx={{ '&:hover': { color: 'secondary' } }}
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
          // sx={{ backgroundColor: 'red' }}
        >
          Cancelar
        </Button>
        {isImported ? (
          <Button
            onClick={handleSave}
            color='primary'
            variant='contained'
            // sx={{ backgroundColor: 'green' }}
            disabled={!isFormValid}
          >
            Salvar
          </Button>
        ) : (
          <Button
            onClick={handleImport}
            color='primary'
            variant='contained'
            disabled={importLoading}
          >
            Importar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export { ImportModal };
