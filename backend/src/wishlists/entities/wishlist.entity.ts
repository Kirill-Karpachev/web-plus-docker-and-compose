import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Length, IsString, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { BaseEntity } from 'src/utils/base-entity';

@Entity('wishlists')
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  // @Column()
  // @Length(0, 1500)
  // @IsString()
  // description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
