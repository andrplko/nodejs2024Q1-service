import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  create(createTrackDto: CreateTrackDto) {
    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Track id is invalid');
    }

    const track: Track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Track id is invalid');
    }

    const trackIndex = this.tracks.findIndex((track) => track.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    const track = this.tracks[trackIndex];

    const updatedTrack: Track = {
      ...track,
      ...updateTrackDto,
    };

    this.tracks.splice(trackIndex, 1, updatedTrack);

    return updatedTrack;
  }

  remove(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Track id is invalid');
    }

    const trackIndex = this.tracks.findIndex((track) => track.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks.splice(trackIndex, 1);
    this.favoritesService.removeTrackFromFavorites(id);
  }
}
