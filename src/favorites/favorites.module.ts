import { Module, forwardRef } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TrackModule } from 'src/track/track.module';
import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
