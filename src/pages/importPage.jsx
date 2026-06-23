import React, { useState, useRef, useMemo, useEffect } from 'react';

import api from '../services/api';

import {
  Autocomplete,
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
  Chip,
  Stack,
  Tabs,
  Tab,
  MenuItem,
  Collapse,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import {
  Delete as DeleteIcon,
  UploadFile as UploadFileIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

import ShiftedCurrencyInput from '../components/ShiftedCurrencyInput';

import SelectCategory from '../components/SelectCategory';

import Loader from '../components/Loading';

import { useAPI } from '../context/mainContext';

const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

export default function ImportPage() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const {
    setMessage,
    triggerReload,
    setImportedData,
    importedData,
    arrCategories,
    handleLoadCategory,
  } = useAPI();


  const today = new Date();

  const [statementMonth, setStatementMonth] = useState(today.getMonth() + 1);

  const [statementYear, setStatementYear] = useState(today.getFullYear());

  const [importType, setImportType] = useState('credit');

  const [isImported, setIsImported] = useState(false);

  const [importLoading, setImportLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tab, setTab] = useState('new');

  const [expandedGroups, setExpandedGroups] = useState({});

  const [confirmChangeType, setConfirmChangeType] = useState(false);

  const [pendingImportType, setPendingImportType] = useState(null);

  const [descriptionOptions, setDescriptionOptions] = useState([]);

  /* ================= HELPERS ================= */

const buildGroupKey = (item) => {
  if (item.totalInstallment === 1) {
    return `${item.fantasyName}|${item.date}|${item.value}|${item._rowIndex}`;
  }

  return [
    item.fantasyName,
    item.originalPurchaseDate || item.date,
    item.totalInstallment,
    item.value,
  ].join('|');
};
  /* ================= FORMAT ================= */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return '';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  /* ================= FILTERS ================= */

  const newTransactions = useMemo(() => {
    return importedData.filter((item) => !item.duplicated);
  }, [importedData]);

  const duplicatedTransactions = useMemo(() => {
    return importedData.filter((item) => item.duplicated);
  }, [importedData]);

  const filteredData = useMemo(() => {
    if (tab === 'duplicated') {
      return duplicatedTransactions;
    }

    return newTransactions;
  }, [tab, newTransactions, duplicatedTransactions]);

  /* ================= GROUP ================= */

  const groupedData = useMemo(() => {
    const map = new Map();

    filteredData.forEach((item) => {
      const groupKey = buildGroupKey(item);

      if (!map.has(groupKey)) {
        map.set(groupKey, {
          ...item,

          installments: [],

          groupKey,

          duplicatedCount: 0,

          newCount: 0,

          partiallyDuplicated: false,
        });
      }

      const currentGroup = map.get(groupKey);

      currentGroup.installments.push(item);

      if (item.duplicated) {
        currentGroup.duplicatedCount += 1;
      } else {
        currentGroup.newCount += 1;
      }

      currentGroup.partiallyDuplicated =
        currentGroup.duplicatedCount > 0 && currentGroup.newCount > 0;
    });

    return Array.from(map.values());
  }, [filteredData]);

  /* ================= VALIDATION ================= */

  const isFormValid =
    newTransactions.length > 0 &&
    newTransactions.every((item) => item.name?.trim());

  /* ================= CLEAR ================= */

  const handleClearImport = () => {
    setImportedData([]);

    setIsImported(false);

    setExpandedGroups({});

    setPage(0);

    setTab('new');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /* ================= IMPORT ================= */

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const formData = new FormData();

    formData.append('file', selectedFile);

    formData.append('statementMonth', statementMonth);

    formData.append('statementYear', statementYear);

    formData.append('importType', importType);

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

      setImportedData(sorted);

      setIsImported(true);

      setMessage({
        severity: 'success',
        content: 'Arquivo importado com sucesso',
        show: true,
      });
    } catch (err) {
      console.error(err);

      setMessage({
        severity: 'error',
        content: 'Erro ao importar arquivo',
        show: true,
      });
    } finally {
      setImportLoading(false);
    }
  };

  /* ================= UPDATE ================= */

  const updateGroup = (groupKey, field, value) => {
    setImportedData((prev) =>
      prev.map((item) => {
        const currentGroupKey = buildGroupKey(item);

        if (currentGroupKey === groupKey) {
          return {
            ...item,
            [field]: value,
          };
        }

        return item;
      }),
    );
  };

  /* ================= REMOVE ================= */

  const handleRemoveGroup = (groupKey) => {
    setImportedData((prev) =>
      prev.filter((item) => {
        const currentGroupKey = buildGroupKey(item);

        return currentGroupKey !== groupKey;
      }),
    );
  };

  /* ================= LOAD CATTEGORIES ================= */

  useEffect(() => {
    if (!arrCategories || arrCategories.length === 0) {
      handleLoadCategory();
    }
  }, []);

  /* =========================================
       DESCRIPTION AUTOCOMPLETE
    ========================================= */
  const loadDescriptions = async (search) => {
    try {
      if (!search || search.trim().length < 2) {
        setDescriptionOptions([]);
        return;
      }

      const res = await api.get('/api/data/getUniqueDescriptions', {
        params: {
          description: search.trim(),
        },
      });

      setDescriptionOptions(res.data.data || []);
    } catch (err) {
      console.error(err);
      setDescriptionOptions([]);
    }
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = importedData.filter((item) => !item.duplicated);

      const res = await api.post('/api/data/insertmany', payload);

      const { inserted, updated } = res.data.data;

      setMessage({
        severity: 'success',
        content: `
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
        content: 'Erro ao salvar dados',
        show: true,
      });
    } finally {
      setSaving(false);
    }
  };

  /* ================= CANCEL ================= */

  const handleCancel = () => {
    handleClearImport();

    navigate(-1);
  };

  /* ================= PAGINATION ================= */

  const paginatedData = groupedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  /* ================= EXPAND ================= */

  const toggleExpand = (groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  /* ================= IMPORT TYPE ================= */

  const handleImportTypeChange = (e) => {
    const newType = e.target.value;

    if (isImported && importedData.length > 0) {
      setPendingImportType(newType);

      setConfirmChangeType(true);

      return;
    }

    setImportType(newType);
  };

  const handleConfirmImportTypeChange = () => {
    handleClearImport();

    setImportType(pendingImportType);

    setConfirmChangeType(false);

    setPendingImportType(null);
  };

  const handleCancelImportTypeChange = () => {
    setConfirmChangeType(false);

    setPendingImportType(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant='h5' gutterBottom>
          Importar dados
        </Typography>

        {/* ================= IMPORT TYPE ================= */}

        <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
          <TextField
            select
            size='small'
            label='Tipo de importação'
            value={importType}
            onChange={handleImportTypeChange}
            sx={{
              minWidth: 240,
            }}
          >
            <MenuItem value='credit'>Cartão de crédito</MenuItem>

            <MenuItem value='bank'>Conta bancária</MenuItem>
          </TextField>
        </Stack>

        {/* ================= FATURA ================= */}

        {importType === 'credit' && (
          <Stack direction='row' spacing={2} sx={{ mb: 3 }}>
            <TextField
              select
              size='small'
              label='Mês da fatura'
              value={statementMonth}
              onChange={(e) => setStatementMonth(Number(e.target.value))}
              sx={{
                minWidth: 200,
              }}
            >
              {MONTHS.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label='Ano da fatura'
              type='number'
              value={statementYear}
              onChange={(e) => setStatementYear(Number(e.target.value))}
              sx={{ width: 140 }}
              size='small'
            />
          </Stack>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept={importType === 'credit' ? '.csv' : '.xlsx,.xls'}
          hidden
          onChange={handleFileChange}
        />

        {importLoading && (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
            }}
          >
            <CircularProgress />

            <Typography>Importando arquivo...</Typography>
          </Box>
        )}

        {saving && <Loader label='Salvando dados...' />}

        {isImported && !importLoading && !saving && (
          <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
            <Chip color='success' label={`Novos: ${newTransactions.length}`} />

            <Chip
              color='warning'
              label={`Duplicados: ${duplicatedTransactions.length}`}
            />

            <Chip color='info' label={`Grupos: ${groupedData.length}`} />
          </Stack>
        )}

        {isImported && (
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            sx={{ mb: 2 }}
          >
            <Tab value='new' label={`Novos (${newTransactions.length})`} />

            <Tab
              value='duplicated'
              label={`Duplicados (${duplicatedTransactions.length})`}
            />
          </Tabs>
        )}

        {isImported && !importLoading && !saving && (
          <>
            <TableContainer>
              <Table
                size='small'
                sx={{
                  tableLayout: 'fixed',
                  width: '100%',
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '5%' }} />
                    <TableCell sx={{ width: '10%' }}>Data</TableCell>
                    <TableCell sx={{ width: '20%' }}>Nome Fantasia</TableCell>
                    <TableCell sx={{ width: '20%' }}>Empresa</TableCell>
                    <TableCell sx={{ width: '20%' }}>Descrição</TableCell>
                    <TableCell sx={{ width: '15%' }}>Valor</TableCell>
                    <TableCell sx={{ width: '8%' }}>Parcelas</TableCell>
                    <TableCell sx={{ width: '20%' }}>Categoria</TableCell>
                    <TableCell sx={{ width: '8%' }}>Status</TableCell>
                    <TableCell sx={{ width: '10%' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedData.map((row) => {

            
                    const expanded = expandedGroups[row.groupKey];

                    return (
                      <React.Fragment key={row.groupKey}>
                        <TableRow
                          sx={{
                            opacity:
                              row.duplicatedCount > 0 && row.newCount === 0
                                ? 0.6
                                : 1,
                          }}
                        >
                          <TableCell>
                            {row.installments.length > 1 && (
                              <IconButton
                                size='small'
                                onClick={() => toggleExpand(row.groupKey)}
                              >
                                {expanded ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )}
                              </IconButton>
                            )}
                          </TableCell>

                          <TableCell>
                            {formatDate(row.statementDate || row.date)}
                          </TableCell>

                          <TableCell>{row.fantasyName}</TableCell>

                          <TableCell>
                            <TextField
                              fullWidth
                              size='small'
                              value={row.name || ''}
                              onChange={(e) =>
                                updateGroup(
                                  row.groupKey,
                                  'name',
                                  e.target.value,
                                )
                              }
                            />
                          </TableCell>

                          <TableCell>
                            <Autocomplete
                              freeSolo
                              options={
                                (row.description || '').length >= 2
                                  ? descriptionOptions
                                  : []
                              }
                              value={row.description || ''}
                              inputValue={row.description || ''}
                              filterOptions={(x) => x}
                              onInputChange={async (_, value, reason) => {
                                updateGroup(
                                  row.groupKey,
                                  'description',
                                  value || '',
                                );

                                if (reason === 'input' && value.length >= 2) {
                                  await loadDescriptions(value);
                                }

                                if (value.length < 2) {
                                  setDescriptionOptions([]);
                                }
                              }}
                              onChange={(_, value) => {
                                updateGroup(
                                  row.groupKey,
                                  'description',
                                  value || '',
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size='small'
                                  label='Descrição'
                                />
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <ShiftedCurrencyInput
                              value={Number(row.value) * 100}
                              onChange={(cents) =>
                                updateGroup(
                                  row.groupKey,
                                  'value',
                                  (cents / 100).toFixed(2),
                                )
                              }
                            />
                          </TableCell>

                          <TableCell>
                            {row.totalInstallment > 1 ? (
                              <Box>
                                <Typography variant='body2'>
                                  {row.currentInstallment}/
                                  {row.totalInstallment}
                                </Typography>

                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                >
                                  {row.installments.length} parcelas
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant='body2'>À vista</Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            <SelectCategory
                              selectedType={row.categoryId}
                              onChange={(value) =>
                                updateGroup(row.groupKey, 'categoryId', value)
                              }
                            />
                          </TableCell>

                          <TableCell>
                            {row.partiallyDuplicated ? (
                              <Chip
                                size='small'
                                color='info'
                                label={`${row.newCount} novas / ${row.duplicatedCount} duplicadas`}
                              />
                            ) : row.duplicatedCount > 0 ? (
                              <Chip
                                size='small'
                                color='warning'
                                label='Duplicado'
                              />
                            ) : (
                              <Chip size='small' color='success' label='Novo' />
                            )}
                          </TableCell>

                          <TableCell>
                            <IconButton
                              size='small'
                              onClick={() => handleRemoveGroup(row.groupKey)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            colSpan={9}
                            sx={{
                              p: 0,
                              border: 0,
                            }}
                          >
                            <Collapse in={expanded}>
                              <Box
                                sx={{
                                  p: 2,
                                  backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark'
                                      ? theme.palette.grey[900]
                                      : theme.palette.grey[100],
                                }}
                              >
                                {row.installments.map((installment) => (
                                  <Box
                                    key={`${installment.date}-${installment.currentInstallment}`}
                                    sx={{
                                      display: 'flex',

                                      justifyContent: 'space-between',

                                      alignItems: 'center',

                                      py: 0.5,

                                      opacity: installment.duplicated ? 0.5 : 1,
                                    }}
                                  >
                                    <Typography variant='body2'>
                                      {formatDate(installment.date)}
                                    </Typography>

                                    <Typography variant='body2'>
                                      {installment.currentInstallment}/
                                      {installment.totalInstallment}
                                    </Typography>

                                    <Typography variant='body2'>
                                      R$ {Number(installment.value).toFixed(2)}
                                    </Typography>

                                    {installment.duplicated ? (
                                      <Chip
                                        size='small'
                                        color='warning'
                                        label='Duplicada'
                                      />
                                    ) : (
                                      <Chip
                                        size='small'
                                        color='success'
                                        label='Nova'
                                      />
                                    )}
                                  </Box>
                                ))}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component='div'
              count={groupedData.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(Number(e.target.value));

                setPage(0);
              }}
            />
          </>
        )}

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
              variant='outlined'
              startIcon={<UploadFileIcon />}
              onClick={handleImportClick}
            >
              Importar
            </Button>
          )}

          <Button
            variant='outlined'
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancelar
          </Button>

          {isImported && (
            <Button
              variant='outlined'
              color='warning'
              onClick={handleClearImport}
            >
              Limpar
            </Button>
          )}

          {isImported && (
            <Button
              variant='contained'
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!isFormValid}
            >
              Salvar somente novos
            </Button>
          )}
        </Box>

        <Dialog open={confirmChangeType} onClose={handleCancelImportTypeChange}>
          <DialogTitle>Alterar tipo de importação</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Ao alterar o tipo de importação os dados carregados serão
              perdidos. Deseja continuar?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCancelImportTypeChange}>Não</Button>

            <Button
              variant='contained'
              color='error'
              onClick={handleConfirmImportTypeChange}
            >
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}