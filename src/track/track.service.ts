import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    return this.trackRepository.save(createTrackDto);
  }

  async findAll() {
    return this.trackRepository.find({ relations: ['album', 'artist'] });
  }

  async findOne(id: string) {
    const track: Track | null = await this.trackRepository.findOne({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException("Track with provided id doesn't exist");
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track: Track | null = await this.trackRepository.findOne({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException("Track with provided id doesn't exist");
    }

    const updatedTrack: Track = {
      ...track,
      ...updateTrackDto,
    };

    return this.trackRepository.save(updatedTrack);
  }

  async remove(id: string) {
    const track: Track | null = await this.trackRepository.findOne({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException("Track with provided id doesn't exist");
    }

    await this.trackRepository.delete(id);
    this.favoritesService.removeTrackFromFavorites(id);
  }
}
