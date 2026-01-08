export type { SeatMap, RoomDocument, TheaterDocument } from './schemas';
export { Seat, Room, Theater, RoomSchema, TheaterSchema } from './schemas';

export { RoomRepository, TheaterRepository } from './repositories';
export { RoomService, SeatService, TheaterService } from './services';
export { RoomsController, TheatersController } from './controllers';

export { TheatersModule } from './theaters.module';
