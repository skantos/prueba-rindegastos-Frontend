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
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'

interface SidebarProps {
  selected?: string
}

export default function Sidebar({ selected }: SidebarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen)

  const handleItemClick = (itemId: string | null) => {
    if (!itemId) return
    
    const routes: Record<string, string> = {
      '/': '/',
      'usuarios': '/usuarios',
      'ingresar': '/ingresar',
      'exchange': '/exchange',
      'numbers': '/numbers'
    }

    if (routes[itemId]) {
      navigate(routes[itemId])
    } else if (itemId.startsWith('/')) {
        navigate(itemId)
    }

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
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', py: 1 }}
        onClick={() => handleItemClick('/')}
      >
        <img src={logo} alt="Logo" style={{ height: 36 }} />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Navegación
        </Typography>

        <SimpleTreeView
          aria-label="Navegación principal"
          defaultExpandedItems={['cumpleanos', 'herramientas']}
          selectedItems={selected ?? null}
          onSelectedItemsChange={(_, itemIds) => {
            const id = Array.isArray(itemIds) ? itemIds[0] : itemIds
            if (id) handleItemClick(id)
          }}
          slots={{
            collapseIcon: ExpandMoreIcon,
            expandIcon: ChevronRightIcon,
          }}
          sx={{
            '& .MuiTreeItem-content': {
              borderRadius: 1,
              py: 0.5,
              '&.Mui-selected': {
                bgcolor: 'rgba(59, 130, 246, 0.08)',
                color: '#2563eb',
              },
              '&.Mui-selected:hover': {
                bgcolor: 'rgba(59, 130, 246, 0.12)',
              }
            }
          }}
        >
          <TreeItem itemId="cumpleanos" label="Cumpleaños">
            <TreeItem itemId="usuarios" label="Usuarios" />
            <TreeItem itemId="ingresar" label="Ingresar" />
          </TreeItem>
          <TreeItem itemId="herramientas" label="Herramientas">
            <TreeItem itemId="exchange" label="Conversor de Divisas" />
            <TreeItem itemId="numbers" label="Números" />
          </TreeItem>
        </SimpleTreeView>
      </Box>
    </Box>
  )

  if (isMobile) {
    return (
      <>
        <Box sx={{ position: 'fixed', top: 12, left: 12, zIndex: 1200 }}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              '&:hover': { backgroundColor: '#f9fafb' },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: 260 } }}
        >
          {sidebarContent}
        </Drawer>
        <Box sx={{ height: 64 }} />
      </>
    )
  }

  return sidebarContent
}

