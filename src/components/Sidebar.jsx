import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState } from 'react'
import logo from '../assets/logo.svg'

function Sidebar({ onSelect }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleItemClick = (itemId) => {
    if (onSelect) onSelect(itemId)
    if (isMobile) setDrawerOpen(false)
  }

  const sidebarContent = (
    <Box
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
          defaultExpandedItems={['cumpleanos', 'herramientas']}
          onSelectedItemsChange={(_, itemIds) => {
            const id = Array.isArray(itemIds) ? itemIds[0] : itemIds
            if (id) handleItemClick(id)
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
          <TreeItem itemId="herramientas" label="Herramientas">
            <TreeItem itemId="exchange" label="Convensor de divisas" />
            <TreeItem itemId="numbers" label="Números" />
          </TreeItem>
        </SimpleTreeView>
      </Box>
    </Box>
  )

  // Mobile: Mostrar botón de menú y drawer
  if (isMobile) {
    return (
      <>
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              '&:hover': { backgroundColor: '#f9fafb' },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Drawer
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 260,
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Espacio para evitar que el contenido quede detrás del botón */}
        <Box sx={{ height: 72 }} />
      </>
    )
  }

  // Desktop: Mostrar sidebar normal
  return sidebarContent
}

export default Sidebar