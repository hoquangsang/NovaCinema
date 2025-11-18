import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  genre!: string;

  @Prop({ required: true })
  duration!: number;


  @Prop()
  description?: string;

  @Prop()
  posterUrl?: string;

  @Prop()
  trailerUrl?: string;


  @Prop({ required: true })
  releaseDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  // --- Additional info ---
  @Prop()
  ratingAge?: number;

  @Prop()
  country?: string;

  @Prop()
  language?: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
MovieSchema.index({ releaseDate: 1, endDate: 1 });
