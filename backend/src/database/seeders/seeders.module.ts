import { Module } from "@nestjs/common";
import { SeederService } from "./seeder.service";
import { MoviesSeederModule } from "./movies/movies-seeder.module";
import { TheaterSeederModule } from "./theaters/theaters-seeder.module";

@Module({
    imports: [
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