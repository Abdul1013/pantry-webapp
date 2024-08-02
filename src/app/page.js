"use client";

import {
  Box,
  Typography,
  Stack,
  Modal,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../../firebase";

// Style for the modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

// Main component
export default function Home() {
  // State variables
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemSupplier, setItemSupplier] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // Fetch inventory data from Firestore
  const updateInventory = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "inventory"));
      const inventoryList = [];
      snapshot.forEach((doc) => {
        inventoryList.push({ id: doc.id, ...doc.data() });
      });
      setInventory(inventoryList);
      console.log("Fetched Inventory List:", inventoryList);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
  };

  // Fetch inventory data on component mount
  useEffect(() => {
    updateInventory();
  }, []);

  // Filter inventory based on search term and filter type
  useEffect(() => {
    let filtered = inventory;
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name &&
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType) {
      filtered = filtered.filter((item) => item.type === filterType);
    }
    setFilteredInventory(filtered);
  }, [searchTerm, filterType, inventory]);

  // Add new item to Firestore
  const addItem = async () => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    try {
      await setDoc(docRef, {
        name: itemName,
        quantity: itemQuantity,
        price: itemPrice,
        description: itemDescription,
        supplier: itemSupplier,
      });
      await updateInventory();
      handleClose();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  // Remove item from Firestore
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item.id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await updateDoc(docRef, { quantity: quantity - 1 });
        }
      }
      await updateInventory();
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  // Edit item in Firestore
  const editItem = async () => {
    const docRef = doc(collection(firestore, "inventory"), currentItem.id);
    try {
      await updateDoc(docRef, {
        name: itemName,
        quantity: itemQuantity,
        description: itemDescription,
        price: itemPrice,
        supplier: itemSupplier,
      });
      await updateInventory();
      handleEditClose();
    } catch (error) {
      console.error("Error editing item: ", error);
    }
  };

  // Function to clear all inventory items
  const clearInventory = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "inventory"));
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      await updateInventory(); // Refresh the local state
      console.log("Inventory cleared successfully.");
    } catch (error) {
      console.error("Error clearing inventory: ", error);
    }
  };

  // Open and close modal functions for editing items
  const handleEditOpen = (item) => {
    setCurrentItem(item);
    setItemName(item.name || "");
    setItemQuantity(item.quantity || "");
    setItemDescription(item.description || "");
    setItemPrice(item.price || "");
    setItemSupplier(item.supplier || "");
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  // Open and close modal functions for adding items
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      bgcolor={"#F6F4EB"}
    >
      {/* Modal for adding new items */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"column"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-quantity"
              label="Quantity"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <TextField
              id="outlined-description"
              label="Description"
              variant="outlined"
              fullWidth
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
            <TextField
              id="outlined-price"
              label="Price"
              variant="outlined"
              fullWidth
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
            <TextField
              id="outlined-supplier"
              label="Supplier"
              variant="outlined"
              fullWidth
              value={itemSupplier}
              onChange={(e) => setItemSupplier(e.target.value)}
            />
            <Button variant="outlined" onClick={addItem}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Modal for editing items */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={style}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit Item
          </Typography>
          <Stack width="100%" direction={"column"} spacing={2}>
            <TextField
              id="edit-item-name"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="edit-quantity"
              label="Quantity"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <TextField
              id="edit-description"
              label="Description"
              variant="outlined"
              fullWidth
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
            <TextField
              id="edit-price"
              label="Price"
              variant="outlined"
              fullWidth
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
            <TextField
              id="edit-supplier"
              label="Supplier"
              variant="outlined"
              fullWidth
              value={itemSupplier}
              onChange={(e) => setItemSupplier(e.target.value)}
            />
            <Button variant="outlined" onClick={editItem}>
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Inventory dashboard display */}
      <Typography variant="h2" color="#4682A9" textAlign="center">
        Inventory
      </Typography>

      <Box
        border={"1px solid #F4A460"}
        width={"90%"}
        height={"100%"}
        bgcolor="#749BC2"
        marginBottom={"10px"}
      >
        <Typography variant="h4" color="#4682A9" textAlign="center">
          Inventory list
        </Typography>

        <Box width="800px" mb={2} marginLeft={5}>
          <Stack direction="row" spacing={2} mb={2}>
            {/* Search input field */}
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">🔍</InputAdornment>
                ),
              }}
            />
            {/* Filter dropdown */}
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="quantity">Quantity</MenuItem>
                {/* Add more filter options as needed */}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Box
          width="100%"
          height="100px"
          bgcolor="#749BC2"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingX={5}
          spacing={2}
        >
          {/* Table headers */}
          <Typography
            variant="h6"
            color="#333"
            textAlign="center"
            style={{ flex: 1 }}
          >
            Name
          </Typography>
          <Typography
            variant="h6"
            color="#333"
            textAlign="center"
            style={{ flex: 1 }}
          >
            Quantity
          </Typography>
          <Typography
            variant="h6"
            color="#333"
            textAlign="center"
            style={{ flex: 1 }}
          >
            Description
          </Typography>
          <Typography
            variant="h6"
            color="#333"
            textAlign="center"
            style={{ flex: 1 }}
          >
            Price
          </Typography>
          <Typography
            variant="h6"
            color="#333"
            textAlign="center"
            style={{ flex: 1 }}
          >
            Supplier
          </Typography>
          <Typography
            variant="h6"
            color="#333"
            textAlign="center"
            style={{ flex: 1 }}
          >
            Edit
          </Typography>
          <Typography
            variant="h6"
            color="#333"
            textAlign="center"
            style={{ flex: 1 }}
          >
            Delete
          </Typography>
        </Box>

        {/* Display inventory items */}
        <Stack
          width="100%"
          height="400px"
          spacing={2}
          overflow="auto"
          direction="column"
        >
          {inventory.map((item) => (
            <Box
              key={item.id}
              width="100%"
              height="50px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              paddingX={5}
              sx={{ borderBottom: "1px solid #f0f0f0" }}
            >

              {/* Display item details */}
              <Typography
                variant="h6"
                color="#333"
                textAlign="center"
                fontWeight="bold"
                style={{ flex: 1 }}
              >
                {item.name
                  ? item.name.charAt(0).toUpperCase() + item.name.slice(1)
                  : "Unnamed Item"}
              </Typography>
              <Typography
                variant="h6"
                color="#333"
                textAlign="center"
                style={{ flex: 1 }}
              >
                {item.quantity}
              </Typography>
              <Typography
                variant="h6"
                color="#333"
                textAlign="center"
                style={{ flex: 1 }}
              >
                {item.description}
              </Typography>
              <Typography
                variant="h6"
                color="#333"
                textAlign="center"
                style={{ flex: 1 }}
              >
                {item.price}
              </Typography>
              <Typography
                variant="h6"
                color="#333"
                textAlign="center"
                style={{ flex: 1 }}
              >
                {item.supplier}
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleEditOpen(item)}
                style={{ flex: 1, marginRight: 5 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                onClick={() => removeItem(item)}
                style={{ flex: 1 }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>

        <Box
          display="flex"
          justifyContent="center"
          // paddingX={5}
          marginBottom={"10px"}
          // alignItems="center"
          // marginX={5}
        >
          {/* Add new item button */}
          <Button
            variant="contained"
            onClick={handleOpen}
            style={{ marginRight: 2 }}
          >
            Add New Item
          </Button>
          <Button variant="contained" onClick={clearInventory}>Clear Inventory</Button>
        </Box>
      </Box>
    </Box>
  );
}
