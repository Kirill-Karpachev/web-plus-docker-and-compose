import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from 'src/hash/hash.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const passwordHash = await this.hashService.hash(dto.password);
    const user = await this.userRepository.create({
      ...dto,
      password: passwordHash,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findMany(user: { query: any }): Promise<User[]> {
    return await this.userRepository.find({
      where: [{ username: user.query }, { email: user.query }],
    });
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete({ id });
  }

  async updateById(id: number, dto: UpdateUserDto): Promise<User> {
    if (dto.password) {
      dto.password = await this.hashService.hash(dto.password);
    }
    if (dto.username) {
      const username = await this.findUserByUsername(dto.username);
      if (username !== null && username.id !== id) {
        throw new BadRequestException('Этот пользователь уже существует');
      }
    }
    if (dto.email) {
      const email = await this.findUserByEmail(dto.email);
      if (email !== null && email.id !== id) {
        throw new BadRequestException('Этот пользователь уже существует');
      }
    }
    await this.userRepository.update({ id }, dto);
    const updatedUser = await this.findUserById(id);
    delete updatedUser.password;
    return updatedUser;
  }
}
