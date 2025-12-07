import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title!: string;

  @Prop({ type: [String], required: true })
  genre!: string[];

  @Prop({ required: true })
  duration!: number;


  @Prop()
  description?: string;

  @Prop()
  posterUrl?: string;

  @Prop()
  trailerUrl?: string;


  @Prop()
  releaseDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  ratingAge?: number;

  @Prop()
  country?: string;

  @Prop()
  language?: string;
  
  @Prop({ type: [String] })
  actors?: string[];

  @Prop()
  director?: string;

  @Prop()
  producer?: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
MovieSchema.index({ releaseDate: 1, endDate: 1 });
