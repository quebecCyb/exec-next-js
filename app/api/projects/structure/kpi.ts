// Define the KPI schema
import {Schema} from "mongoose";

export const KpiSchema = new Schema({
  name: { type: String, required: true },
  formula: { type: String, required: true },
  description: { type: String, required: true },
  perspective: { type: String, required: true },
  actuals: { type: String, required: true },
  targets: { type: String, required: true },
});
