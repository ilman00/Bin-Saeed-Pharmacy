const mongoose = require("mongoose");
const SaleTransactionSchema = new mongoose.Schema({
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "SoldItem" }],
    totalPrice: { type: Number, required: true },
    salesperson: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
      name: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
  });
  
const SaleTransaction = mongoose.model("SaleTransaction", SaleTransactionSchema);

module.exports = SaleTransaction;