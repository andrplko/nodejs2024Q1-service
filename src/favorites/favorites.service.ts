import {
  Inject,
  Injectable,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Favorites } from './entities/favorites.entity';
import { TrackService } from 'src/track/track.service';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { Entity, EntityType, Service } from 'src/types';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {}

  async createFavorites(): Promise<Favorites> {
    const existingFavorites: Favorites | undefined =
      await this.favoritesRepository
        .createQueryBuilder('favs')
        .leftJoinAndSelect('favs.artists', EntityType.Artists)
        .leftJoinAndSelect('favs.albums', EntityType.Albums)
        .leftJoinAndSelect('favs.tracks', EntityType.Tracks)
        .getOne();

    if (existingFavorites) {
      return existingFavorites;
    }

    const favorites: Favorites = {
      id: uuidv4(),
      artists: [],
      albums: [],
      tracks: [],
    };

    return this.favoritesRepository.save(favorites);
  }

  async addEntityToFavorites(id: string, type: string, service: Service) {
    const entities: Entity[] = await service.findAll();
    const entity: Entity | undefined = entities.find(
      (entity) => entity.id === id,
    );

    if (!entity) {
      throw new UnprocessableEntityException(
        "Entity with provided id doesn't exist",
      );
    }

    const favorites = await this.createFavorites();

    if (favorites) {
      favorites[type].push(entity);
      return this.favoritesRepository.save(favorites);
    }
  }

  async removeEntityFromFavorites(id: string, type: string) {
    const favorites = await this.createFavorites();

    favorites[type] = favorites[type].filter(
      (track: Entity) => track.id !== id,
    );
    await this.favoritesRepository.save(favorites);
  }

  async findAll() {
    const favorites: Favorites | undefined = await this.favoritesRepository
      .createQueryBuilder('favs')
      .leftJoinAndSelect('favs.artists', EntityType.Artists)
      .leftJoinAndSelect('favs.albums', EntityType.Albums)
      .leftJoinAndSelect('favs.tracks', EntityType.Tracks)
      .getOne();

    if (!favorites) {
      return { artists: [], albums: [], tracks: [] };
    }

    return favorites;
  }

  async addTrackToFavorites(trackId: string) {
    return this.addEntityToFavorites(
      trackId,
      EntityType.Tracks,
      this.trackService,
    );
  }

  async removeTrackFromFavorites(trackId: string) {
    await this.removeEntityFromFavorites(trackId, EntityType.Tracks);
  }

  async addArtistToFavorites(artistId: string) {
    return this.addEntityToFavorites(
      artistId,
      EntityType.Artists,
      this.artistService,
    );
  }

  async removeArtistFromFavorites(artistId: string) {
    await this.removeEntityFromFavorites(artistId, EntityType.Artists);
  }

  async addAlbumToFavorites(albumId: string) {
    return this.addEntityToFavorites(
      albumId,
      EntityType.Albums,
      this.albumService,
    );
  }

  async removeAlbumFromFavorites(albumId: string) {
    await this.removeEntityFromFavorites(albumId, EntityType.Albums);
  }
}
