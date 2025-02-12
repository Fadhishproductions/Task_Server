import mongoose, { type Document, Schema } from "mongoose"

export interface ITask extends Document {
  name: string
  description: string
  priority: "Low" | "Medium" | "High"
  status: "To Do" | "In Progress" | "Completed"
  createdAt: Date
  updatedAt: Date
}

const TaskSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    status: { type: String, enum: ["To Do", "In Progress", "Completed"], required: true },
  },
  { timestamps: true },
)

export default mongoose.model<ITask>("Task", TaskSchema)

