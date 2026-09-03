import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // Hashed password
}

export const UserSchema = SchemaFactory.createForClass(User);

// Ensure the schema doesn't return the password in JSON responses
UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete (ret as any).password;
    delete (ret as any).__v;
    return ret;
  },
});
