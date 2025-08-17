import { LIMIT_PER_REQUEST } from "@/lib/constants";
import { Photo } from "@/models/photo";
import { writeFile } from "fs/promises";
import mongoose from "mongoose";

export async function addRidePhoto(data: {
  rideId: string;
  uploaderId: string;
  file: File;
}) {
  try {
    const buffer = Buffer.from(await data.file.arrayBuffer());
    const path = `/memories/${data.uploaderId}_${data.file.name}`
    await writeFile(path, buffer.toString('binary'));

    return await Photo.create({
      uploaderId: data.uploaderId,
      rideId: data.rideId,
    });
  } catch(error) {
    throw error;
  }
}

export async function getAuthenticatedUserPhotos(userId: string, params: {
  step: number,
}) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const photos = await Photo.aggregate([
    {
      $lookup: {
        from: 'rides',
        localField: 'rideId',
        foreignField: '_id',
        as: 'ride'
      }
    },
    {
      $lookup: {
        from: 'bookings',
        localField: 'rideId',
        foreignField: 'rideId',
        as: 'booking'
      }
    },
    {
      $match: {
        $or: [
          { uploaderId: objectId },
          { 'ride.driverId': objectId },
          { 'booking.userId': objectId }
        ]
      }
    },
    {
      $sort: { uploadedAt: -1 }
    },
    {
      $project: {
        url: 1,
        uploaderId: 1,
        rideId: 1,
        uploadedAt: 1
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'uploaderId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        path: 1,
        updatedAt: 1,
        user: {
          imageUrl: '$user.imageUrl',
          username: '$user.username'
        }
      }
    },
    {
      $skip: LIMIT_PER_REQUEST.photos * params.step
    },
    {
      $limit: LIMIT_PER_REQUEST.photos
    },
  ]);

  return photos;
}

export async function getUserPhotos(userId: string, params: {
  step: number,
}) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const photos = await Photo.aggregate([
    {
      $lookup: {
        from: 'rides',
        localField: 'rideId',
        foreignField: '_id',
        as: 'ride'
      }
    },
    {
      $lookup: {
        from: 'bookings',
        localField: 'rideId',
        foreignField: 'rideId',
        as: 'booking'
      }
    },
    {
      $match: {
        $or: [
          { uploaderId: objectId },
          { 'ride.driverId': objectId },
          { 'booking.userId': objectId }
        ]
      }
    },
    {
      $sort: { uploadedAt: -1 }
    },
    {
      $project: {
        url: 1,
        uploaderId: 1,
        rideId: 1,
        uploadedAt: 1
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'uploaderId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        path: 1,
        updatedAt: 1,
        user: {
          imageUrl: '$user.imageUrl',
          username: '$user.username'
        }
      }
    },
    {
      $skip: LIMIT_PER_REQUEST.photos * params.step
    },
    {
      $limit: LIMIT_PER_REQUEST.photos
    },
  ]);

  return photos;
}
