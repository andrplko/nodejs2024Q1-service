import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Album')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  year: number;

  @Column('uuid', { nullable: true })
  artistId?: string | null;
}
