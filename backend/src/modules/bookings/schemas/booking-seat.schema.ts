import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SeatType } from 'src/modules/theaters/types';

@Schema({ _id: false })
export class BookingSeat {
  @Prop({
    type: String,
    required: true,
    immutable: true,
  })
  seatCode!: string;

  @Prop({
    type: String,
    required: true,
    immutable: true,
  })
  seatType!: SeatType;

  @Prop({
    type: Number,
    required: true,
    immutable: true,
    min: 0,
  })
  unitPrice!: number;
}

export const BookingSeatSchema = SchemaFactory.createForClass(BookingSeat);
