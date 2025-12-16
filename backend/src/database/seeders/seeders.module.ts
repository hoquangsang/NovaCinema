import { Module } from "@nestjs/common";
import { SeederService } from "./seeder.service";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "../database.module";
import { MoviesSeederModule } from "./movies/movies-seeder.module";
import { TheaterSeederModule } from "./theaters/theaters-seeder.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MoviesSeederModule,
    TheaterSeederModule
  ],
  providers: [
    SeederService
  ],
  exports: [
    SeederService
  ]
})
export class SeederModule {}