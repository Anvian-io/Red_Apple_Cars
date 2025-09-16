import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    service_index_id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    main_image: {
      type: String, 
      required: true,
    }
  },
  { timestamps: true }
);

serviceSchema.index({service_index_id: 1 });


export default mongoose.model("Service", serviceSchema);
