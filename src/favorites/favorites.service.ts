import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { Favorites } from './entities/favorites.entity';
import { TrackService } from 'src/track/track.service';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { Track } from 'src/track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {}

  findAll() {
    return this.favorites;
  }

  addTrackToFavorites(trackId: string) {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException('Track id is invalid');
    }

    const track: Track | undefined = this.trackService
      .findAll()
      .find((track) => track.id === trackId);

    if (!track) {
      throw new UnprocessableEntityException(
        "Track with provided id doesn't exist",
      );
    }

    this.favorites.tracks.push(track);
  }

  removeTrackFromFavorites(trackId: string) {
    const tracks: Track[] = this.trackService.findAll();
    const trackIndex = tracks.findIndex((track) => track.id === trackId);

    this.favorites.tracks.splice(trackIndex, 1);
  }

  addArtistToFavorites(artistId: string) {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException('Artist id is invalid');
    }

    const artist: Artist | undefined = this.artistService
      .findAll()
      .find((artist) => artist.id === artistId);

    if (!artist) {
      throw new UnprocessableEntityException(
        "Artist with provided id doesn't exist",
      );
    }

    this.favorites.artists.push(artist);
  }

  removeArtistFromFavorites(artistId: string) {
    const artists: Artist[] = this.artistService.findAll();
    const artistIndex = artists.findIndex((artist) => artist.id === artistId);

    this.favorites.artists.splice(artistIndex, 1);
  }

  addAlbumToFavorites(albumId: string) {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException('Album id is invalid');
    }

    const album: Album | undefined = this.albumService
      .findAll()
      .find((album) => album.id === albumId);

    if (!album) {
      throw new UnprocessableEntityException(
        "Album with provided id doesn't exist",
      );
    }

    this.favorites.albums.push(album);
  }

  removeAlbumFromFavorites(albumId: string) {
    const albums: Album[] = this.albumService.findAll();
    const albumIndex = albums.findIndex((album) => album.id === albumId);

    this.favorites.albums.splice(albumIndex, 1);
  }
}
