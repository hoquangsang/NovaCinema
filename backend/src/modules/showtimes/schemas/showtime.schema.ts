import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { ROOM_TYPE_VALUES, ROOM_TYPES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';
import { Room, Theater } from 'src/modules/theaters';
import { Movie } from 'src/modules/movies';

export type ShowtimeDocument = HydratedDocument<Showtime>;

@Schema({ timestamps: true })
export class Showtime {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Movie.name,
    required: true,
    immutable: true,
  })
  movieId!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Theater.name,
    required: true,
    immutable: true,
  })
  theaterId!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Room.name,
    required: true,
    immutable: true,
  })
  roomId!: Types.ObjectId;

  @Prop({
    type: String,
    enum: ROOM_TYPE_VALUES,
    default: ROOM_TYPES._2D,
    required: true,
    immutable: true,
  })
  roomType!: RoomType; // snapshot, not 3NF, improve later

  @Prop({ required: true })
  startAt!: Date;

  @Prop({ required: true })
  endAt!: Date;

  @Prop({ default: true })
  isActive?: boolean;
}

export const ShowtimeSchema = SchemaFactory.createForClass(Showtime);

ShowtimeSchema.index({ roomId: 1, startAt: 1 }, { unique: true });
ShowtimeSchema.index(
  { movieId: 1, theaterId: 1, startAt: 1, roomType: 1 },
  { unique: true },
);
