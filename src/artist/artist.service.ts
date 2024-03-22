import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };

    return this.artistRepository.save(newArtist);
  }

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    const artist: Artist | null = await this.artistRepository.findOne({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException("Artist with provided id doesn't exist");
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist: Artist | null = await this.artistRepository.findOne({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException("Artist with provided id doesn't exist");
    }

    const updatedArtist: Artist = {
      ...artist,
      ...updateArtistDto,
    };

    return this.artistRepository.save(updatedArtist);
  }

  async remove(id: string): Promise<void> {
    const artist: Artist | null = await this.artistRepository.findOne({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException("Artist with provided id doesn't exist");
    }

    await this.artistRepository.delete(id);
    this.favoritesService.removeArtistFromFavorites(id);

    const albums: Album[] = await this.albumService.findAll();
    const album: Album | undefined = albums.find(
      (album) => album.artistId === id,
    );

    if (album) {
      await this.albumService.update(album.id, { artistId: null });
    }

    const tracks: Track[] = await this.trackService.findAll();
    const track: Track | undefined = tracks.find(
      (track) => track.artistId === id,
    );

    if (track) {
      await this.trackService.update(track.id, { artistId: null });
    }
  }
}
