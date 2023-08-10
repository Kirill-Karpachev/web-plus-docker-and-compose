import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Length, IsString, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { BaseEntity } from 'src/utils/base-entity';

@Entity('wishes')
export class Wish extends BaseEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'numeric', scale: 2 })
  price: number;

  @Column({ type: 'numeric', scale: 2, default: 0 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  // @Column()
  // @Length(1, 1024)
  // @IsString()
  // description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ type: 'int', default: 0 })
  copied: number;
}
