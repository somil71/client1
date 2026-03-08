import mongoose, { Document, Schema } from 'mongoose';

export interface IRequest extends Document {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  typeOfHelp: 'antim-kit' | 'pandit' | 'cremation' | 'community-support' | 'other';
  description: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed';
  documents: string[];
  adminNotes: string;
  userId?: string;
  assignedTo?: string;
  responseMessage?: string;
  trackingId: string;
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9\-\+\(\)\s]{10,}$/, 'Invalid phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      minlength: [5, 'Address must be at least 5 characters']
    },
    typeOfHelp: {
      type: String,
      enum: ['antim-kit', 'pandit', 'cremation', 'community-support', 'other'],
      required: [true, 'Type of help is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'approved', 'rejected', 'completed'],
      default: 'pending',
      index: true
    },
    documents: {
      type: [String],
      default: []
    },
    adminNotes: {
      type: String,
      default: '',
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    responseMessage: {
      type: String,
      default: '',
      maxlength: [2000, 'Response message cannot exceed 2000 characters']
    },
    trackingId: {
      type: String,
      unique: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
RequestSchema.index({ status: 1, createdAt: -1 });
RequestSchema.index({ email: 1 });
RequestSchema.index({ city: 1 });
RequestSchema.index({ urgencyLevel: 1 });

export default mongoose.model<IRequest>('Request', RequestSchema);
