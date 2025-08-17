import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	clerkId: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 128,
		unique: true,
		index: true,
	},
	birthday: {
		type: Date,
		default: null,
	},
	gender: {
		type: String,
		maxlength: 3,
		default: null,
	},
	description: {
		type: String,
		maxlength: 1500,
	},
	score: {
		type: Number,
		min: 0,
		max: 5,
	}
});

export type UserDoc = mongoose.InferSchemaType<typeof userSchema>;

const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User, userSchema };
