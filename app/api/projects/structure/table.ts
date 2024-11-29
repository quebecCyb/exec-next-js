import {Schema} from "mongoose";
import {ClustersSchema} from "@/app/api/projects/structure/cluster";

const TableDataSchema = new Schema({
  clusters: { type: ClustersSchema, required: true },
  required_kpi: Schema.Types.Mixed,
});



// Define the SaveData schema with nested structures
export const SaveDataSchema = new Schema({
  swot: {
    strength: { type: String, required: true },
    weaknesses: { type: String, required: true },
    opportunities: { type: String, required: true },
    threats: { type: String, required: true },
  },
  requiredReport: [{ type: String, required: true }],
  extractReport: [{ type: String, required: true }],
  analysis: { type: TableDataSchema, required: true },
});

