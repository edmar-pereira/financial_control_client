import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';

export default function DuplicatedRowsDialog({
  open,
  duplicatedRows,
  onClose,
}) {
  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>Registros ignorados</DialogTitle>

      <DialogContent dividers>
        <Typography sx={{ mb: 2 }}>
          Os registros abaixo já existiam no sistema e não foram importados.
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Motivo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {duplicatedRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.categoryId}</TableCell>
                <TableCell>{row.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
