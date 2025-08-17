import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewerId: {
        type: mongoose.Schema.Types.String,
		index: true,
    },
    reviewedId: {
        type: mongoose.Schema.Types.String,
        index: true,
    },
    rating: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 0,
        max: 5,
    },
    comment: {
        type: mongoose.Schema.Types.String,
        minlength: 2,
        maxlength: 1000,
    }
}, {
	timestamps: true
})
.index({reviewerId: 1, reviewedId: 1}, {unique: true});

reviewSchema.virtual('reviewer', {
	ref: 'User',
	localField: 'reviewerId',
	foreignField: 'clerkId',
	justOne: true
  });
  
  reviewSchema.virtual('reviewed', {
	ref: 'User',
	localField: 'reviewedId',
	foreignField: 'clerkId',
	justOne: true
  });
  
  reviewSchema.set('toJSON', { virtuals: true });
  reviewSchema.set('toObject', { virtuals: true });
export type ReviewDoc = mongoose.InferSchemaType<typeof reviewSchema>;

const Review = mongoose.models.Review || mongoose.model<ReviewDoc>('Review', reviewSchema);

export { Review, reviewSchema };
