import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function EditTransaction() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    account: "",
    note: "",
    description: "",
  });

  const [type, setType] = useState("expense");
  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}`);
        const tx = res.data;

        setForm({
          date: tx.date || "",
          amount: tx.amount || "",
          category: tx.category || "",
          account: tx.account || "",
          note: tx.note || "",
          description: tx.description || "",
        });

        setType(tx.type || "expense");
        setExistingImage(tx.image || "");
      } catch (err) {
        console.error("❌ Failed to fetch transaction:", err);
        alert("❌ Failed to load transaction.");
      }
    };

    fetchTransaction();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append("type", type);
    formData.append("userId", user._id);
    if (newImage) formData.append("image", newImage);

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("✅ Transaction updated!");
      navigate("/history");
    } catch (err) {
      console.error("❌ Failed to update transaction:", err.response?.data || err.message);
      alert("❌ Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-2xl mx-auto bg-zinc-900 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-teal-400">Edit Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          {/* Transaction type toggle */}
          <div className="flex justify-center gap-3 mb-4">
            {["income", "expense", "transfer"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  type === t
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 border border-zinc-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Input fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="bg-zinc-800 px-4 py-2 rounded-md text-white"
            />
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="bg-zinc-800 px-4 py-2 rounded-md text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="bg-zinc-800 px-4 py-2 rounded-md text-white"
            />
            <input
              type="text"
              name="account"
              value={form.account}
              onChange={handleChange}
              placeholder="Account"
              className="bg-zinc-800 px-4 py-2 rounded-md text-white"
            />
          </div>

          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Note"
            className="bg-zinc-800 px-4 py-2 rounded-md text-white"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Description"
            className="bg-zinc-800 px-4 py-2 rounded-md text-white w-full"
          ></textarea>

          {/* Existing image preview */}
          {existingImage && !newImage && (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${existingImage}`}
              alt="Current"
              className="w-40 rounded border mt-2"
            />
          )}

          {/* New image preview */}
          {newImage && (
            <img
              src={URL.createObjectURL(newImage)}
              alt="New"
              className="w-40 rounded border mt-2"
            />
          )}

          {/* Upload new image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
            className="bg-zinc-800 text-white px-4 py-2 rounded-md w-full"
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="border border-zinc-500 text-gray-300 px-6 py-2 rounded-md hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-black px-6 py-2 rounded-md font-semibold transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
