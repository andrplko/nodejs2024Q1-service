import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { Artist } from './entities/artist.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };

    this.artists.push(newArtist);

    return newArtist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Artist id is invalid');
    }

    const artist: Artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Artist id is invalid');
    }

    const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    const artist = this.artists[artistIndex];

    const updatedArtist: Artist = {
      ...artist,
      ...updateArtistDto,
    };

    this.artists.splice(artistIndex, 1, updatedArtist);

    return updatedArtist;
  }

  remove(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Artist id is invalid');
    }

    const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.artists.splice(artistIndex, 1);
    this.favoritesService.removeArtistFromFavorites(id);

    const album: Album | undefined = this.albumService
      .findAll()
      .find((album) => album.artistId === id);

    if (album) {
      album.artistId = null;
    }

    const track: Track | undefined = this.trackService
      .findAll()
      .find((track) => track.artistId === id);

    if (track) {
      track.artistId = null;
    }
  }
}
