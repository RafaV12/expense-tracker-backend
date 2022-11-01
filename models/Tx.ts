import { Document, model, Schema } from 'mongoose';

/**
 * Interface to model the User Schema for TypeScript.
 * @param userId:Schema.Types.ObjectId
 * @param type:string
 * @param description:string
 * @param date:string
 * @param amount:number
 */

export interface ITx extends Document {
  userId: Schema.Types.ObjectId;
  type: string;
  description: string;
  date: string;
  amount: number;
}

const txSchema: Schema = new Schema<ITx>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Tx = model<ITx>('Tx', txSchema);

export default Tx;
