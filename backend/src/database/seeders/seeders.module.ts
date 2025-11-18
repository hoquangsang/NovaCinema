import { Module } from "@nestjs/common";
import { MoviesSeederModule } from "./movies/movies.seeder.module";
import { SeederService } from "./seeder.service";

@Module({
    imports: [
        MoviesSeederModule
    ],
    providers: [
        SeederService
    ],
    exports: [
        SeederService
    ]
})
export class SeederModule {}