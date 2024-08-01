"use client";

import {
  Box,
  Typography,
  Stack,
  Modal,
  TextField,
  Button,
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

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemSupplier, setItemSupplier] = useState("");
  const [currentItem, setCurrentItem] = useState(null);

  // Get Data From Inventory
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

  useEffect(() => {
    updateInventory();
  }, []);

  // Add Item to db
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

  // Delete Item from db
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

  // Edit Item in db
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      bgcolor={"#F6F4EB"}
    >
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
      <Typography variant="h2" color="#4682A9" textAlign="center">
        Inventory
      </Typography>

      <Box border={"1px solid #F4A460"} width={"90%"} bgcolor="#749BC2">
        <Typography variant="h4" color="#4682A9" textAlign="center">
          Inventory list
        </Typography>

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
          <Typography
            variant="h6"
            color="#333"
            textAlign="center"
            // fontWeight="bold"
          >
            Name
          </Typography>

          <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
            Quantity
          </Typography>
          <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
            Description
          </Typography>
          <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
            Price
          </Typography>
          <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
            Supplier
          </Typography>
          <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
            Edit
          </Typography>
          <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
            Delete
          </Typography>
        </Box>
        {/* display user input section */}
        <Stack
          width="100%"
          height="400px"
          spacing={2}
          overflow="auto"
          direction={"column"}
        >
          {inventory.map((item) => (
            <Box
              key={item.id}
              width="100%"
              height="50px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor=""
              paddingX={5}
              // sx={{ borderRight: "4px solid #f0f0f0" }}
            >
              <Typography
                variant="h6"
                color="#333"
                textAlign="center"
                fontWeight="bold"
              >
                {item.name
                  ? item.name.charAt(0).toUpperCase() + item.name.slice(1)
                  : "Unnamed Item"}
              </Typography>

              <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
                {item.quantity}
              </Typography>
              <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
                {item.description}
              </Typography>
              <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
                {item.price}
              </Typography>
              <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
                {item.supplier}
              </Typography>
              <Button variant="contained" onClick={() => handleEditOpen(item)}>
                Edit
              </Button>
              <Button variant="contained" onClick={() => removeItem(item)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
      </Box>
    </Box>
  );
}
