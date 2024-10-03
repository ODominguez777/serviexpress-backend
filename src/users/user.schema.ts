import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  profilePicUrl: string;

  @Prop()
  phone: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isBanned: boolean;

  @Prop({
    enum: ['admin', 'handyman', 'user'],
    default: 'user',
    required: true,
  })
  role: string;

  @Prop({ required: false }) // Añadir código de activación
  activationCode: string | null;
}
export const UserSchema = SchemaFactory.createForClass(User);
