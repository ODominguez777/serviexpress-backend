import { Injectable, ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ValidationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}
  async checkUserUniqueness(username: string, email: string): Promise<void> {
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      const errors = [];
      if (existingUser.username === username && existingUser.email === email) {
        errors.push('Both username and email are already in use.');
      } else {
        if (existingUser.username === username) {
          errors.push('Username Already Exists');
        }
        if (existingUser.email === email) {
          errors.push('Email Already Exists');
        }
      }

      throw new ConflictException(errors);
    }
  }
}
