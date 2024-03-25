import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = new User({
      ...createUserDto,
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User with provided id doesn't exist");
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User with provided id doesn't exist");
    }

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    return this.userRepository.save(
      new User({
        ...user,
        version: user.version + 1,
        createdAt: Number(user.createdAt),
        updatedAt: Date.now(),
        password: updateUserDto.newPassword,
      }),
    );
  }

  async remove(id: string): Promise<void> {
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User with provided id doesn't exist");
    }

    await this.userRepository.delete(id);
  }
}
