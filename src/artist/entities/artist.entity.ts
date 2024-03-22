import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Artist')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('boolean')
  grammy: boolean;
}
