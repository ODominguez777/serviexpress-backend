import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';
import { comparePasswords, hashPassword } from 'src/utils/password.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { EmailService } from 'src/email/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly emailService: EmailService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(createUserDto.password);
    const activationCode = uuidv4();
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      activationCode,
    });
    const activationUrl = `${process.env.BACKEND_URL}/users/activate-account?code=${activationCode}`;
    await this.emailService.sendActivationEmail(
      createUserDto.email,
      activationUrl
    );
    const user = await newUser.save();
    return user;
  }
  async activateAccount(activationCode: string): Promise<void> {
    const user = await this.userModel.findOne({ activationCode }).exec();

    if (!user) {
      throw new NotFoundException('Invalid activation code.');
    }

    if (user.isActive) {
      throw new BadRequestException('Account is already activated.');
    }

    user.isActive = true;
    user.activationCode = null;
    try {
      await user.save();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec(); // Encuentra todos los usuarios
  }

  async findUserById(id: string): Promise<Partial<User>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    const user = await this.userModel
      .findById(id)
      .select('name lastname email username profilePicUrl phone -_id ')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findUserByUsernameOrEmail(identifier: string): Promise<Partial<User>> {
    const user = await this.userModel
      .findOne({
        $or: [{ username: identifier }, { email: identifier }],
      })
      .select('name lastname email username profilePicUrl phone -_id')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${identifier} not found`);
    }
    return user;
  }

  async findUserForAuth(identifier: string): Promise<UserDocument | null> {
    const user = await this.userModel
      .findOne({
        $or: [{ username: identifier }, { email: identifier }],
      })
      .select('+password')
      .exec();

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<Partial<User>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .select('name lastname email username profilePicUrl phone -_id')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    if (updatePasswordDto.currentPassword === updatePasswordDto.password) {
      throw new BadRequestException('You must choose different passwords');
    }
    const user = await this.userModel.findById(id).select('+password').exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isMatch = await comparePasswords(
      updatePasswordDto.currentPassword,
      user.password
    );

    if (!isMatch) {
      throw new BadRequestException('The password is incorrect');
    }

    const hashedPassword = await hashPassword(updatePasswordDto.password);

    await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { password: hashedPassword } },
        { new: true }
      )
      .exec();
  }
}
