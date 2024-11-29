
// Define the Cluster schema
import {Schema} from "mongoose";
import {SwotItemSchema} from "@/app/api/projects/structure/swot";

export const ClusterSchema = new Schema({
  name: { type: String, required: true },
  strategy: { type: String, required: true },
  mission: { type: String, required: true },
  swot: { type: [SwotItemSchema], required: true },
});


// Define the Clusters schema
export const ClustersSchema = new Schema({
  vision: { type: String, required: true },
  mission_statement: { type: String, required: true },
  clusters: { type: [ClusterSchema], required: true },
});
