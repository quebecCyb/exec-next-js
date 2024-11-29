// Define the SWOTItem schema
import {KpiSchema} from "@/app/api/projects/structure/kpi";
import {Schema} from "mongoose";

export const SwotItemSchema = new Schema({
  content: { type: String, required: true },
  type: { type: Number, required: true },
  critical_success_factor: { type: String, required: true },
  kpi: { type: KpiSchema, required: true },
});

