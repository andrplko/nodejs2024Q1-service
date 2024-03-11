import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrack(@Param('id') id: string) {
    return this.favoritesService.addTrackToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id') id: string) {
    return this.favoritesService.removeTrackFromFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addArtist(@Param('id') id: string) {
    return this.favoritesService.addArtistToFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id') id: string) {
    return this.favoritesService.removeArtistFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  async addAlbum(@Param('id') id: string) {
    return this.favoritesService.addAlbumToFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id') id: string) {
    return this.favoritesService.removeAlbumFromFavorites(id);
  }
}
