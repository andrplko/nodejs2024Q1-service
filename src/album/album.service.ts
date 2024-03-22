import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { Track } from 'src/track/entities/track.entity';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };

    return this.albumRepository.save(newAlbum);
  }

  async findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    const album: Album | null = await this.albumRepository.findOne({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album: Album | null = await this.albumRepository.findOne({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException("Album with provided id doesn't exist");
    }

    const updatedAlbum: Album = {
      ...album,
      ...updateAlbumDto,
    };

    return this.albumRepository.save(updatedAlbum);
  }

  async remove(id: string): Promise<void> {
    const album: Album | null = await this.albumRepository.findOne({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException("Album with provided id doesn't exist");
    }

    await this.albumRepository.delete(id);
    this.favoritesService.removeAlbumFromFavorites(id);

    const tracks: Track[] = await this.trackService.findAll();
    const track: Track | undefined = tracks.find(
      (track) => track.albumId === id,
    );

    if (track) {
      await this.trackService.update(track.id, { albumId: null });
    }
  }
}
