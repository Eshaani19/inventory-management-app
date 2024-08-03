'use client'
import {Box,Stack, Typography, Button, Modal, TextField, ThemeProvider, createTheme, CssBaseline} from '@mui/material'
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
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const updatePantry = async() => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({name : doc.id, ...doc.data()})
    })
    setPantry(pantryList)
    setFilteredPantry(pantryList);
  }

  useEffect(() => {
    updatePantry()
  }, [])

  useEffect(() => {
    const filtered = searchQuery
      ? pantry.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : pantry;
    setFilteredPantry(filtered);
  }, [searchQuery, pantry]);

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
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" sx={{ mb: 2 }}>Pantry Items</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Item
          </Button>
          <TextField
            label="Search Items"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
          <Box sx={{ maxHeight: 400, overflowY: 'auto', width: '100%' }}>
            {filteredPantry.map((item) => (
              <Stack
                key={item.name}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 2, bgcolor: 'white', mb: 1, borderRadius: 1 }}
              >
                <Typography variant="body1">{item.name}</Typography>
                <Typography variant="body1">Quantity: {item.count}</Typography>
                <DeleteIcon
                  color="secondary"
                  onClick={() => removeItem(item.name)}
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>
            ))}
          </Box>
        </Stack>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-title" variant="h6" component="h2">
              Add a new item
            </Typography>
            <TextField
              id="modal-description"
              label="Item Name"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add Item
            </Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}