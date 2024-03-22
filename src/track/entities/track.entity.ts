import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Track')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('uuid', { nullable: true })
  artistId?: string | null;

  @Column('uuid', { nullable: true })
  albumId?: string | null;

  @Column('int')
  duration: number;
}
