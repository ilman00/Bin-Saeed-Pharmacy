const mongoose = require("mongoose");

// Counter schema for auto-increment tracking
const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", CounterSchema);

// SaleTransaction schema
const SaleTransactionSchema = new mongoose.Schema({
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "SoldItem" }],
  totalPrice: { type: Number, required: true },
  salesperson: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String }
  },
  totalProfit: { type: Number, required: true },
  transactionNumber: {
    type: String,
    unique: true,
    index: true
  }
}, { timestamps: true });

// Pre-save hook to assign incremental transaction number
SaleTransactionSchema.pre("save", async function(next) {
  if (this.transactionNumber) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "transactionNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const formatted = String(counter.seq).padStart(6, "0");
    this.transactionNumber = `TRX-${formatted}`;
    next();
  } catch (error) {
    next(error);
  }
});

const SaleTransaction = mongoose.model("SaleTransaction", SaleTransactionSchema);

module.exports = SaleTransaction;
