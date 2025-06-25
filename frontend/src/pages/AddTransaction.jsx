import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Combined import

export default function AddTransaction() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Hook call inside component
  const prefill = location.state || {}; // ✅ Now defined before use

  const [type, setType] = useState("expense");
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    date: prefill.date || new Date().toISOString().slice(0, 10),
    amount: prefill.amount || "",
    category: prefill.category || "",
    account: "",
    note: prefill.notes || "",
    description: "",
  });

 

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append("userId", user?._id);
    formData.append("type", type);
    if (image) formData.append("image", image);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("✅ Transaction Saved!");
       setForm({
      date: new Date().toISOString().slice(0, 10),
      amount: "",
      category: "",
      account: "",
      note: "",
      description: "",
    });
    setImage(null);
    } catch (err) {
      console.error("❌ Transaction Error:", err.response?.data || err.message);
      alert("❌ Failed to save transaction");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto bg-zinc-900/40 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-zinc-700">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-teal-400">
          Add a Transaction
        </h2>

        {/* Transaction Type Tabs */}
        <div className="flex justify-center gap-3 mb-6">
          {["income", "expense", "transfer"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                type === t
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="bg-zinc-800 text-white px-4 py-2 rounded-md w-full placeholder-gray-400 focus:outline-none"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="bg-zinc-800 text-white px-4 py-2 rounded-md w-full placeholder-gray-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="text"
              name="category"
              placeholder="Category (e.g. Food)"
              value={form.category}
              onChange={handleChange}
              className="bg-zinc-800 text-white px-4 py-2 rounded-md w-full placeholder-gray-400 focus:outline-none"
            />
            <input
              type="text"
              name="account"
              placeholder="Account (e.g. Bank, UPI)"
              value={form.account}
              onChange={handleChange}
              className="bg-zinc-800 text-white px-4 py-2 rounded-md w-full placeholder-gray-400 focus:outline-none"
            />
          </div>

          <input
            type="text"
            name="note"
            placeholder="Short Note"
            value={form.note}
            onChange={handleChange}
            className="bg-zinc-800 text-white px-4 py-2 rounded-md w-full placeholder-gray-400 focus:outline-none"
          />

          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="bg-zinc-800 text-white px-4 py-2 rounded-md w-full placeholder-gray-400 focus:outline-none"
          ></textarea>

          {/* Stylish Image Upload */}
          <div className="border-2 border-dashed border-zinc-600 p-4 rounded-lg relative group bg-zinc-800">
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-white transition"
            >
              {image ? (
                <div className="w-full flex flex-col items-center gap-2">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="max-h-40 rounded-md object-cover border border-zinc-700"
                  />
                  <span className="text-sm text-teal-400">
                    Click to change image
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8">
                  <svg
                    className="w-10 h-10 text-gray-400 group-hover:text-teal-400 transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-sm">Click or drag an image here</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="border border-zinc-500 text-gray-300 px-6 py-2 rounded-md hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-black px-6 py-2 rounded-md font-semibold transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
