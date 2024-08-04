import { FaTrash } from "react-icons/fa";

interface Item {
  id: number;
  name: string;
  quantity: number;
}

interface Props {
  items: Item[];
  onPlusOne: (item: Item) => void;
  onMinusOne: (item: Item) => void;
  onDelete: (item: Item) => void;
}

function DisplayItems({ items, onMinusOne, onPlusOne, onDelete }: Props) {
  if (items.length === 0) return;

  return (
    <div className="mb-3">
      <h2 className="d-flex justify-content-center">ITEMS</h2>
      <div
        className="bg-light p-3 rounded"
        style={{ maxHeight: "450px", overflowY: "auto" }}
      >
        <table className="table table-light table-borderless">
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-sm btn-outline-danger me-1"
                      onClick={() => onMinusOne(item)}
                    >
                      -1
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onPlusOne(item)}
                    >
                      +1
                    </button>
                  </div>
                </td>
                <td>
                  <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => onDelete(item)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DisplayItems;
