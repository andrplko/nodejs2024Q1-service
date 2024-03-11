import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { Track } from 'src/track/entities/track.entity';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Album id is invalid');
    }

    const album: Album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Album id is invalid');
    }

    const albumIndex = this.albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException("Album with provided id doesn't exist");
    }

    const album = this.albums[albumIndex];

    const updatedAlbum: Album = {
      ...album,
      ...updateAlbumDto,
    };

    this.albums.splice(albumIndex, 1, updatedAlbum);

    return updatedAlbum;
  }

  remove(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Album id is invalid');
    }

    const albumIndex = this.albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.albums.splice(albumIndex, 1);
    this.favoritesService.removeAlbumFromFavorites(id);

    const track: Track | undefined = this.trackService
      .findAll()
      .find((track) => track.albumId === id);

    if (track) {
      track.albumId = null;
    }
  }
}
