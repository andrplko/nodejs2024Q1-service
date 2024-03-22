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
import { Track } from 'src/track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';

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
        .leftJoinAndSelect('favs.artists', 'artists')
        .leftJoinAndSelect('favs.albums', 'albums')
        .leftJoinAndSelect('favs.tracks', 'tracks')
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

  async findAll() {
    const favorites: Favorites | undefined = await this.favoritesRepository
      .createQueryBuilder('favs')
      .leftJoinAndSelect('favs.artists', 'artists')
      .leftJoinAndSelect('favs.albums', 'albums')
      .leftJoinAndSelect('favs.tracks', 'tracks')
      .getOne();

    if (!favorites) {
      return { artists: [], albums: [], tracks: [] };
    }

    return favorites;
  }

  async addTrackToFavorites(trackId: string) {
    const tracks: Track[] = await this.trackService.findAll();
    const track: Track | undefined = tracks.find(
      (track) => track.id === trackId,
    );

    if (!track) {
      throw new UnprocessableEntityException(
        "Track with provided id doesn't exist",
      );
    }

    const favorites = await this.createFavorites();

    if (favorites) {
      favorites.tracks.push(track);
      return await this.favoritesRepository.save(favorites);
    }
  }

  async removeTrackFromFavorites(trackId: string) {
    const favorites = await this.createFavorites();

    favorites.tracks = favorites.tracks.filter((track) => track.id !== trackId);
    await this.favoritesRepository.save(favorites);
  }

  async addArtistToFavorites(artistId: string) {
    const artists: Artist[] = await this.artistService.findAll();
    const artist: Artist | undefined = artists.find(
      (artist) => artist.id === artistId,
    );

    if (!artist) {
      throw new UnprocessableEntityException(
        "Artist with provided id doesn't exist",
      );
    }

    const favorites = await this.createFavorites();

    if (favorites) {
      favorites.artists.push(artist);
      return await this.favoritesRepository.save(favorites);
    }
  }

  async removeArtistFromFavorites(artistId: string) {
    const favorites = await this.createFavorites();

    favorites.artists = favorites.artists.filter(
      (artist) => artist.id !== artistId,
    );
    await this.favoritesRepository.save(favorites);
  }

  async addAlbumToFavorites(albumId: string) {
    const albums: Album[] = await this.albumService.findAll();
    const album: Album | undefined = albums.find(
      (album) => album.id === albumId,
    );

    if (!album) {
      throw new UnprocessableEntityException(
        "Album with provided id doesn't exist",
      );
    }

    const favorites = await this.createFavorites();

    if (favorites) {
      favorites.albums.push(album);
      return await this.favoritesRepository.save(favorites);
    }
  }

  async removeAlbumFromFavorites(albumId: string) {
    const favorites = await this.createFavorites();

    favorites.albums = favorites.albums.filter((album) => album.id !== albumId);
    await this.favoritesRepository.save(favorites);
  }
}
