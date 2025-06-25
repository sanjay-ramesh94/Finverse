import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";

export default function ReceiptScanner() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState({
    amount: "",
    date: "",
    category: "Misc",
    notes: "",
  });

  const navigate = useNavigate();

  const handleImage = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setText("");
    setParsedData({ amount: "", date: "", category: "Misc", notes: "" });
  };

  const extractTransactionDetails = (rawText) => {
    const lines = rawText.split("\n");
    let amount = "";
    let date = "";
    let notes = "";

    const amountRegex = /(?:Total|Amount|₹|\$|INR)[^\d]*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i;
    const longDateRegex = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/i;
    const shortDateRegex = /\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/;

    // 1️⃣ Extract amount
    for (let line of lines) {
      const match = line.match(amountRegex);
      if (match) {
        amount = match[1].replace(/,/g, "").trim();
        break;
      }
    }

    // 2️⃣ Extract date
    for (let line of lines) {
      const longMatch = line.match(longDateRegex);
      const shortMatch = line.match(shortDateRegex);

      if (longMatch) {
        const parsed = Date.parse(longMatch[0]);
        if (!isNaN(parsed)) {
          date = new Date(parsed).toISOString().slice(0, 10);
          break;
        }
      } else if (shortMatch) {
        const parsed = Date.parse(shortMatch[0]);
        if (!isNaN(parsed)) {
          date = new Date(parsed).toISOString().slice(0, 10);
          break;
        }
      }
    }

    // 3️⃣ Fallback Notes (first few lines)
    notes = lines.slice(0, 5).join(" ");

    return { amount, date, category: "Misc", notes };
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m),
      });
      const extractedText = result.data.text;
      setText(extractedText);
      const extractedData = extractTransactionDetails(extractedText);
      setParsedData(extractedData);
    } catch (err) {
      alert("❌ OCR failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">📷 Receipt Scanner</h2>

      <input type="file" accept="image/*" onChange={handleImage} />
      {image && (
        <img
          src={image}
          alt="receipt"
          className="mt-4 w-60 rounded shadow"
        />
      )}

      <button
        onClick={handleScan}
        className="mt-4 bg-yellow-400 px-4 py-2 rounded text-black font-bold"
      >
        Scan Receipt
      </button>

      {loading && <p className="mt-2 text-gray-400">🔍 Scanning...</p>}

      {text && (
        <div className="mt-6 bg-zinc-800 p-4 rounded space-y-2">
          <h3 className="font-semibold mb-2 text-yellow-400">📝 Extracted Transaction:</h3>
          <p><strong>Amount:</strong> ₹{parsedData.amount}</p>
          <p><strong>Date:</strong> {parsedData.date}</p>
          <p><strong>Category:</strong> {parsedData.category}</p>
          <p><strong>Notes:</strong> {parsedData.notes}</p>

          <button
            onClick={() => navigate("/add", { state: parsedData })}
            className="mt-4 bg-green-500 px-4 py-2 rounded text-white font-bold"
          >
            ➕ Add to Transactions
          </button>
        </div>
      )}
    </div>
  );
}
