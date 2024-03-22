import { AlbumService } from 'src/album/album.service';
import { Album } from 'src/album/entities/album.entity';
import { ArtistService } from 'src/artist/artist.service';
import { Artist } from 'src/artist/entities/artist.entity';
import { TrackService } from 'src/track/track.service';
import { Track } from 'src/track/entities/track.entity';

export type Entity = Artist | Album | Track;
export type Service = ArtistService | AlbumService | TrackService;

export enum EntityType {
  Artists = 'artists',
  Albums = 'albums',
  Tracks = 'tracks',
}
