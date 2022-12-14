import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (typeof mongoURI === 'string') {
      await connect(mongoURI);
      console.log('MongoDB Connected...');
    }
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
