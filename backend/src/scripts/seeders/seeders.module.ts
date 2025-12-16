import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "src/database/database.module";
import { UsersSeederModule } from "./users/users-seeder.module";
import { MoviesSeederModule } from "./movies/movies-seeder.module";
import { TheaterSeederModule } from "./theaters/theaters-seeder.module";
import { SeederService } from "./seeder.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersSeederModule,
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
