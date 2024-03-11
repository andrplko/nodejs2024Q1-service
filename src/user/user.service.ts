import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const newUser: User = new User({
      ...createUserDto,
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    this.users.push(newUser);

    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('User id is invalid');
    }

    const user: User = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('User id is invalid');
    }

    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException("User with provided id doesn't exist");
    }

    const user = this.users[userIndex];

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    const updatedUser: User = new User({
      ...user,
      version: user.version + 1,
      updatedAt: Date.now(),
      password: updateUserDto.newPassword,
    });

    this.users.splice(userIndex, 1, updatedUser);

    return updatedUser;
  }

  remove(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('User id is invalid');
    }

    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException("User with provided id doesn't exist");
    }

    this.users.splice(userIndex, 1);
  }
}
