import mongoose, { Document, Schema, Model, Types } from "mongoose";
import {SaveDataSchema} from "@/app/api/projects/structure/table";

export interface ProjectDocument extends Document {
  name: string;
  snapshot: typeof SaveDataSchema;
  user: Types.ObjectId; // Reference to the user identifier
}

const ProjectSchema: Schema<ProjectDocument> = new Schema({
  name: { type: String, required: true },
  snapshot: { type: SaveDataSchema, required: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Project: Model<ProjectDocument> = mongoose.models?.Project || mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default Project;
