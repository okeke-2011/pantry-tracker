import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, { message: "Item name required" }),
  quantity: z
    .number({ invalid_type_error: "Quantity required" })
    .min(1, { message: "Quantity need to be at least 1" })
    .positive(),
});

type PantryItem = z.infer<typeof schema>;

interface Props {
  addItem: (item: PantryItem) => Promise<void>;
}

function AddItemModal({ addItem }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PantryItem>({ resolver: zodResolver(schema) });

  const form = (
    <form onSubmit={handleSubmit(addItem)}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          className="form-control"
        />
        {errors.name && <p className="text-danger">{errors.name.message}</p>}
      </div>
      <div className="mb-3">
        <label htmlFor="quantity" className="form-label">
          Quantity
        </label>
        <input
          {...register("quantity", { valueAsNumber: true })}
          id="quantity"
          type="number"
          className="form-control"
        />
        {errors.quantity && (
          <p className="text-danger">{errors.quantity.message}</p>
        )}
      </div>
      <div className="mb-3 text-end">
        <button className="btn btn-primary" type="submit">
          Add Item
        </button>
      </div>
    </form>
  );

  return (
    <div className="mb-3 d-flex justify-content-center">
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add item
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Item
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{form}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;
