import { Document, model, Schema } from 'mongoose';

/**
 * Interface to model the User Schema for TypeScript.
 * @param username:string
 * @param hashedPassword:string
 * @param transactions:Schema.Types.ObjectId[]
 */

export interface IUser extends Document {
  username: string;
  hashedPassword: string;
  transactions:  Schema.Types.ObjectId[];
}

const userSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    minlength: 6,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
    minlength: 8,
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tx',
    },
  ],
});

const User = model<IUser>('User', userSchema);

export default User;
