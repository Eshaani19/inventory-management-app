'use client'
import {Box,Stack, Typography, Button, Modal, TextField, ThemeProvider, createTheme, CssBaseline, Paper, IconButton} from '@mui/material'
import {collection, query,doc, getDocs, setDoc, deleteDoc, getDoc} from 'firebase/firestore'
import {firestore} from './firebase';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#FF5722',
    },
    background: {
      default: '#E8F5E9',
      //paper: '#ffffff',
    },
  },
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width:400,
  bgcolor: 'background.paper',
  border:'2px solid #000',
  boxshadow: 24,
  p: 4,
  display: 'flex',
  flexDirection : 'column',
  gap: 3
}

export default function Home() {
  const [pantry,setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [itemName, setItemName] = useState('')

  const updatePantry = async() => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({name : doc.id, ...doc.data()})
    })
    setPantry(pantryList)
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const addItem = async(item) => {
    const docRef = doc(collection(firestore,'pantry'), item)
    //check if exists
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {count} =docSnap.data()
      await setDoc(docRef, {count: count + 1})
    }else{
    await setDoc(docRef, {count: 1})
    }
    await updatePantry()
  }

  const removeItem = async(item) => {
    const docRef = doc(collection(firestore,'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      if (count === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { count: count - 1 })
      }
    }
    await updatePantry()
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Box
      width = "100vw"
      height = "100vh"
      display = {'flex'}
      justifyContent = {'center'}
      flexDirection = {'column'}
      alignItems = {'center'}
      gap = {2}
      bgcolor="background.default"
      p={4}
    > 
    <Modal
      open = {open}
      onClose = {handleClose}
      aria-labelledby = "modal-modal-title"
      aria-describedby = "modal-modal-description"
    >
      <Box sx = {style}>
        <Typography id = "modal-modal-title" variant='h6' component = 'h2'>
          Add item
        </Typography>
        <Stack width="100%" direction={'row'} spacing={2}>
          <TextField id="outlined-basic" label="item" variant = "outlined" fullWidth value={itemName}
          onChange = {(e) => setItemName(e.target.value)} 
          />
          <Button variant="contained" onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}> 
            Add 
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}> 
      Add 
    </Button>
    <Box border={'1px solid #333'} borderRadius={4} overflow="hidden" boxShadow={3}>
      <Box
        width="800px"
        height="100px"
        bgcolor={'primary.main'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
      <Typography variant="h4" color="common.white" textAlign={'center'}>
        Pantry Items
      </Typography> 
    </Box>
    <Stack width = "100%" spacing = {2} overflow={'auto'} sx={{ mt: 2, maxHeight: 400, overflowY: 'auto' }}>
      {pantry.map(({name,count}) =>  (
        <Box
          key={name}
          width="100%"
          minHeight="150px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor={'#fff'}
          paddingX={5}
          borderBottom="1px solid #ddd"
        >
          <Typography variant = {'h6'} color={'#333'} textAlign={'center'}>
            {
              name.charAt(0).toUpperCase() + name.slice(1)
            }
          </Typography>
          <Typography variant={'h6'} color={'#333'} textAlign={'center'}>
            Quantity: {count}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => removeItem(name)}
            startIcon={<DeleteIcon />}
          >
            Remove
          </Button>
          </Box>
        ))}
    </Stack>
    </Box>
    </Box>
    </ThemeProvider>
  );
}