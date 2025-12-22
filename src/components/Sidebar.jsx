import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import logo from '../assets/logo.svg'

function Sidebar({ onSelect }) {
  return (
    <Box
      component="aside"
      sx={{
        width: 260,
        minHeight: '100vh',
        borderRight: '1px solid #e5e7eb',
        backgroundColor: '#fff',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <img src={logo} alt="Logo" style={{ height: 36 }} />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#6b7280' }}>
          Navegación
        </Typography>

        <SimpleTreeView
          aria-label="Navegación principal"
          defaultExpandedItems={['cumpleanos']}
          selectionMode="single"
          onSelectedItemsChange={(_, itemIds) => {
            const id = Array.isArray(itemIds) ? itemIds[0] : itemIds
            if (id) onSelect?.(id)
          }}
          slots={{
            collapseIcon: ExpandMoreIcon,
            expandIcon: ChevronRightIcon,
          }}
        >
          <TreeItem itemId="cumpleanos" label="Cumpleaños">
            <TreeItem itemId="usuarios" label="Usuarios" />
            <TreeItem itemId="ingresar" label="Ingresar" />
          </TreeItem>
          <TreeItem itemId="exchange" label="Exchange" />
        </SimpleTreeView>
      </Box>
    </Box>
  )
}

export default Sidebar

