import mongoose from 'mongoose';

interface MongooseConn {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
}

const dbhost = `${process.env.DB_CLUSTER}.${process.env.DB_HOST_KEY}.mongodb.net`;
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${dbhost}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`;
let cached: MongooseConn = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;
    try {
        cached.promise = cached.promise || mongoose.connect(uri);
        cached.conn = await cached.promise
        console.log('Connected to MongoDB database.');
        return cached.conn;
    } catch (error: any) {
        console.error('Connexion to MongoDB fails : ', error, '.');
        throw new Error(error);
    }
}

export { connectToDatabase };