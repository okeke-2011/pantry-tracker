import { useEffect, useState } from "react";
import "./App.css";
import AddItemModal from "./components/AddItemModal";
import DisplayItems from "./components/DisplayItems";
import supabase from "./config/supabaseConfig";
import { BiSort } from "react-icons/bi";
import OpenAiVision from "./components/OpenAiVision";

interface Item {
  id: number;
  name: string;
  quantity: number;
}

// DB PASSWORD: ZYHz4$4SRkM4YWY

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [orderBy, setOrderBy] = useState("created_at");
  const [ascending, setAscending] = useState(false);

  useEffect(() => {
    fetchPantryItems();
  }, [orderBy, ascending]);

  const fetchPantryItems = async () => {
    const { data, error } = await supabase
      .from("pantry")
      .select()
      .order(orderBy, { ascending: ascending });

    if (error) {
      setError("Could not fetch pantry items");
      setItems([]);
      console.log(error);
    }

    if (data) {
      setItems(data);
      setError("");
    }
  };

  const handleAdd = async (item: { name: string; quantity: number }) => {
    let existingItem = items.find((i) => i.name === item.name);

    if (existingItem) {
      handleUpdate(existingItem, item.quantity);
    } else {
      await supabase.from("pantry").insert([item]);
    }
    fetchPantryItems();
  };

  const handleUpdate = async (item: Item, quantity: number) => {
    if (item.quantity + quantity < 1) handleDelete(item);
    const { error } = await supabase
      .from("pantry")
      .update({ name: item.name, quantity: item.quantity + quantity })
      .eq("id", item.id);

    if (!error) {
      const updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
      );
      setItems(updatedItems);
    }
  };

  const handleDelete = async (item: Item) => {
    const { error } = await supabase.from("pantry").delete().eq("id", item.id);
    if (!error) setItems(items.filter((i) => i.id !== item.id));
  };

  const alert = (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  );

  return (
    <>
      {error && alert}
      <p>
        <strong>Order by:</strong>
      </p>
      <div className="mb-5 d-flex">
        <button
          className={`btn btn-sm me-1 ${
            orderBy === "created_at" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setOrderBy("created_at")}
        >
          Create Time
        </button>
        <button
          className={`btn btn-sm me-1 ${
            orderBy === "name" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setOrderBy("name")}
        >
          Item Name
        </button>
        <button
          className={`btn btn-sm me-1 ${
            orderBy === "quantity" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setOrderBy("quantity")}
        >
          Quantity
        </button>
        <button
          className="btn btn-sm btn-light me-1"
          onClick={() => setAscending(!ascending)}
        >
          <BiSort />
        </button>
      </div>

      <DisplayItems
        items={items}
        onMinusOne={(item) => handleUpdate(item, -1)}
        onPlusOne={(item) => handleUpdate(item, 1)}
        onDelete={handleDelete}
      />

      {!error && <AddItemModal addItem={handleAdd} />}

      <OpenAiVision />
    </>
  );
}

export default App;
