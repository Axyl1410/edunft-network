import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export type CatDocument = Cat & Document;

export const CatSchema = SchemaFactory.createForClass(Cat);
